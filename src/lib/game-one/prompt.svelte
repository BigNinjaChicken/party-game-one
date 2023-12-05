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

    let promptOneFragmentOne: string;
    let promptOneFragmentTwo: string;
    let promptTwoFragmentOne: string;
    let promptTwoFragmentTwo: string;

    let promptOneFragmentOnePlayerId: string;
    let promptOneFragmentTwoPlayerId: string;
    let promptTwoFragmentOnePlayerId: string;
    let promptTwoFragmentTwoPlayerId: string;

    let partner: string = 'hidden partner';
    let playerName: string;

    let bAllSubmitted = false;

    let timeLeft: number = 60; // You can set the initial time left value in seconds
    let totalTime: number = 60; // Total time duration in seconds

    let bOverride : boolean = true;

    function updateTimeLeft() {
        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateTimeLeft, 1000); // Update every 1 second
        } else {
            bOverride = true;
            if (!bAllSubmitted) {
                if (showPromptTwo) {
                    submitPromptTwo();
                } else {
                    submitPromptOne();
                }
            }
        }
    }

    try {
        socket.onmessage = async (event: any) => {
            console.log("WebSocket message received", event);
            receivedData = JSON.parse(event.data);

            if (receivedData.Timer) {
                totalTime = Number(receivedData.Timer) - 1;
                timeLeft = totalTime;

                updateTimeLeft();
                return;
            }

            if (receivedData.Stage) {
                bAllSubmitted = true;

                submitPromptTwo();
                submitPromptOne();

                stage = receivedData.Stage;
                return;
            }

            promptOneFragmentOne = receivedData.promptOneFragmentOne;
            promptOneFragmentOnePlayerId =
                receivedData.promptOneFragmentOnePlayerId;
            promptOneFragmentTwo = receivedData.promptOneFragmentTwo;
            promptOneFragmentTwoPlayerId =
                receivedData.promptOneFragmentTwoPlayerId;

            promptTwoFragmentOne = receivedData.promptTwoFragmentOne;
            promptTwoFragmentOnePlayerId =
                receivedData.promptTwoFragmentOnePlayerId;
            promptTwoFragmentTwo = receivedData.promptTwoFragmentTwo;
            promptTwoFragmentTwoPlayerId =
                receivedData.promptTwoFragmentTwoPlayerId;

            if (receivedData.partner) partner = receivedData.partner;
            playerName = receivedData.playerName;
        };
    } catch {}

    function submitPromptOne() {
        if (!bOverride)
            if (userInputPromptOne.length === 0 && !bAllSubmitted) return;

        bAllSubmitted = true;

        const message = {
            promptTwoFragmentOne: promptTwoFragmentOne,
            promptTwoFragmentTwo: promptTwoFragmentTwo,
            userInputPromptOne: userInputPromptOne.toUpperCase(),
        };
        socket.send(JSON.stringify(message));
    }

    function submitPromptTwo() {
        if (!bOverride)
            if (userInputPromptTwo.length === 0 && !bAllSubmitted) return;

        const message = {
            promptOneFragmentOne: promptOneFragmentOne,
            promptOneFragmentTwo: promptOneFragmentTwo,
            userInputPromptTwo: userInputPromptTwo.toUpperCase(),
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
            <span class="gradient-heading text-center">Selected - Waiting On Others</span>
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
                                {promptOneFragmentOne}
                            </h1>
                            <div class="mt-4">
                                {#if playerName == promptOneFragmentOnePlayerId}
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
                                    <div class="text-red-400 text-3xl">{partner} is writing here...</div>
                                {/if}
                            </div>
                            <h1 class="my-3 text-lg font-bold text-black">
                                {promptOneFragmentTwo}
                            </h1>
                            <div class="mt-4">
                                {#if playerName == promptOneFragmentTwoPlayerId}
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
                                    <div class="text-red-400 text-3xl">{partner} is writing here...</div>
                                {/if}
                            </div>
                        {:else}
                            <!-- Show the second prompt and its input fields -->
                            <h1 class="my-3 text-lg font-bold text-black">
                                {promptTwoFragmentOne}
                            </h1>
                            <div class="mt-4">
                                {#if playerName == promptTwoFragmentOnePlayerId}
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
                                    <div class="text-red-400 text-3xl">{partner} is writing here...</div>
                                {/if}
                            </div>
                            <h1 class="my-3 text-lg font-bold text-black">
                                {promptTwoFragmentTwo}
                            </h1>
                            <div class="mt-4">
                                {#if playerName == promptTwoFragmentTwoPlayerId}
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
                                    <div class="text-red-400 text-3xl">{partner} is writing here...</div>
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
