<script lang="ts">
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

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);

        if (receivedData.Stage == "Pole") {
            stage++;
        }

        promptOneFragmentOne1 = receivedData.promptOneFragmentOne1;
        promptOneFragmentOne2 = receivedData.promptOneFragmentOne2;
        promptOneFragmentOnePlayerId = receivedData.promptOneFragmentOnePlayerId;
        promptOneFragmentTwo1 = receivedData.promptOneFragmentTwo1;
        promptOneFragmentTwo2 = receivedData.promptOneFragmentTwo2;
        promptOneFragmentTwoPlayerId = receivedData.promptOneFragmentTwoPlayerId;

        promptTwoFragmentOne1 = receivedData.promptTwoFragmentOne1;
        promptTwoFragmentOne2 = receivedData.promptTwoFragmentOne2;
        promptTwoFragmentOnePlayerId = receivedData.promptTwoFragmentOnePlayerId;
        promptTwoFragmentTwo1 = receivedData.promptTwoFragmentTwo1;
        promptTwoFragmentTwo2 = receivedData.promptTwoFragmentTwo2;
        promptTwoFragmentTwoPlayerId = receivedData.promptTwoFragmentTwoPlayerId;

        clientId = receivedData.clientId;
    };

    function submitPromptOne() {
        if (userInputPromptOne == "" && userInputPromptTwo == "") return;

        const message = {
            promptOneFragmentOne: promptOneFragmentOne1,
            promptOneFragmentTwo: promptOneFragmentTwo1,
            userInputPromptOne: userInputPromptOne,
            userInputPromptTwo: userInputPromptTwo,
        };

        userInputPromptOne = "";
        userInputPromptTwo = "";

        socket.send(JSON.stringify(message));

        showPromptTwo = true;
    }

    function submitPromptTwo() {
        if (userInputPromptOne == "" && userInputPromptTwo == "") return;

        stage++;

        const message = {
            promptTwoFragmentOne: promptTwoFragmentOne1,
            promptTwoFragmentTwo: promptTwoFragmentTwo1,
            userInputPromptOne: userInputPromptOne,
            userInputPromptTwo: userInputPromptTwo,
        };
        socket.send(JSON.stringify(message));
    }
</script>

<div class="container">
    <div class="columns is-centered">
        <div class="column is-half">
            <div class="box">
                {#if !showPromptTwo}
                    <h1 class="title is-4">{promptOneFragmentOne1}</h1>
                    <h1 class="title is-4">{promptOneFragmentOne2}</h1>
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
                                    on:click={submitPromptOne}>Submit</button
                                >
                            </div>
                        {:else}
                            <div class="other-player">Other Player</div>
                        {/if}
                    </div>
                    <h1 class="title is-4">{promptOneFragmentTwo1}</h1>
                    <h1 class="title is-4">{promptOneFragmentTwo2}</h1>
                    <div class="field">
                        {#if clientId == promptOneFragmentTwoPlayerId}
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Enter something"
                                    bind:value={userInputPromptTwo}
                                />
                                <button
                                    class="button"
                                    on:click={submitPromptOne}>Submit</button
                                >
                            </div>
                        {:else}
                            <div class="other-player">Other Player</div>
                        {/if}
                    </div>
                {:else}
                    <!-- Show the second prompt and its input fields -->
                    <h1 class="title is-4">{promptTwoFragmentOne1}</h1>
                    <h1 class="title is-4">{promptTwoFragmentOne2}</h1>
                    <div class="field">
                        {#if clientId == promptTwoFragmentOnePlayerId}
                            <div class="control">
                                <input
                                    class="input"
                                    type="text"
                                    placeholder="Enter something"
                                    bind:value={userInputPromptOne}
                                />
                                <button
                                    class="button"
                                    on:click={submitPromptTwo}>Submit</button
                                >
                            </div>
                        {:else}
                            <div class="other-player">Other Player</div>
                        {/if}
                    </div>
                    <h1 class="title is-4">{promptTwoFragmentTwo1}</h1>
                    <h1 class="title is-4">{promptTwoFragmentTwo2}</h1>
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
                                    on:click={submitPromptTwo}>Submit</button
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
