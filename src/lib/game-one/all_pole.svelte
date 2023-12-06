<script lang="ts">
    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let selectedOption: string = "";
    let bUpdate = false;
    let bAllSubmitted = false;

    // Create a function to select an option
    function selectOption(option: number) {
        selectedOption = option.toString();
        let jsonMessage = {
            option: option,
        };
        socket.send(JSON.stringify(jsonMessage));
        bAllSubmitted = true;
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

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);

        if (receivedData.Stage) {
            stage = receivedData.Stage;
            return;
        }

        if (receivedData.Score) return;

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
                promptOneResponse:
                    receivedData[`promptFragmentOneResponce${i}`],
                promptOnePlayerId:
                    receivedData[`promptFragmentOnePlayerId${i}`],
                promptTwo: receivedData[promptTwoKey],
                promptTwoResponse:
                    receivedData[`promptFragmentTwoResponce${i}`],
                promptTwoPlayerId:
                    receivedData[`promptFragmentTwoPlayerId${i}`],
            });

            i++;
        }
        bUpdate = true;
    };
</script>

<body data-theme="crimson">
    {#if !bAllSubmitted}
        <main class="section">
            <div class="container">
                <h1 class="title">Select the best team story:</h1>
                {#if bUpdate}
                    {#each prompts as prompt, i}
                        <button
                            class="btn variant-filled"
                            class:selected={selectedOption === `Option${i + 1}`}
                            on:click={() => selectOption(i)}
                        >
                            <p class="whitespace-normal">
                                {prompt.promptOne}
                                {prompt.promptOneResponse}
                                {prompt.promptTwo}
                                {prompt.promptTwoResponse}
                            </p>
                        </button>
                    {/each}
                {/if}
            </div>
        </main>
    {/if}
</body>

<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
</style>
