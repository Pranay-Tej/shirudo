<script>
  import { API_ROUTES } from '$lib/constants/apiRoutes';
</script>

<svelte:head>
  <title>Dashboard &bull; Shirudo</title>
</svelte:head>

<h1>Dashboard</h1>

<a href="/apps">Apps</a>

<hr />

<form method="POST" action={API_ROUTES.logout}><button type="submit">Logout</button></form>
