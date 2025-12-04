<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<a class="sr-only-focusable" href="#main-content">Pular para o conteúdo</a>

<div class="grid h-svh grid-rows-[auto_1fr]">
	<main id="main-content" class="overflow-y-auto" tabindex="-1">
		{@render children()}
	</main>
	</div>
