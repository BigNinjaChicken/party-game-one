<script lang="ts">
    import { onMount } from "svelte";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    console.log(socket);
    console.log(receivedData)

    stage = 1;
</script>
