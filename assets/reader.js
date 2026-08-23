// Shared streaming PDF reader. Two sources:
//   initReader({ mode: "remote", url, len, posKey })  – ranged fetches from a URL
//   initReader({ mode: "local",  data, posKey })      – ArrayBuffer from a local file
// Hard-won constraints (do not undo):
//  - pdf.js + worker must be same-origin (cross-origin workers hang silently)
//  - remote: custom range transport (blob store hides Accept-Ranges from CORS JS)
//  - a chunk request may NEVER be abandoned; PDF.js waits on it forever
//  - guard against cached 200s, short reads, zero innerWidth in background tabs
import * as pdfjsLib from "./pdfjs/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("./pdfjs/pdf.worker.min.mjs", import.meta.url).href;

const $ = (id) => document.getElementById(id);

export async function initReader(cfg) {
  const scroll = $("scroll");
  let pdf, zoom = 1, baseW, baseH, raw1, sizedFor = 0;
  const holders = [];
  const rendered = new Map();
  const pendingAt = new Map();
  const MAX_LIVE = 24;
  const posKey = "reader-pos:" + cfg.posKey;

  function fitWidth(vp) {
    const avail = scroll.clientWidth || innerWidth;
    const target = Math.max(320, Math.min(avail - 24, 900));
    return target / vp.width;
  }

  function makeRangeTransport() {
    return new (class extends pdfjsLib.PDFDataRangeTransport {
      constructor() { super(cfg.len, null); }
      async requestDataRange(begin, end) {
        end = Math.min(end, cfg.len);
        for (let attempt = 0; ; attempt++) {
          try {
            const r = await fetch(cfg.url, { cache: "no-store", headers: { Range: "bytes=" + begin + "-" + (end - 1) } });
            if (!r.ok) throw new Error("range fetch " + r.status);
            let buf = await r.arrayBuffer();
            if (r.status !== 206) buf = buf.slice(begin, end);
            else if (buf.byteLength > end - begin) buf = buf.slice(0, end - begin);
            if (buf.byteLength !== end - begin) throw new Error("short read " + buf.byteLength);
            this.onDataRange(begin, new Uint8Array(buf));
            return;
          } catch (e) {
            console.warn("range retry", begin, e.message);
            await new Promise((res) => setTimeout(res, Math.min(500 * (attempt + 1), 5000)));
          }
        }
      }
    })();
  }

  async function renderPage(no) {
    if (rendered.has(no)) return;
    rendered.set(no, null);
    pendingAt.set(no, performance.now());
    try {
      const page = await pdf.getPage(no);
      const scale = fitWidth(page.getViewport({ scale: 1 })) * zoom;
      const vp = page.getViewport({ scale });
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(vp.width * dpr);
      canvas.height = Math.floor(vp.height * dpr);
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null }).promise;
      const h = holders[no - 1];
      h.style.width = vp.width + "px"; h.style.height = vp.height + "px";
      h.replaceChildren(canvas);
      rendered.set(no, canvas);
      pendingAt.delete(no);
      if (rendered.size > MAX_LIVE) evictFar(no);
    } catch (e) {
      rendered.delete(no);
      pendingAt.delete(no);
      console.error("render p" + no, e);
    }
  }
  function evictFar(center) {
    const far = [...rendered.keys()].filter((n) => rendered.get(n) && Math.abs(n - center) > 12);
    for (const n of far) { holders[n - 1].replaceChildren(); rendered.delete(n); }
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) renderPage(+e.target.dataset.p);
    const midY = scroll.getBoundingClientRect().top + scroll.clientHeight / 2;
    const mid = holders.findIndex((h) => {
      const r = h.getBoundingClientRect();
      return r.top < midY && r.bottom > midY;
    });
    if (mid >= 0) {
      $("pageinfo").textContent = (mid + 1) + " / " + pdf.numPages;
      clearTimeout(io._t);
      io._t = setTimeout(() => localStorage.setItem(posKey, String(mid + 1)), 400);
    }
  }, { root: scroll, rootMargin: "1200px 0px" });

  function layout() {
    for (const h of holders) {
      if (!h.firstChild) { h.style.width = baseW * zoom + "px"; h.style.height = baseH * zoom + "px"; }
    }
  }
  function setZoom(z) {
    zoom = Math.min(3, Math.max(0.5, z));
    const midPage = parseInt($("pageinfo").textContent, 10) || 1;
    for (const [n] of rendered) holders[n - 1].replaceChildren();
    rendered.clear(); pendingAt.clear();
    layout();
    holders[midPage - 1]?.scrollIntoView();
  }
  $("z-in").onclick = () => setZoom(zoom * 1.2);
  $("z-out").onclick = () => setZoom(zoom / 1.2);

  function reflow() {
    if (!pdf || !raw1) return;
    const avail = scroll.clientWidth || innerWidth;
    if (Math.abs(avail - sizedFor) < 40) return;
    baseW = raw1.width * fitWidth(raw1); baseH = raw1.height * fitWidth(raw1);
    sizedFor = avail;
    setZoom(zoom);
  }
  let rfT = null;
  const queueReflow = () => { clearTimeout(rfT); rfT = setTimeout(reflow, 300); };
  addEventListener("resize", queueReflow);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) setTimeout(reflow, 100); });

  /* side-by-side notes: the site's own editor in a pane */
  const notesBtn = $("b-notes");
  if (notesBtn) {
    const setNotes = (on) => {
      document.body.classList.toggle("notes-on", on);
      notesBtn.classList.toggle("on", on);
      const frame = $("notes-frame");
      if (on && !frame.src) frame.src = frame.dataset.src;
      localStorage.setItem("reader-notes-on", on ? "1" : "");
      queueReflow();
    };
    notesBtn.onclick = () => setNotes(!document.body.classList.contains("notes-on"));
    if (localStorage.getItem("reader-notes-on")) setNotes(true);
  }

  /* open the document */
  const src = cfg.mode === "remote"
    ? { range: makeRangeTransport(), disableAutoFetch: true, rangeChunkSize: 1048576 }
    : { data: cfg.data };
  pdf = await pdfjsLib.getDocument(src).promise;
  const p1 = await pdf.getPage(1);
  raw1 = p1.getViewport({ scale: 1 });
  const vp1 = p1.getViewport({ scale: fitWidth(raw1) });
  baseW = vp1.width; baseH = vp1.height; sizedFor = scroll.clientWidth || innerWidth;

  const frag = document.createDocumentFragment();
  for (let i = 1; i <= pdf.numPages; i++) {
    const d = document.createElement("div");
    d.className = "pg"; d.dataset.p = i;
    d.style.width = baseW + "px"; d.style.height = baseH + "px";
    frag.appendChild(d); holders.push(d);
  }
  $("pages").appendChild(frag);
  holders.forEach((h) => io.observe(h));
  $("boot").classList.add("hidden");
  const pos = parseInt(localStorage.getItem(posKey) || "1", 10);
  if (pos > 1 && pos <= pdf.numPages) holders[pos - 1].scrollIntoView();

  // safety net: retry visible pages whose render failed or hung
  setInterval(() => {
    const top = scroll.getBoundingClientRect().top;
    for (const h of holders) {
      const r = h.getBoundingClientRect();
      if (r.bottom < top - 200 || r.top > top + scroll.clientHeight + 200 || h.firstChild) continue;
      const p = +h.dataset.p;
      const stuck = rendered.get(p) === null && performance.now() - (pendingAt.get(p) || 0) > 8000;
      if (!rendered.has(p) || stuck) { rendered.delete(p); renderPage(p); }
    }
  }, 4000);

  return pdf;
}
