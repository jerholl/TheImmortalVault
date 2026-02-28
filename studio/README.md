# The Immortal Vault Studio

Sanity Studio for writing and publishing Dispatch posts.

## 1) Install

From the `studio` folder:

```bash
npm install
```

## 2) Connect to a Sanity project

Create `studio/.env` from `.env.example`:

```bash
SANITY_STUDIO_PROJECT_ID=yourProjectId
SANITY_STUDIO_DATASET=production
```

Then authenticate once:

```bash
npx sanity login
```

## 3) Run Studio

```bash
npm run dev
```

Create and publish `Post` documents with:
- title
- slug
- published date
- excerpt
- body
- optional cover image

## 4) Publish website posts

The main site reads published posts from Sanity on:
- `dispatch.html` (post list)
- `dispatch-post.html` (single post by slug)
