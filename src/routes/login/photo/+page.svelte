<script lang="ts">
	import AuthCheck from '$lib/components/AuthCheck.svelte';
	import UploadPhoto from '$lib/components/UploadPhoto.svelte';
	import { userData } from '$lib/firebase';
	$: href = `/${$userData?.username}/edit`;
</script>

<AuthCheck>
	<h2 class="card-title">Upload a Profile Photo</h2>

	<UploadPhoto />

	<a {href} class="btn btn-primary">Finish</a>
</AuthCheck>
