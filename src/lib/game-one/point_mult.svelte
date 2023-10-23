<script lang="ts">
    import { onMount } from "svelte";
	import { fade, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let valueSingle: string = "books";

    onMount(async () => {
        if (!socket) {
            console.log("Invalid Socket");
            return;
        }

        socket.onmessage = async (event) => {
            console.log("WebSocket message received", event);
            receivedData = JSON.parse(event.data);
            if (receivedData.Stage) stage++;
        };
    });
</script>

<body data-theme="crimson" transition:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'x' }}>
    <div class="grid grid-cols-1 gap-4">
        <h1 class="h1">
            <span class="gradient-heading">Multiplier Round</span>
        </h1>
        <p class="text-center">Select a player to give the multiplier to:</p>
        <div class="card p-4">
            <div class="list-box-container">
                <ListBox>
                    <ListBoxItem
                        class="px-5 m-3"
                        bind:group={valueSingle}
                        name="medium"
                        value="1"
                    >
                        <p class="text-base">Player 1</p>
                        <p class="text-sm text-gray-500">2x</p></ListBoxItem
                    >
                </ListBox>
            </div>
        </div>
    </div>
</body>

<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
    .list-box-container {
        text-align: center;
    }
    .gradient-heading {
        @apply bg-clip-text text-transparent box-decoration-clone;
        /* Direction */
        @apply bg-gradient-to-br;
        /* Color Stops */
        @apply from-indigo-500 via-purple-500 to-pink-500;
    }
</style>
