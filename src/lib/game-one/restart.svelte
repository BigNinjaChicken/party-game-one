<script lang="ts">
    import { onMount } from "svelte";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    stage = 1;
</script>
