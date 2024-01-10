<script lang="ts">
	import { auth, user, userData } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		const credential = await signInWithPopup(auth, provider);

		const idToken = await credential.user.getIdToken();

		const res = await fetch('/api/signin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
				// 'CSRF-Token': csrfToken  // HANDLED by sveltekit automatically
			},
			body: JSON.stringify({ idToken })
		});
		await res.json();
		if ($userData?.username && !$userData?.firstTime) {
			goto(`/${$userData.username}/edit`);
		}
	}

	async function signOutSSR() {
		const res = await fetch('/api/signin', { method: 'DELETE' });
		await signOut(auth);
	}
</script>

{#if $user}
	<h2 class="card-title">Welcome, {$user.displayName}</h2>
	<p class="text-center text-success">You are logged in</p>
	<button class="btn btn-warning" on:click={signOutSSR}>Sign out</button>
{:else}
	<button class="btn btn-primary" on:click={signInWithGoogle}>Sign in with Google</button>
{/if}
