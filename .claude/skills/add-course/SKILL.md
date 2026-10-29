---
name: add-course
description: Add a Course to a Learning Path from its URL – opens the source, extracts its real Parts and writes the YAML entry. Use when Mehmet gives a link to follow ("add this playlist to electricity", "ajoute ce cours à l'arabe"), or asks to add a Learning Path's first Courses.
---

# Add a Course

Input: a URL, the Learning Path (`content/<slug>.yaml`) and the Stage. If the Stage is not
given, propose one from the Path's Stages and ask.

## Steps

1. **Read the source.** Open the URL and find its real structure – never invent a Part.
   - YouTube playlist: every video, exact title, `https://www.youtube.com/watch?v=ID`,
     duration as `note`. `curl -sL -A 'Mozilla/5.0'` the playlist page and read
     `ytInitialData` (`playlistVideoRenderer`), or `yt-dlp --flat-playlist -J`.
   - Single video: title and duration; chapters from the description become Parts with
     `&t=<seconds>s` links, otherwise the Course has no Parts.
   - PDF: download it to the scratchpad, read the contents page or headings
     (`pdftotext`, `pdfinfo`), group into sections a learner finishes in a sitting; each Part
     links to `<pdf url>#page=N` and notes the page range.
   - Online course or web page: its chapters or `h2`/`h3` headings, in order, with absolute
     links (`#anchor` when the page has ids).
   - Mark a Part `optional: true` only when the source says it is advanced or skippable.

   Done when every Part has a title copied from the source, or the source could not be read
   and you have told Mehmet why.

2. **Write the entry.** Append the Course to the Stage's `courses` in the YAML: `id`, `title`
   (the source's own wording and language), `url`, `publisher`, `kind`, optional `note`,
   `summary` (one English sentence), `duration`, then `parts`. Ids are lowercase slugs: the
   Course id is short and distinct (`sincere-ch1`), Part ids are `<course-id>-<slug of the
   title>`. Every id is new – never reuse or rename an existing one.

3. **Check.** Run `bun run check:content`, then `bun run build`. Done when both pass.

4. **Show the diff** (`git diff content/`) with a one-line summary: Course, Stage, number of
   Parts, anything left out and why. Mehmet commits.
