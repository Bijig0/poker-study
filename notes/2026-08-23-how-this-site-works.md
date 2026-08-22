---
title: "How this site works"
summary: "Write markdown in notes/, run ./sync, read it anywhere."
---

This is the study journal. It lives at `~/Desktop/poker-study` on each laptop and publishes itself to GitHub Pages on every push.

## Daily workflow

Start a note (creates the file and opens it):

```
./note "SB vs BB single-raised pots"
```

When you're done writing (or whenever), publish:

```
./sync
```

That pulls anything written on the other laptop, commits, pushes, and the site rebuilds itself in about a minute. On a new laptop, just:

```
git clone https://github.com/Bijig0/poker-study.git
```

## Writing notes

Notes are plain markdown files in `notes/`, named `YYYY-MM-DD-title.md`. The date prefix sets the date shown on the site. Front matter is just a title and an optional one-line summary for the index page.

Ranges and numbers look best in code spans: `22+, A2s+, KTs+, AJo+` — and tables work too:

| Spot | Freq | Size |
|------|------|------|
| BTN open | 44% | 2.5x |
| SB 3bet vs BTN | 13% | 10bb |

---

That's it. No database, no CMS, nothing to maintain.
