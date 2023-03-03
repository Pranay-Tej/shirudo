<script lang="ts">
	import { navigating } from '$app/stores';
</script>

{#if $navigating}
	<p>...</p>
{/if}
<slot />
