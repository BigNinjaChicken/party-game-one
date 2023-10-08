<script lang="ts">
    import Prompt from "./prompt.svelte";

    export let socket: WebSocket;
    let ShowPromptScreen = false;
    let receivedData: any;

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);
        ShowPromptScreen = true;
    };

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

{#if ShowPromptScreen}
	<Prompt {receivedData} {socket}/>
{:else}
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
{/if}

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
