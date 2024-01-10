<script lang="ts">
	import { page } from '$app/stores';
	import UserLink from '$lib/components/UserLink.svelte';
	import UploadPhoto from '$lib/components/UploadPhoto.svelte';
	import { db, userData, user, auth } from '$lib/firebase';
	import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
	import { writable } from 'svelte/store';
	import SortableList from '$lib/components/SortableList.svelte';
	import { redirect } from '@sveltejs/kit';
	import { signOut } from 'firebase/auth';
	const icons = ['Twitter', 'YouTube', 'Instagram', 'LinkedIn', 'GitHub', 'Custom'];
	import { goto } from '$app/navigation';
	const formDefaults = {
		icon: 'custom',
		title: '',
		url: 'https://'
	};

	// This is a store that will hold the form data
	const formData = writable(formDefaults);

	let showForm = false;

	$: urlIsValid = $formData.url.match(/^(ftp|http|https):\/\/[^ "]+$/);
	$: titleIsValid = $formData.title.length < 20 && $formData.title.length > 0;
	$: formIsValid = urlIsValid && titleIsValid;

	async function addLink(e: SubmitEvent) {
		const userRef = doc(db, 'users', $user!.uid);

		await updateDoc(userRef, {
			links: arrayUnion({
				...$formData,
				id: Date.now().toString()
			})
		});

		formData.set({
			icon: '',
			title: '',
			url: ''
		});

		showForm = false;
	}

	async function deleteLink(item: any) {
		const userRef = doc(db, 'users', $user!.uid);
		await updateDoc(userRef, {
			links: arrayRemove(item)
		});
	}

	function cancelLink() {
		formData.set(formDefaults);
		showForm = false;
	}

	function sortList(e: CustomEvent) {
		const newList = e.detail;
		const userRef = doc(db, 'users', $user!.uid);
		setDoc(userRef, { links: newList }, { merge: true });
	}

	async function signOutSSR() {
		const res = await fetch('/api/signin', { method: 'DELETE' });
		await signOut(auth);
		// send the user to the login page
		goto('/login');
	}
</script>

<div class="navbar transparent">
	<div class="flex-1">
		<a href="/{$userData?.username}" class="button-shiny purple-pink-two text-l flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-6 w-6 mr-2 inline-block"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				></path>
			</svg>
			Back to Profile
		</a>
	</div>
	<div class="flex-none">
		<button class="button-shiny red" on:click={signOutSSR}>Sign out</button>
	</div>
</div>
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
<main class="max-w-xl mx-auto relative z-10">
	{#if $userData?.username == $page.params.username}
		<h1 class="text-4xl text-primary font-bold my-5 text-center">
			@{$userData.username}
		</h1>

		<UploadPhoto />

		<p class="text-xl text-primary my-8 text-center">{$userData.bio ?? 'no bio yet...'}</p>
		<div class="flex justify-center">
			<a href="/{$userData.username}/bio" class="button-shiny my-4"> Edit Bio </a>
		</div>
		<div class="flex justify-center">
			<SortableList list={$userData?.links} on:sort={sortList} let:item let:index>
				<div class="group relative">
					<UserLink {...item} />
					<button
						on:click={() => deleteLink(item)}
						class="btn btn-xs btn-error invisible group-hover:visible transition-all absolute -right-6 bottom-10"
						>Delete</button
					>
				</div>
			</SortableList>
		</div>

		{#if showForm}
			<form on:submit|preventDefault={addLink} class="bg-base-200 p-6 w-full mx-auto rounded-xl">
				<select name="icon" class="select select-sm" bind:value={$formData.icon}>
					{#each icons as icon}
						<option value={icon.toLowerCase()}>{icon}</option>
					{/each}
				</select>
				<input
					name="title"
					type="text"
					placeholder="Title"
					class="input input-sm"
					bind:value={$formData.title}
				/>
				<input
					name="url"
					type="text"
					placeholder="URL"
					class="input input-sm"
					bind:value={$formData.url}
				/>
				<div class="my-4">
					{#if !titleIsValid}
						<p class="text-error text-xs">Must have valid title</p>
					{/if}
					{#if !urlIsValid}
						<p class="text-error text-xs">Must have a valid URL</p>
					{/if}
					{#if formIsValid}
						<p class="text-success text-xs">Looks good!</p>
					{/if}
				</div>

				<button disabled={!formIsValid} type="submit" class="btn btn-success block">Add Link</button
				>

				<button type="button" class="btn btn-xs my-4" on:click={cancelLink}>Cancel</button>
			</form>
		{:else}
			<div class="flex justify-center">
				<button on:click={() => (showForm = true)} class="button-shiny my-4">
					<span class="shine"></span>
					Add a Link
				</button>
			</div>
		{/if}
	{/if}
</main>
