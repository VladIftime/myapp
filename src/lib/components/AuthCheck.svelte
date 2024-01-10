<script lang="ts">
	import { user } from '$lib/firebase';
</script>

{#if $user}
	<slot />
{:else}
	<div class="flex justify-center">
		<a href="/login" class="button-shiny purple">Sign in</a>
	</div>
{/if}
