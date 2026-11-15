# personal-site

My portfolio site, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Editing content

- `src/content/site.ts` — name, tagline, about section, contact links
- `src/content/projects.ts` — project cards and write-ups; a project with `sections` gets its own page at `/projects/<slug>`, and `draft: true` shows a "coming soon" card
- `public/projects/<slug>/` — figures and audio for each project
- `public/resume.pdf` — resume (then set `links.resume` in `site.ts`)

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build` checks the production build.

## Deployment

Deployed on Vercel from the `main` branch; every push redeploys.
