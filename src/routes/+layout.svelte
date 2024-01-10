<script lang="ts">
	import '../app.css';
	import '../layout.css';
	import '../special_buttons.css';
	import { auth, user, userData } from '$lib/firebase';

	$user;
	$userData;
</script>

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<div class="relative min-h-screen flex flex-col body">
	<div class="bubble-container">
		<div class="bubble"></div>
		<div class="bubble"></div>
		<div class="bubble"></div>
		<div class="bubble"></div>
		<div class="bubble"></div>
		<div class="bubble"></div>
		<div class="bubble"></div>
		<div class="bubble"></div>
		<div class="bubble"></div>

		

		<div class="relative z-10">
			<slot />
		</div>
	</div>
</div>
