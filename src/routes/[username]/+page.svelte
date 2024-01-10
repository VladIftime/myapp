<script lang="ts">
	import UserLink from '$lib/components/UserLink.svelte';
	import type { PageData } from './$types';
	import { auth, user, userData } from '$lib/firebase';
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import { signOut } from 'firebase/auth';
	export let data: PageData;

	async function signOutSSR() {
		const res = await fetch('/api/signin', { method: 'DELETE' });
		await signOut(auth);
	}
</script>

<svelte:head>
	<title>@{data.username} Links</title>
	<meta name="description" content={data.bio} />
</svelte:head>
<div id="lamp" class="absolute inset-0 z-0">
	<div id="glass">
		<div class="bubble-2"></div>
		<div class="bubble-2"></div>
		<div class="bubble-2"></div>
		<div class="bubble-2"></div>
		<div class="bubble-2"></div>
		<div class="bubble-2"></div>
	</div>
</div>
<!-- Have a dedicated button in the top right corner that is visible only if the userid matches the user of the page. This should lead to the /[username]/edit route -->
<AuthCheck>
	{#if data.username === $userData?.username}
		<a
			href="{data.username}/edit"
			class="button-shiny purple-pink-two relative top-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:absolute sm:top-5 sm:right-0 sm:m-4 sm:py-0"
			>Edit Profile</a
		>
	{/if}
</AuthCheck>

<main class="max-w-xl mx-auto relative z-10">
	<h1 class="text-5xl text-primary font-bold m-3 text-center">
		@{data?.username}
	</h1>
	<img src={data.photoURL ?? '/user.png'} alt="photoURL" width="256" class="mx-auto" />

	<p class="text-2xl text-primary my-8 text-center">{data?.bio ?? 'no bio yet...'}</p>
	<ul class="list-none p-0 flex flex-col items-center">
		{#each data.links as item}
			<UserLink {...item}></UserLink>
		{/each}
	</ul>
</main>
