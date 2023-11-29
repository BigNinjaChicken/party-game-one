<script lang="ts">
    import { onMount } from "svelte";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let chatInput = "";

    onMount(async () => {
        socket.onmessage = async (event: any) => {
            receivedData = JSON.parse(event.data);

            if (receivedData.Stage) {
                stage = receivedData.Stage;
                return;
            }
        };
    });

    const message = {
        bJoinedGame: true,
    };
    socket.send(JSON.stringify(message));

    let bIsReady = false;

    function toggleReady() {
        bIsReady = !bIsReady;
        const message = {
            bIsReady: bIsReady,
        };
        socket.send(JSON.stringify(message));
    }

    function sendChatMessage() {
        if (chatInput.trim() !== "") {
            socket.send(JSON.stringify({ ChatMessage: chatInput }));
            chatInput = ""; // Clear the input after sending
        }
    }
</script>

<body data-theme="crimson">
    <section class="p-4">
        <div class="max-w-md mx-auto">
            <div class="bg-surface-500 shadow-md rounded px-8 pt-10 pb-2">
                <!-- Ready Button -->
                <div class="mb-10 flex flex-col items-center justify-center">
                    <h2 class="text-3xl text-md mb-2 text-center">
                        Ready Up once <span class="font-bold">everyone</span> has
                        joined:
                    </h2>
                    <button
                        class="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-xl {bIsReady
                            ? 'bg-primary-500'
                            : 'bg-secondary-500'}"
                        on:click={toggleReady}
                    >
                        {bIsReady ? "You're Ready!" : "Press Me To Ready Up"}
                    </button>
                </div>
            </div>
        </div>
        <!-- Chat UI -->
        <div class="mt-7">
            <h1 class="text-lg font-semibold mb-2">
                Send messages while you wait:
            </h1>
            <div
                class="input-group input-group-divider grid-cols-[1fr_auto]"
            >
                <input
                    class="p-2 outline-none"
                    type="text"
                    placeholder="Type your message"
                    bind:value={chatInput}
                    on:keyup={(e) =>
                        e.key === "Enter" && sendChatMessage()}
                />
                <button on:click={sendChatMessage}>Send</button>
            </div>
        </div>
    </section>
</body>

<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }

    @keyframes scaleUp {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.1);
        }
    }
</style>
