import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
  );

  // Nested folder tree from the note collection, keyed by path under notes/.
  eleventyConfig.addFilter("noteTree", (notes) => {
    const root = { folders: {}, notes: [] };
    for (const n of notes) {
      const parts = n.page.filePathStem.replace(/^\/notes\//, "").split("/");
      parts.pop();
      let node = root;
      for (const seg of parts) {
        node.folders[seg] ??= { folders: {}, notes: [] };
        node = node.folders[seg];
      }
      node.notes.push(n);
    }
    const sortRec = (node) => {
      node.notes.sort((a, b) =>
        (a.data.title || "").localeCompare(b.data.title || "", undefined, { sensitivity: "base" })
      );
      node.folders = Object.fromEntries(
        Object.entries(node.folders)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => [k, sortRec(v)])
      );
      return node;
    };
    return sortRec(root);
  });

  eleventyConfig.addFilter("noteCrumbs", (stem) =>
    stem.replace(/^\/notes\//, "").split("/").slice(0, -1)
  );

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
  };
}
