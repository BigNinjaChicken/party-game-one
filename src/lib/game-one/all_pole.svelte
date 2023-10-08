<script lang="ts">
    import Submitted from "./submitted.svelte";

    export let receivedData: any;
    export let socket: WebSocket;

    let selectedOption: string = "";
    let bHasSubmitted = false;

    // Create a function to select an option
    function selectOption(option: number) {
        selectedOption = option.toString();
        let jsonMessage = {
            option: option,
        };
        socket.send(JSON.stringify(jsonMessage));
        bHasSubmitted = true;
    }

    $: prompts = receivedData ? Object.keys(receivedData)
        .filter(key => key.startsWith('promptFragmentOne'))
        .map(key => {
            const index = key.slice(-1);
            return {
                promptOne: receivedData[`promptFragmentOne${index}`],
                promptOneResponse: receivedData[`PromptFragmentOneResponce${index}`],
                promptTwo: receivedData[`promptFragmentTwo${index}`],
                promptTwoResponse: receivedData[`PromptFragmentTwoResponceKey${index}`],
            };
        })
        .filter((prompt, index, self) => {
            // Filter out duplicates based on promptOne and promptTwo
            const firstOccurrence = self.findIndex(p => p.promptOne === prompt.promptOne && p.promptTwo === prompt.promptTwo);
            return index === firstOccurrence;
        }) : [];

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);
    };
</script>

{#if bHasSubmitted}
    <Submitted />
{:else}
    <main class="section">
        <div class="container">
            <h1 class="title">Poll Screen</h1>
            <div class="buttons">
                {#each prompts as prompt, i}
                    <button
                        class="button"
                        class:selected={selectedOption === `Option${i + 1}`}
                        on:click={() => selectOption(i)}
                    >
                        <p>{prompt.promptOne} {prompt.promptOneResponse} {prompt.promptTwo} {prompt.promptTwoResponse}</p>
                    </button>
                {/each}
            </div>
        </div>
    </main>
{/if}
