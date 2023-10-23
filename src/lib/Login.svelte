<script lang="ts">
    import { onMount } from "svelte";
	import "bulma/css/bulma.css";

    let randomName: string;
    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    const generateRandomName = () => {
        const names = ["Frazier", "Tom"];
        const randomIndex = Math.floor(Math.random() * names.length);
        randomName = names[randomIndex];
    };

    // Generate a random name when the component loads
    generateRandomName();

    let joinText: string = "Join";
    let lobbyCode: string = "";
    let playerName: string = "";
    let errorText: string = ""; // Add errorText variable for error handling

    onMount(async () => {
        socket.onmessage = async (event) => {
            console.log("WebSocket message received", event);
            receivedData = JSON.parse(event.data);
            stage = 2;
        };
    });

    async function joinLobby() {
        // Get the lobbyCode and playerName from the input fields
        const enteredLobbyCode = lobbyCode.trim();
        const enteredPlayerName = playerName.trim();

        // Check if lobbyCode and playerName are not empty
        if (enteredLobbyCode && enteredPlayerName) {
            console.log("Lobby Code:", enteredLobbyCode);
            console.log("Player Name:", enteredPlayerName);

            const data = {
                bJoinGame: true,
                sessionCode: enteredLobbyCode,
                playerName: enteredPlayerName,
            };
            socket.send(JSON.stringify(data));
            joinText = "Joining Lobby...";
        } else {
            errorText = "Please enter a valid Lobby Code and Player Name";
            joinText = "Join";
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            joinLobby();
        }
    }

    function convertToUpperCase(event: Event) {
        const inputElement = event.currentTarget as HTMLInputElement;
        let value = inputElement.value.toUpperCase();

        // Limit the input to 4 characters
        if (value.length > 4) {
            value = value.slice(0, 4);
        }

        inputElement.value = value;
    }

    function limitInput(event: Event) {
        const inputElement = event.currentTarget as HTMLInputElement;
        let value = inputElement.value;
        const inputLimit = 18;

        if (value.length > inputLimit) {
            value = value.slice(0, inputLimit);
        }

        inputElement.value = value;
    }
</script>

<section class="hero is-fullheight background">
    <div class="hero-body has-text-centered">
        <div class="container">
            <div
                class="box has-shadow"
                style="max-width: 400px; margin: 0 auto; padding: 20px;"
            >
                <h1 class="title is-4">AlcyBox Join Menu</h1>
                <div class="field">
                    <label class="label" for="input1">Lobby Code</label>
                    <div class="control">
                        <input
                            class="input"
                            type="text"
                            id="input1"
                            placeholder="ABCD"
                            on:keydown={handleKeyDown}
                            on:input={convertToUpperCase}
                            bind:value={lobbyCode}
                        />
                    </div>
                </div>
                <div class="field">
                    <label class="label" for="input2">Name</label>
                    <div class="control">
                        <input
                            class="input"
                            type="text"
                            id="input2"
                            placeholder={randomName}
                            on:keydown={handleKeyDown}
                            on:input={limitInput}
                            bind:value={playerName}
                        />
                    </div>
                </div>
                <button
                    class="button is-primary is-fullwidth"
                    on:click={joinLobby}>{joinText}</button
                >
                {#if errorText}
                    <p class="has-text-danger">{errorText}</p>
                {/if}
            </div>
        </div>
    </div>
</section>

<style>
    .background {
        background: linear-gradient(
            to bottom right,
            rgb(100, 236, 223),
            rgb(221, 0, 223)
        );
        background-size: 200% 200%;
        animation: rotateGradient 10s linear infinite;
    }

    @keyframes rotateGradient {
        0%,
        100% {
            background-position: 0% 0%;
        }
        50% {
            background-position: 100% 100%;
        }
    }
</style>