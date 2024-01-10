<script lang="ts">
    import { user, userData } from '$lib/firebase';
    import { auth, storage, db } from '$lib/firebase';
    import { doc, updateDoc } from 'firebase/firestore';
    import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
    import imageCompression from 'browser-image-compression';

    let previewURL: string;
    let uploading = false;
    
    async function upload(e: any) {
        uploading = true;
        const file = e.target.files[0];
        previewURL = URL.createObjectURL(file);

        // Convert image to WebP format using browser-image-compression
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'webp',
        };
        const compressedFile = await imageCompression(file, options);

        const storageRef = ref(storage, `users/${$user!.uid}/profile.webp`);
        const result = await uploadBytes(storageRef, compressedFile);
        const url = await getDownloadURL(result.ref);

        await updateDoc(doc(db, 'users', $user!.uid), { photoURL: url });
        uploading = false;
    }
</script>

<form class="max-w-screen-md w-full items-center">
	<div class="form-control w-full max-w-xs my-10 mx-auto text-center items-center">
		<img
			src={previewURL ?? $userData?.photoURL ?? '/user.png'}
			alt="photoURL"
			width="200"
			height="200"
			class="mx-auto"
		/>
		<label for="photoURL" class="label">
			<span class="label-text">Pick a file</span>
		</label>
		<input
			on:change={upload}
			name="photoURL"
			type="file"
			class="file-input file-input-bordered w-full max-w-xs"
			accept="image/png, image/jpeg, image/gif, image/webp"
		/>
		{#if uploading}
			<p>Uploading...</p>
			<progress class="progress progress-info w-56 mt-6" />
		{/if}
	</div>
</form>
