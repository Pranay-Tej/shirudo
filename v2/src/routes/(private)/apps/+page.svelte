<script lang="ts">
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let name: string = '';
</script>

<svelte:head>
	<title>Apps &bull; Shirudo</title>
</svelte:head>

<h1>Apps</h1>

<ul>
	{#each data.apps as app (app.id)}
		<li>
			<a href={`/apps/${app.id}`}>{app.name}</a>
		</li>
	{:else}
		<p>No apps</p>
	{/each}
</ul>

<form method="POST">
	<fieldset>
		<legend>Add new app</legend>
		<label for="name">App Name</label>
		<input type="text" name="name" id="name" bind:value={name} required />
		<br />

		<label for="password">App Admin Password</label>
		<input type="text" name="password" id="password" required />
		<br />

		<button type="submit" disabled={data.apps.some((app) => app.name === name)}>Add new app</button>
	</fieldset>
</form>

{#if form?.badRequest}
	<p>Error</p>
{/if}
