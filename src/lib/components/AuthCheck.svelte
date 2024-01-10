<script lang="ts">
	import { user } from '$lib/firebase';
</script>

{#if $user}
	<slot />
{:else}
	<a
		href="/login"
		class="button-shiny purple relative top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:absolute sm:top-5 sm:right-0 sm:m-4 sm:py-0"
		>Sign in</a
	>
{/if}
