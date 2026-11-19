# Docs Clone

A Google Docs–style editor: many documents, many tabs per document, rich-text editing ([TipTap](https://tiptap.dev), free/open source), Google-Docs keyboard shortcuts, and autosave to MongoDB. No authentication.

**Stack:** Next.js 15 (App Router) · TypeScript · pnpm · Mongoose · TipTap

## Run locally

```bash
pnpm install
cp .env.example .env     # set MONGODB_URI
docker compose up -d     # optional: local MongoDB (or use an Atlas URI)
pnpm dev                 # http://localhost:3000
```

## Deploy to Vercel

1. Create a free MongoDB Atlas cluster. Under **Network Access** allow `0.0.0.0/0` (Vercel uses dynamic IPs) and create a database user.
2. Push this branch to GitHub and import it in Vercel (it auto-detects Next.js and pnpm).
3. Add the env var `MONGODB_URI` (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/docs-clone`) in **Project Settings → Environment Variables**.
4. Deploy.

Vercel serverless requests are limited to ~4.5 MB, so a single tab's content must stay under that (images are linked by URL, so this is rarely an issue).

## Layout
- `src/app/` — pages (`/` document list, `/d/[id]` editor) and REST route handlers in `src/app/api/docs/**`
- `src/components/` — editor page, toolbar, menu bar, dropdowns
- `src/lib/` — Mongo connection (cached for serverless), model, TipTap extensions & shortcuts

## Data model
`Doc { title, tabs: [{ _id, title, content (HTML) }], createdAt, updatedAt }`

## Shortcuts
Press **Ctrl+/** in the editor for the full list (B/I/U, Ctrl+Alt+1–6 headings, Ctrl+Shift+7/8/9 lists, Ctrl+Shift+L/E/R/J align, Ctrl+K link, Ctrl+\ clear formatting, Ctrl+S save…).
