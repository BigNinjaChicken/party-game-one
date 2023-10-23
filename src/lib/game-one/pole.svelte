<script lang="ts">
    import Submitted from "./submitted.svelte";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let bHasSubmitted = false;

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);
        if (receivedData.Stage) {
            stage++;
            return;
        }
        bHasSubmitted = false;
    };

    let selectedOption: string;

    function selectOption(option: string) {
        let message = {
            poleSelection: option,
        };
        socket.send(JSON.stringify(message));
        bHasSubmitted = true;
    }
</script>

{#if bHasSubmitted}
    <div class="message">
        <div class="message-header">All Submitted.</div>
        <div class="message-body">
            <!-- Your message content here -->
        </div>
    </div>
{:else}
    <main class="section">
        <div class="container">
            <h1 class="title">Poll Screen</h1>
            <div class="buttons">
                <button
                    class="button"
                    class:selected={selectedOption === "Option1"}
                    on:click={() => selectOption("Option1")}
                >
                    {receivedData.Option1}
                </button>
                <button
                    class="button"
                    class:selected={selectedOption === "Option2"}
                    on:click={() => selectOption("Option2")}
                >
                    {receivedData.Option2}
                </button>
            </div>
        </div>
    </main>
{/if}

<style>
    .selected {
        background-color: #00d1b2;
        color: #fff;
    }
</style>
