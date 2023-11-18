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

{#if bShowReadyScreen}
<section class="hero is-primary is-fullheight">
    <div class="hero-body">
        <div class="container has-text-centered">
            <h1 class="title is-size-1">Time to take a shot!</h1>
            <p class="subtitle is-size-4">You have been given a multiplier but in return you have to take a shot</p>
            <button
                class="button is-success is-size-5"
                on:click={toggleReady}
                class:ready={bIsReady}
            >
                {bIsReady ? "You're Ready!" : "Press me once you have taken your shot"}
            </button>
        </div>
    </div>
</section>
{:else}
<section class="hero is-primary is-fullheight">
    <div class="hero-body">
        <div class="container has-text-centered">
            <h1 class="title is-size-1">Waiting on other players</h1>
            <p class="subtitle is-size-4">Someone is currently taking a shot. Once they're finished we will resume!</p>
        </div>
    </div>
</section>
{/if}