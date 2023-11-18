<script lang="ts">
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let standing: number = 0;

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);

        if (receivedData.Stage) {
            stage = receivedData.Stage;
            return;
        }

        if (receivedData.Standing) standing = receivedData.Standing;
    };
</script>

<body
    data-theme="crimson"
    transition:slide={{
        delay: 250,
        duration: 300,
        easing: quintOut,
        axis: "x",
    }}
    class="flex justify-center items-center h-screen m-0"
>
    {#if standing != 0}
        <div class="text-center">
            <div class="text-9xl font-bold">{standing}</div>
            <div class="text-2xl">Your current standing</div>
        </div>
    {/if}
</body>

<style>
    /* Additional styles if needed */
</style>
