<script lang="ts">
    import { ProgressBar } from "@skeletonlabs/skeleton";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let userInputPromptOne: string = "";
    let userInputPromptTwo: string = "";
    let showPromptTwo: boolean = false;

    let promptOneFragmentOne1: string;
    let promptOneFragmentOne2: string;
    let promptOneFragmentOnePlayerId: string;
    let promptOneFragmentTwo1: string;
    let promptOneFragmentTwo2: string;
    let promptOneFragmentTwoPlayerId: string;

    let promptTwoFragmentOne1: string;
    let promptTwoFragmentOne2: string;
    let promptTwoFragmentOnePlayerId: string;
    let promptTwoFragmentTwo1: string;
    let promptTwoFragmentTwo2: string;
    let promptTwoFragmentTwoPlayerId: string;

    let clientId: string;

    let bAllSubmitted = false;

    let timeLeft: number = 60; // You can set the initial time left value in seconds
    let totalTime: number = 60; // Total time duration in seconds

    function updateTimeLeft() {
        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateTimeLeft, 1000); // Update every 1 second
        }
    }

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);

        if (receivedData.Timer) {
            totalTime = Number(receivedData.Timer) - 1;
            timeLeft = totalTime;

            updateTimeLeft();
            return;
        }

        if (receivedData.Stage == "Pole") {
            bAllSubmitted = true;

            submitPromptTwo();
            submitPromptOne();

            stage++;
            return;
        }

        promptOneFragmentOne1 = receivedData.promptOneFragmentOne1;
        promptOneFragmentOne2 = receivedData.promptOneFragmentOne2;
        promptOneFragmentOnePlayerId =
            receivedData.promptOneFragmentOnePlayerId;
        promptOneFragmentTwo1 = receivedData.promptOneFragmentTwo1;
        promptOneFragmentTwo2 = receivedData.promptOneFragmentTwo2;
        promptOneFragmentTwoPlayerId =
            receivedData.promptOneFragmentTwoPlayerId;

        promptTwoFragmentOne1 = receivedData.promptTwoFragmentOne1;
        promptTwoFragmentOne2 = receivedData.promptTwoFragmentOne2;
        promptTwoFragmentOnePlayerId =
            receivedData.promptTwoFragmentOnePlayerId;
        promptTwoFragmentTwo1 = receivedData.promptTwoFragmentTwo1;
        promptTwoFragmentTwo2 = receivedData.promptTwoFragmentTwo2;
        promptTwoFragmentTwoPlayerId =
            receivedData.promptTwoFragmentTwoPlayerId;

        clientId = receivedData.clientId;
    };

    function submitPromptOne() {
        if (userInputPromptOne.length === 0 && !bAllSubmitted) return;

        bAllSubmitted = true;

        const message = {
            promptTwoFragmentOne: promptTwoFragmentOne1,
            promptTwoFragmentTwo: promptTwoFragmentTwo1,
            userInputPromptOne: userInputPromptOne,
        };
        socket.send(JSON.stringify(message));
    }

    function submitPromptTwo() {
        if (userInputPromptTwo.length === 0 && !bAllSubmitted) return;

        const message = {
            promptOneFragmentOne: promptOneFragmentOne1,
            promptOneFragmentTwo: promptOneFragmentTwo1,
            userInputPromptTwo: userInputPromptTwo,
        };
        socket.send(JSON.stringify(message));

        showPromptTwo = true;
    }
</script>

<body
    data-theme="crimson"
    transition:slide={{
        delay: 250,
        duration: 300,
        easing: quintOut,
        axis: "x",
    }}
>
    {#if bAllSubmitted || timeLeft <= 0}
        <h1 class="h1 text-center">
            <span class="gradient-heading text-center"
                >Selected - Waiting On Other Players</span
            >
        </h1>
    {:else}
        <div class="container mx-auto">
            <div class="flex justify-center">
                <div class="w-1/1">
                    <ProgressBar
                        label="Progress Bar"
                        value={100 * (timeLeft / totalTime)}
                        max={100}
                    />
                    {#if !showPromptTwo}
                        <div class="text-center p-3">0/2 Prompts Answered</div>
                    {:else}
                        <div class="text-center p-3">1/2 Prompts Answered</div>
                    {/if}
                    <div class="bg-white p-4 rounded-lg shadow-md">
                        {#if !showPromptTwo}
                            <h1 class="my-3 text-lg font-bold text-black">
                                {promptOneFragmentOne1}
                                {promptOneFragmentOne2}
                            </h1>
                            <div class="mt-4">
                                {#if clientId == promptOneFragmentOnePlayerId}
                                    <div class="flex">
                                        <input
                                            class="w-full px-3 py-2 border rounded text-black"
                                            type="text"
                                            placeholder="Enter something"
                                            bind:value={userInputPromptOne}
                                        />
                                        <button
                                            class="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                                            on:click={submitPromptOne}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                {:else}
                                    <div class="other-player">Other Player</div>
                                {/if}
                            </div>
                            <h1 class="my-3 text-lg font-bold text-black">
                                {promptOneFragmentTwo1}
                                {promptOneFragmentTwo2}
                            </h1>
                            <div class="mt-4">
                                {#if clientId == promptOneFragmentTwoPlayerId}
                                    <div class="flex">
                                        <input
                                            class="w-full px-3 py-2 border rounded text-black"
                                            type="text"
                                            placeholder="Enter something"
                                            bind:value={userInputPromptTwo}
                                        />
                                        <button
                                            class="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                                            on:click={submitPromptTwo}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                {:else}
                                    <div class="other-player">Other Player</div>
                                {/if}
                            </div>
                        {:else}
                            <!-- Show the second prompt and its input fields -->
                            <h1 class="my-3 text-lg font-bold text-black">
                                {promptTwoFragmentOne1}
                                {promptTwoFragmentOne2}
                            </h1>
                            <div class="mt-4">
                                {#if clientId == promptTwoFragmentOnePlayerId}
                                    <div class="flex">
                                        <input
                                            class="w-full px-3 py-2 border rounded text-black"
                                            type="text"
                                            placeholder="Enter something"
                                            bind:value={userInputPromptOne}
                                        />
                                        <button
                                            class="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                                            on:click={submitPromptOne}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                {:else}
                                    <div class="other-player">Other Player</div>
                                {/if}
                            </div>
                            <h1 class="my-3 text-lg font-bold text-black">
                                {promptTwoFragmentTwo1}
                                {promptTwoFragmentTwo2}
                            </h1>
                            <div class="mt-4">
                                {#if clientId == promptTwoFragmentTwoPlayerId}
                                    <div class="flex">
                                        <input
                                            class="w-full px-3 py-2 border rounded text-black"
                                            type="text"
                                            placeholder="Enter something"
                                            bind:value={userInputPromptTwo}
                                        />
                                        <button
                                            class="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                                            on:click={submitPromptTwo}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                {:else}
                                    <div class="other-player">Other Player</div>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
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
