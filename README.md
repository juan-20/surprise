# pioneer

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines SvelteKit, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **SvelteKit** - Web framework for building Svelte apps
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```


Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the web application.







## Project Structure

```
pioneer/
├── apps/
│   ├── web/         # Frontend application (SvelteKit)
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps

## SEO & Favicon (local changes)

 - Default language is now set to `pt-BR` in `apps/web/src/app.html`.
 - Default site title and meta description are provided in `app.html` and the home page (`apps/web/src/routes/+page.svelte`).
 - SVG favicon added at `apps/web/static/favicon.svg` and a social preview image at `apps/web/static/og-image.svg`.
 - Accessibility: a "Pular para o conteúdo" skip-link was added in `apps/web/src/routes/+layout.svelte` and helper styles are in `apps/web/src/app.css`.

How to test:

1. Run the dev server: 

```powershell
bun run dev:web
```

2. Open the site and verify:
 - Title shows `Pioneer — Recarregue seu serviço`.
 - The favicon (SVG) appears in the browser tab.
 - Social preview uses `og-image.svg` (social preview tools may take a while to refresh).

To change title/description for a specific page, edit the `<svelte:head>` block in that page's `.svelte` file.
