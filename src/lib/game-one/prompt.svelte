<script lang="ts">
    import Pole from "./pole.svelte";
    import Submitted from "./submitted.svelte";

    export let receivedData: any;
    export let socket: WebSocket;

    let ShowPole = false;

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);
        ShowPole = true;
    };

    let promptOneFragmentOne: string;
    let promptOneFragmentTwo: string;
    let promptTwoFragmentOne: string;
    let promptTwoFragmentTwo: string;

    let promptOneFragmentOnePlayerId: string;
    let promptOneFragmentTwoPlayerId: string;
    let promptTwoFragmentOnePlayerId: string;
    let promptTwoFragmentTwoPlayerId: string;

    let clientId: string;

    // Create variables to store user input for prompts
    let userInputPromptOne: string = "";
    let userInputPromptTwo: string = "";
    let showPromptTwo: boolean = false;
    let allPromptsSubmitted: boolean = false;

    promptOneFragmentOne = receivedData.promptOneFragmentOne;
    promptOneFragmentOnePlayerId = receivedData.promptOneFragmentOnePlayerId;
    promptOneFragmentTwo = receivedData.promptOneFragmentTwo;
    promptOneFragmentTwoPlayerId = receivedData.promptOneFragmentTwoPlayerId;

    promptTwoFragmentOne = receivedData.promptTwoFragmentOne;
    promptTwoFragmentOnePlayerId = receivedData.promptTwoFragmentOnePlayerId;
    promptTwoFragmentTwo = receivedData.promptTwoFragmentTwo;
    promptTwoFragmentTwoPlayerId = receivedData.promptTwoFragmentTwoPlayerId;

    clientId = receivedData.clientId;

    function submitPromptOne() {
        showPromptTwo = true;

        const message = {
            promptOneFragmentOne: promptOneFragmentOne,
            promptOneFragmentTwo: promptOneFragmentTwo,
            userInputPromptOne: userInputPromptOne,
        };
        socket.send(JSON.stringify(message));
    }

    function submitPromptTwo() {
        allPromptsSubmitted = true;

        const message = {
            promptTwoFragmentOne: promptTwoFragmentOne,
            promptTwoFragmentTwo: promptTwoFragmentTwo,
            userInputPromptTwo: userInputPromptTwo,
        };
        socket.send(JSON.stringify(message));
    }
</script>

{#if ShowPole}
    <Pole {receivedData} {socket} />
{:else if allPromptsSubmitted}
    <Submitted />
{:else}
    <div class="container">
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="box">
                    {#if !showPromptTwo}
                        <h1 class="title is-4">{promptOneFragmentOne}</h1>
                        <div class="field">
                            {#if clientId == promptOneFragmentOnePlayerId}
                                <div class="control">
                                    <input
                                        class="input"
                                        type="text"
                                        placeholder="Enter something"
                                        bind:value={userInputPromptOne}
                                    />
                                    <button
                                        class="button"
                                        on:click={submitPromptOne}
                                        >Submit</button
                                    >
                                </div>
                            {:else}
                                <div class="other-player">Other Player</div>
                            {/if}
                        </div>
                        <h1 class="title is-4">{promptOneFragmentTwo}</h1>
                        <div class="field">
                            {#if clientId == promptOneFragmentTwoPlayerId}
                                <div class="control">
                                    <input
                                        class="input"
                                        type="text"
                                        placeholder="Enter something"
                                        bind:value={userInputPromptOne}
                                    />
                                    <button
                                        class="button"
                                        on:click={submitPromptOne}
                                        >Submit</button
                                    >
                                </div>
                            {:else}
                                <div class="other-player">Other Player</div>
                            {/if}
                        </div>
                    {:else}
                        <!-- Show the second prompt and its input fields -->
                        <h1 class="title is-4">{promptTwoFragmentOne}</h1>
                        <div class="field">
                            {#if clientId == promptTwoFragmentOnePlayerId}
                                <div class="control">
                                    <input
                                        class="input"
                                        type="text"
                                        placeholder="Enter something"
                                        bind:value={userInputPromptTwo}
                                    />
                                </div>
                            {:else}
                                <div class="other-player">Other Player</div>
                            {/if}
                        </div>
                        <h1 class="title is-4">{promptTwoFragmentTwo}</h1>
                        <div class="field">
                            {#if clientId == promptTwoFragmentTwoPlayerId}
                                <div class="control">
                                    <input
                                        class="input"
                                        type="text"
                                        placeholder="Enter something"
                                        bind:value={userInputPromptTwo}
                                    />
                                    <button
                                        class="button"
                                        on:click={submitPromptTwo}
                                        >Submit</button
                                    >
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

<style>
    /* Add your CSS styles here if needed */
    .container {
        margin-top: 20px;
    }

    .box {
        padding: 20px;
    }

    .field {
        margin-bottom: 20px;
    }

    .input {
        width: 100%;
    }

    .button {
        margin-top: 10px;
    }

    .other-player {
        color: #999;
    }
</style>
