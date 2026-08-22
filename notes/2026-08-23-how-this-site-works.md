---
title: "How this site works"
summary: "Write markdown in notes/, run ./sync, read it anywhere."
---

This is the study journal. Notes are markdown files in a GitHub repo, and the site republishes itself on every commit.

## Writing from any laptop (no setup)

Click **✎ new note** at the top of the site. It opens GitHub's web editor, logged into your GitHub account, with today's filename and the front matter already filled in. Change `untitled` in the filename to a slug, write, hit **Commit changes** — the site updates in about a minute.

Every note also has an **edit this note ✎** link at the bottom that opens that file in the same editor.

For longer sessions, press `.` while viewing the repo on github.com to get a full VS Code editor in the browser.

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
