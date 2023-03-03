<script lang="ts">
	import type { PageData } from './$types';
	import axios from 'axios';
	import { goto, invalidate } from '$app/navigation';
	import { ROUTES, ROUTE_DATA_KEYS } from '$lib/constants/routes';
	import { API_ROUTES } from '$lib/constants/apiRoutes';
	import { DEFAULT_ROLES } from '$lib/constants/appConstants';

	export let data: PageData;

	let name = '';

	const handleDeleteApp = async () => {
		try {
			const res = await axios.delete(API_ROUTES.appById(data.app.id));
			if (res.data?.app?.id) {
				goto(ROUTES.apps);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleAddRole = async () => {
		try {
			const res = await axios.post(API_ROUTES.roles, {
				name,
				appId: data.app.id
			});
			if (res.data.role) {
				name = '';
				invalidate(ROUTE_DATA_KEYS.appById);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handleDeleteRole = async (roleId: string) => {
		try {
			const res = await axios.delete(API_ROUTES.roleById(roleId));
			if (res.data?.role?.id) {
				invalidate(ROUTE_DATA_KEYS.appById);
			}
		} catch (err) {
			console.error(err);
		}
	};
</script>

<svelte:head>
	<title>{data.app.name} &bull; Shirudo</title>
</svelte:head>

<div>
	<h2>{data.app.name}</h2>
</div>

<button on:click={handleDeleteApp}>Delete App</button>

<h2>Roles</h2>
{#if data.app.Roles}
	<ul>
		{#each data.app.Roles as role (role.id)}
			<li>
				<span>
					{role.name}
				</span>
				<button
					on:click={() => handleDeleteRole(role.id)}
					disabled={Object.keys(DEFAULT_ROLES).includes(role.name)}
					>Delete
				</button>
			</li>
		{/each}
	</ul>
{:else}
	<p>No Roles</p>
{/if}

<h2>Create New Role</h2>
<form on:submit|preventDefault={handleAddRole}>
	<fieldset>
		<legend>Add new role</legend>

		<label for="name">Role Name</label>
		<input type="text" name="name" id="name" bind:value={name} required />

		<button type="submit" disabled={data.app.Roles.some((role) => role.name === name)}
			>Add new role</button
		>
	</fieldset>
</form>

<pre>{JSON.stringify(data.app, null, 2)}</pre>
