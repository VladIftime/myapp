<script>
	export let icon = 'default';
	export let url = 'foo';
	export let title = 'some cool title';
</script>

<a href={url} class=" w-full max-w-80 text-center flex button-shiny chrome">
	<span class="shine" />
	<img
		src={`/${icon}.png`}
		alt={icon}
		width="32"
		height="32"
		class="w-8 inline-block"
		loading="lazy" />
	<span class="inline-block text-center text-xl">{title}</span>
</a>
