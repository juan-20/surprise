<script lang="ts">
	import { onMount } from 'svelte';

	// Data is provided by the server `+page.server.ts` load function so page is SSR
	export let data: { items: { title: string; url: string; image: string }[] };

	const items = data.items ?? [];
	
	// Track loaded images - stores the actual image URL for each item
	let loadedImages: Record<string, string> = {};

	const screenshot = (url: string) => `https://image.thum.io/get/${encodeURIComponent(url)}`;

	// Fetch missing image for an item
	async function fetchMissingImage(url: string, index: number) {
		// Skip if already loaded
		if (loadedImages[index]) return;
		
		try {
			const res = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
			if (res.ok) {
				const data = await res.json();
				const image = data.image ?? screenshot(url);
				loadedImages[index] = image;
				return;
			}
		} catch (err) {
			console.error(`[og] fetch error for ${url}:`, err instanceof Error ? err.message : String(err));
		}

		// Fallback to screenshot service
		loadedImages[index] = screenshot(url);
	}

	onMount(() => {
		try {
			if (typeof window === 'undefined') return;
			if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			const key = 'pioneer_first_visit_v1';
			if (!localStorage.getItem(key)) {
				runConfetti();
				localStorage.setItem(key, '1');
			}
		} catch (e) {
			console.error(e);
		}

		// Set up Intersection Observer for lazy loading images
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const index = parseInt(entry.target.getAttribute('data-index') ?? '-1');
					const link = items[index];
					
					if (index >= 0 && link && !link.image) {
						// Item needs image fetched
						fetchMissingImage(link.url, index);
					}
					
					observer.unobserve(entry.target);
				}
			});
		}, { rootMargin: '200px' }); // Start loading 200px before item enters viewport

		// Observe all item containers
		document.querySelectorAll('[data-index]').forEach((el) => {
			observer.observe(el);
		});

		return () => observer.disconnect();
	});

	function getImageUrl(item: { title: string; url: string; image: string }, index: number): string {
		// If item has predefined image, use it
		if (item.image) {
			return item.image;
		}
		// If we've loaded an image for this item, use it
		if (loadedImages[index]) {
			return loadedImages[index];
		}
		// Return empty until loaded
		return '';
	}

	function runConfetti() {
		const duration = 10000;
		const end = Date.now() + duration;
		const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

		const canvas = document.createElement('canvas');
		canvas.className = 'confetti-canvas';
		canvas.style.position = 'fixed';
		canvas.style.left = '0';
		canvas.style.top = '0';
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.pointerEvents = 'none';
		canvas.style.zIndex = '9999';
		document.body.appendChild(canvas);

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const DPR = window.devicePixelRatio || 1;
		function resize() {
			canvas.width = window.innerWidth * DPR;
			canvas.height = window.innerHeight * DPR;
			ctx?.setTransform(DPR, 0, 0, DPR, 0, 0);
		}
		resize();
		window.addEventListener('resize', resize);

		const particles: any[] = [];
		const num = 140;
		for (let i = 0; i < num; i++) {
			particles.push({
				x: Math.random() * window.innerWidth,
				y: Math.random() * -window.innerHeight * 0.2,
				vx: (Math.random() - 0.5) * 6,
				vy: Math.random() * 6 + 2,
				size: Math.random() * 8 + 4,
				rot: Math.random() * 360,
				rotSpeed: (Math.random() - 0.5) * 10,
				color: colors[(Math.random() * colors.length) | 0],
				opacity: 1
			});
		}

		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (const p of particles) {
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate((p.rot * Math.PI) / 180);
				ctx.fillStyle = p.color;
				ctx.globalAlpha = p.opacity;
				ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
				ctx.restore();
			}
		}

		function update() {
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.15; // gravity
				p.rot += p.rotSpeed;
				p.opacity -= 0.006;
			}
			for (let i = particles.length - 1; i >= 0; i--) {
				if (particles[i].opacity <= 0 || particles[i].y > window.innerHeight + 100) particles.splice(i, 1);
			}
		}

		function loop() {
			update();
			draw();
			if (Date.now() < end && particles.length > 0) {
				requestAnimationFrame(loop);
			} else {
				window.removeEventListener('resize', resize);
				if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
			}
		}

		loop();
	}
</script>

<svelte:head>
	<title>Pioneer — Recarregue seu serviço</title>
	<meta name="description" content="Recomendações selecionadas para renovar sua energia no serviço — curadoria de links úteis." />
	<meta property="og:title" content="Pioneer — Recarregue seu serviço" />
	<meta property="og:description" content="Recomendações selecionadas para renovar sua energia no serviço — curadoria de links úteis." />
	<meta property="og:image" content="%sveltekit.assets%/og-image.svg" />
	<meta property="og:locale" content="pt_BR" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main class="min-h-screen py-10 px-4 flex items-start justify-center">
	<section class="w-full max-w-4xl rounded-lg shadow-md p-6">
		<header class="mb-6 text-center">
			<h1 class="text-3xl md:text-4xl font-extrabold mb-2 leading-tight" style="color: var(--color-primary);">Precisando de uma recarga para o melhor serviço do mundo?</h1>
			<p class="text-lg md:text-xl" style="color: var(--color-secondary);">Aqui vão algumas recomendações selecionadas — abra qualquer cartão para visitar o site.</p>
		</header>

		<ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each items as link, index}
				<li data-index={index}>
					<a href={link.url} target="_blank" rel="noopener noreferrer" class="block rounded-lg overflow-hidden shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-150" style="background: var(--color-card); color: var(--color-card-foreground); border: 1px solid rgba(0,0,0,0.04);">
						<div class="w-full h-48 overflow-hidden" style="background: var(--color-muted);">
							{#if getImageUrl(link, index)}
								<img src={getImageUrl(link, index)} alt={`Preview of ${link.title}`} class="w-full h-full object-cover" />
							{:else}
								<div class="w-full h-full flex items-center justify-center">
									<div class="animate-pulse text-muted-foreground">Loading...</div>
								</div>
							{/if}
						</div>
						<div class="p-4">
							<div class="font-semibold text-lg truncate">{link.title}</div>
							<div class="text-xs text-muted-foreground truncate">{link.url}</div>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>
