# Space Story Reader (blog_story_personal)

**Space Story Reader** is a TypeScript-based web app that delivers an interactive storytelling experience (likely space-themed, as suggested by the title). It is built as a single-page application (SPA) using Vite, styled with Tailwind CSS, and deployed on Vercel. The frontend code is almost entirely TypeScript (86.5%) with some JavaScript, and it connects to a Supabase backend (PostgreSQL) for data/storage. In short, this project is a Vite-powered, Tailwind-styled frontend that uses Supabase for its data, all hosted on Vercel.

## Features

- **Interactive Story UI:** Presents narrative content in an interactive, step-by-step format. Users can read through personal/space-themed stories in the browser. (All frontend logic runs client-side in the `src/` code.)
- **Supabase Backend:** Uses Supabase (PostgreSQL) for storing story data or user info. The presence of a `supabase/migrations` folder and PL/pgSQL code (9.8% of the repo) suggests that story content and related data are managed in a Postgres database.
- **TypeScript Codebase:** Written mainly in TypeScript, providing type safety and modern JavaScript features. Code quality is enforced with ESLint (`eslint.config.js`), and the build/dev pipeline is configured in `vite.config.ts`.
- **Styling with Tailwind:** Uses Tailwind CSS (configured via `tailwind.config.js` and `postcss.config.js`) for responsive, utility-first styling. This ensures a clean, consistent design without writing custom CSS.
- **Environment Configuration:** An `.env.example` file is included, indicating required environment variables (e.g. Supabase URL and keys). You should copy this to your own `.env` file and fill in credentials for local development.
- **Deployment on Vercel:** The app is configured for deployment on Vercel (`vercel.json` present). A live demo is available at [https://blog-story-personal.vercel.app](https://blog-story-personal.vercel.app). This means the app can be previewed by deploying to Vercel or running the Vercel CLI locally.

## Tech Stack

- **TypeScript (86.5%) & JavaScript (2.9%)** – Main frontend languages. The codebase is heavily TypeScript-based for reliability.
- **PL/pgSQL (9.8%)** – SQL dialect used in the Supabase `migrations/` folder, indicating database schema/migration scripts.
- **Vite** – Build tool and dev server (`vite.config.ts`). Enables fast hot-reloading and bundling of the app.
- **Tailwind CSS** – Utility-first CSS framework (`tailwind.config.js`, `postcss.config.js`) for styling and responsive design.
- **ESLint** – Linting and formatting (`eslint.config.js`) for code quality and consistency.
- **Supabase (PostgreSQL)** – Backend-as-a-service for database and authentication. Story data is likely stored here.
- **Node.js / npm** – For dependency management (`package.json`, `package-lock.json`).
- **Vercel** – Hosting platform (`vercel.json`) that serves the production build. The `vercel.app` link confirms live deployment.
