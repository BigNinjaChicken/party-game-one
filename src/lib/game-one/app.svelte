<script lang="ts">
    import { onMount } from "svelte";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    onMount(async () => {
        socket.onmessage = async (event: any) => {
            receivedData = JSON.parse(event.data);

            if (receivedData.Stage == "Tutorial") {
                console.log("WebSocket message received", event);
                stage = 3;
            }
        };
    });

    const message = {
        bJoinedGame: true,
    };
    socket.send(JSON.stringify(message));

    let bIsReady = false;

    function toggleReady() {
        bIsReady = !bIsReady;
        const message = {
            bIsReady: bIsReady,
        };
        socket.send(JSON.stringify(message));
    }
</script>

<section class="hero is-primary is-fullheight">
    <div class="hero-body">
        <div class="container has-text-centered">
            <h1 class="title is-size-1">Welcome to the Game</h1>
            <p class="subtitle is-size-4">Get ready for some fun!</p>
            <button
                class="button is-success is-size-5"
                on:click={toggleReady}
                class:ready={bIsReady}
            >
                {bIsReady ? "You're Ready!" : "Press Me To Ready Up"}
            </button>
        </div>
    </div>
</section>

<style>
    button.ready {
        animation: scaleUp 0.2s ease-in-out;
    }

    @keyframes scaleUp {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.1);
        }
    }
</style>
