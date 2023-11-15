<script lang="ts">
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
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
{:else if optionData}
    <body
        data-theme="crimson"
        transition:slide={{
            delay: 250,
            duration: 300,
            easing: quintOut,
            axis: "x",
        }}
    >
        <main class="section bg-gray-900 text-white">
            <div class="container mx-auto p-4">
                <h1 class="text-2xl mb-4 text-white">Poll Screen</h1>
                <button
                    class="btn bg-blue-500 text-white py-2 px-4 rounded-full mb-2"
                    class:selected={selectedOption === "Option1"}
                    on:click={() => selectOption("Option1")}
                >
                    <p class="whitespace-normal">{optionData.Option1}</p>
                </button>
                <button
                    class="btn bg-blue-500 text-white py-2 px-4 rounded-full"
                    class:selected={selectedOption === "Option2"}
                    on:click={() => selectOption("Option2")}
                >
                    <p class="whitespace-normal">{optionData.Option2}</p>
                </button>
            </div>
        </main>
    </body>
{/if}

<style>
    .selected {
        background-color: #00d1b2;
        color: #fff;
    }

    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
</style>
