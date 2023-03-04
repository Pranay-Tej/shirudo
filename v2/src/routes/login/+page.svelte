<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Login &bull; Shirudo</title>
</svelte:head>

<form method="POST">
	<label for="password">Shirudo Admin Password</label>
	<input type="password" id="password" name="password" />
	<button type="submit">Login</button>
</form>

{#if form?.credentials}
	<p>Invalid Credentials</p>
{/if}

{#if form?.serverError}
	<p>Server error</p>
{/if}
