<script lang="ts">
    import { onMount } from "svelte";

    let randomName: string;
    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;
    export let tabBarPlayerName: string;
    export let tabBarCode: string;

    const generateRandomName = () => {
        const names = [
            "Frazier",
            "Tom",
            "Berk",
            "Jackson",
            "Chase",
            "Davis",
            "Ethan",
            "Jelani",
            "Gus",
            "Isaac",
            "Max"
        ];
        const randomIndex = Math.floor(Math.random() * names.length);
        randomName = names[randomIndex];
    };

    // Generate a random name when the component loads
    generateRandomName();

    let joinText: string = "Join";
    let lobbyCode: string = "";
    let playerName: string = "";
    let errorText: string = "";

    if (
        tabBarPlayerName != "" &&
        tabBarCode != "" &&
        lobbyCode == "" &&
        playerName == ""
    ) {
        lobbyCode = tabBarCode;
        playerName = tabBarPlayerName;
    }

    onMount(async () => {
        socket.onmessage = async (event) => {
            console.log("WebSocket message received", event);
            const data = JSON.parse(event.data);

            // Handle different types of messages from the server
            if (data.bValidSession !== undefined) {
                if (data.bValidSession) {
                    stage = data.currentStage; // Update stage from server data
                    joinText = "Joined";
                } else {
                    errorText = "Invalid Lobby Code"; // Show error
                    joinText = "Join";
                }
            }
        };
    });

    async function joinLobby() {
        // Get the lobbyCode and playerName from the input fields
        const enteredLobbyCode = lobbyCode.trim();
        const enteredPlayerName = playerName.trim().toUpperCase();

        // Check if lobbyCode and playerName are not empty
        if (enteredLobbyCode && enteredPlayerName) {
            console.log("Lobby Code:", enteredLobbyCode);
            console.log("Player Name:", enteredPlayerName);

            tabBarPlayerName = enteredPlayerName;
            tabBarCode = enteredLobbyCode;

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

<body data-theme="crimson">
    <section
        class="flex justify-center items-center h-screen m-0 bg-gradient-to-br from-blue-500 to-green-400 bg-200% animate-rotateGradient"
    >
        <div class="text-center bg-surface-600 rounded-md">
            <div class="p-5 m-10">
                <h1 class="text-4xl font-bold">Rounds On Me Join Menu</h1>
                <div class="mb-4">
                    <label class="block text-lg mb-2" for="input1"
                        >Lobby Code</label
                    >
                    <input
                        class="w-full px-3 py-2 input"
                        type="text"
                        id="input1"
                        placeholder="ABCD"
                        on:keydown={handleKeyDown}
                        on:input={convertToUpperCase}
                        bind:value={lobbyCode}
                    />
                </div>
                <div class="mb-4">
                    <label class="block text-lg mb-2" for="input2">Name</label>
                    <input
                        class="w-full px-3 py-2 input"
                        type="text"
                        id="input2"
                        placeholder={randomName}
                        on:keydown={handleKeyDown}
                        on:input={limitInput}
                        bind:value={playerName}
                    />
                </div>
                <button
                    class="btn variant-filled-success px-10"
                    on:click={joinLobby}>{joinText}</button
                >
                {#if errorText}
                    <p class="text-red-500 pt-5">{errorText}</p>
                {/if}
            </div>
        </div>
    </section>
</body>

<style>
    @keyframes rotateGradient {
        0%,
        100% {
            background-position: 0% 0%;
        }
        50% {
            background-position: 100% 100%;
        }
    }

    h1 {
        font-family: "Scrappy", sans-serif;
    }
</style>
