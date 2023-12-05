<script lang="ts">
    import { onMount } from "svelte";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let bShowReadyScreen = false;

    onMount(async () => {
        socket.onmessage = async (event) => {
            console.log("WebSocket message received", event);
            receivedData = JSON.parse(event.data);
            if (receivedData.Stage) {
                stage = receivedData.Stage;
                return;
            }

            if (receivedData.ReadyScreen) {
                bShowReadyScreen = true;
                return;
            }
        };
    });

    let bIsReady = false;
    function toggleReady() {
        bIsReady = !bIsReady;
        const message = {
            bIsReady: bIsReady,
        };
        socket.send(JSON.stringify(message));
    }
</script>

<body data-theme="crimson">
    {#if bShowReadyScreen}
        <section class="flex flex-col justify-center items-center h-screen">
            <div class="max-w-md p-4 rounded shadow-md bg-surface-500 mb-4">
                <h1 class="text-3xl font-semibold mb-4 text-error-500">
                    Time to take a shot!
                </h1>
                <p class="mb-4 italic">
                    You have been given a multiplier but in return, you have to
                    take a shot.
                </p>
            </div>
            <p class="text-lg font-bold mb-0 pb-0">Press once you're ready:</p>
            <div class="text-center m-3 mt-1">
                <button
                    class="btn variant-filled px-8 py-3"
                    on:click={toggleReady}
                    class:ready={bIsReady}
                    >{bIsReady ? "Ready!" : "I've Taken My Shot"}</button
                >
            </div>
        </section>
    {:else}
        <section class="flex flex-col justify-center items-center h-screen">
            <div class="text-center">
                <h1 class="text-4xl font-bold">Waiting on other players</h1>
                <p class="mt-4 text-surface-400">
                    Someone is currently taking a shot. Once they're finished,
                    we will resume!
                </p>
            </div>
        </section>
    {/if}
</body>
