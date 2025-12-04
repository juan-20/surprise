import type { RequestHandler } from '@sveltejs/kit';

type CacheEntry = { image: string | null; title: string | null; ts: number; status: number };

// Simple in-memory cache (module-scoped). This persists while the server process runs.
const CACHE_TTL = 1000 * 60 * 60; // 1 hour for successful lookups
const ERROR_TTL = 1000 * 60 * 5; // 5 minutes for failures / not found
const cache = new Map<string, CacheEntry>();

const jsonHeaders = (maxAgeSeconds: number) => ({
  'Content-Type': 'application/json',
  'Cache-Control': `public, max-age=${maxAgeSeconds}, s-maxage=${Math.max(60, maxAgeSeconds)}`
});

export const GET: RequestHandler = async ({ url }) => {
  const target = url.searchParams.get('url');

  if (!target) {
    return new Response(JSON.stringify({ error: 'missing url' }), {
      status: 400,
      headers: jsonHeaders(60)
    });
  }

  const now = Date.now();
  const cached = cache.get(target);
  if (cached) {
    const ttl = cached.image ? CACHE_TTL : ERROR_TTL;
    if (now - cached.ts < ttl) {
      const maxAge = Math.floor(ttl / 1000);
      return new Response(JSON.stringify({ image: cached.image, title: cached.title }), {
        status: cached.status,
        headers: jsonHeaders(maxAge)
      });
    }
  }

  try {
    const res = await fetch(target, {
      headers: { 'User-Agent': 'SvelteKit-OG-Fetcher' }
    });

    const html = await res.text();

    // Try to find og:image or twitter:image in the HTML
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    const twImageMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);

    const foundImage = ogImageMatch ? ogImageMatch[1] : twImageMatch ? twImageMatch[1] : null;

    let resolvedImage: string | null = null;
    if (foundImage) {
      try {
        resolvedImage = new URL(foundImage, target).toString();
      } catch (e) {
        resolvedImage = foundImage;
      }
    }

    // Try to find og:title, twitter:title or the <title>
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    const twTitleMatch = html.match(/<meta[^>]+name=["']twitter:title["'][^>]*content=["']([^"']+)["']/i);
    const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    const foundTitle = ogTitleMatch ? ogTitleMatch[1] : twTitleMatch ? twTitleMatch[1] : titleTagMatch ? titleTagMatch[1].trim() : null;

    // cache successful (or null) result
    cache.set(target, { image: resolvedImage, title: foundTitle, ts: Date.now(), status: 200 });

    return new Response(JSON.stringify({ image: resolvedImage, title: foundTitle }), {
      status: 200,
      headers: jsonHeaders(Math.floor(CACHE_TTL / 1000))
    });
  } catch (err) {
    // cache the error result briefly to avoid hammering troubled hosts
    cache.set(target, { image: null, title: null, ts: Date.now(), status: 500 });
    return new Response(JSON.stringify({ image: null, title: null }), {
      status: 500,
      headers: jsonHeaders(Math.floor(ERROR_TTL / 1000))
    });
  }
};
