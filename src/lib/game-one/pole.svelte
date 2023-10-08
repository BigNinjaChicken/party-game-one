<script lang="ts">
    import Submitted from "./submitted.svelte";
    import ShowAllPole from "./all_pole.svelte";

    export let receivedData: any;
    export let socket: WebSocket;

    let showPole = true;
    let showAllPrompts = false;

    let option1Text: string;
    let option2Text: string;

    updateOptionText();

    socket.onmessage = async (event: any) => {
        console.log("WebSocket message received", event);
        receivedData = JSON.parse(event.data);
        if (receivedData.ShowAllPrompts) {
            showAllPrompts = true;
            return;
        }
        updateOptionText();
        showPole = true;
    };

    let selectedOption: string;

    function selectOption(option: string) {
        let message = {
            poleSelection: option,
        };
        socket.send(JSON.stringify(message));
        showPole = false;
    }

    function updateOptionText() {
        option1Text = receivedData.Option1;
        option2Text = receivedData.Option2;
    }
</script>

{#if showAllPrompts}
    <ShowAllPole {receivedData} {socket} />
{:else if showPole}
    <main class="section">
        <div class="container">
            <h1 class="title">Poll Screen</h1>
            <div class="buttons">
                <button
                    class="button"
                    class:selected={selectedOption === "Option1"}
                    on:click={() => selectOption("Option1")}
                >
                    {option1Text}
                </button>
                <button
                    class="button"
                    class:selected={selectedOption === "Option2"}
                    on:click={() => selectOption("Option2")}
                >
                    {option2Text}
                </button>
            </div>
        </div>
    </main>
{:else}
    <Submitted />
{/if}

<style>
    .selected {
        background-color: #00d1b2;
        color: #fff;
    }
</style>
