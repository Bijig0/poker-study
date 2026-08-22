---
title: "How this site works"
summary: "Write markdown in notes/, run ./sync, read it anywhere."
---

This is the study journal. Notes are markdown files in a GitHub repo, and the site republishes itself on every commit.

## Writing from any laptop

Click **✎ write** at the top of the site, enter the password, and you're in the editor: pick a note from the sidebar or hit **+ New note**, write markdown, hit **Publish**. The site updates in about a minute. Every note also has an **edit this note ✎** link at the bottom that jumps straight to it in the editor.

The login is remembered per browser, so normally you only type the password once per laptop.

(Backup path: the repo is still editable on github.com, including the `.`-for-VS-Code trick.)

## Writing locally (optional)

If a laptop has the repo cloned at `~/Desktop/poker-study`:

```
./note "SB vs BB single-raised pots"   # create + open a note
./sync                                 # pull, commit, push
```

On a new laptop: `git clone https://github.com/Bijig0/poker-study.git`

## Writing notes

Notes are plain markdown files in `notes/`, named `YYYY-MM-DD-title.md`. The date prefix sets the date shown on the site. Front matter is just a title and an optional one-line summary for the index page.

Ranges and numbers look best in code spans: `22+, A2s+, KTs+, AJo+` — and tables work too:

| Spot | Freq | Size |
|------|------|------|
| BTN open | 44% | 2.5x |
| SB 3bet vs BTN | 13% | 10bb |

---

That's it. No database, no CMS, nothing to maintain.
