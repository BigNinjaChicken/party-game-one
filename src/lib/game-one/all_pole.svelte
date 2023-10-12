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

    type Prompt = {
        promptOne: string;
        promptOneResponse: string;
        promptOnePlayerId: string;
        promptTwo: string;
        promptTwoResponse: string;
        promptTwoPlayerId: string;
    };

    let prompts: Prompt[] = [];

    let i = 0;
    while (true) {
        const promptOneKey = `promptFragmentOne${i}`;
        const promptTwoKey = `promptFragmentTwo${i}`;

        // Check if the promptOneKey exists in receivedData
        if (!(promptOneKey in receivedData)) {
            break; // Exit the loop if the key is invalid
        }

        // Create a new Prompt object based on the keys and values
        prompts.push({
            promptOne: receivedData[promptOneKey],
            promptOneResponse: receivedData[`promptFragmentOneResponce${i}`],
            promptOnePlayerId: receivedData[`promptFragmentOnePlayerId${i}`],
            promptTwo: receivedData[promptTwoKey],
            promptTwoResponse: receivedData[`promptFragmentTwoResponce${i}`],
            promptTwoPlayerId: receivedData[`promptFragmentTwoPlayerId${i}`],
        });

        i++;
    }

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
                        <p>
                            {prompt.promptOne}
                            {prompt.promptOneResponse}
                            {prompt.promptTwo}
                            {prompt.promptTwoResponse}
                        </p>
                    </button>
                {/each}
            </div>
        </div>
    </main>
{/if}
