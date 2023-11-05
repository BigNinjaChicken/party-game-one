<script lang="ts">
    import Submitted from "./submitted.svelte";
    import SubmittedTemplate from "./submitted_template.svelte";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let bHasSubmitted = false;

    let optionData: any;

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);

        if (receivedData.Score) return;

        if (receivedData.Stage) {
            stage++;
            return;
        }

        optionData = receivedData;  
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
    <SubmittedTemplate />
{:else if optionData && optionData.Option1 && optionData.Option2}
    <main class="section">
        <div class="container">
            <h1 class="title">Poll Screen</h1>
            <div class="buttons">
                <button
                    class="button"
                    class:selected={selectedOption === "Option1"}
                    on:click={() => selectOption("Option1")}
                >
                    {optionData.Option1}
                </button>
                <button
                    class="button"
                    class:selected={selectedOption === "Option2"}
                    on:click={() => selectOption("Option2")}
                >
                    {optionData.Option2}
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
