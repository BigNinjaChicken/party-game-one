<script lang="ts">
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    let players: any[] = [];

    let valueSingle: string = "";
    let hasSelected = false;

    onMount(async () => {
        socket.onmessage = async (event) => {
            console.log("WebSocket message received", event);
            receivedData = JSON.parse(event.data);
            if (receivedData.Stage) {
                stage++;
                return;
            }

            // Populate the players array from the received data
            players = [];
            for (let i = 0; i < 100; i++) {
                const playerName = receivedData[`PlayerName${i}`];
                if (playerName == "") break; // Go untill empty player name
                const playerScoreBonusOption =
                    receivedData[`PlayerScoreBonusOption${i}`];
                if (playerName && playerScoreBonusOption) {
                    players.push({
                        name: playerName,
                        scoreBonusOption: playerScoreBonusOption,
                    });
                }
            }
        };
    });

    function selectPlayer(player: any) {
        hasSelected = true;
        const message = {
            selectedPlayerName: player.name,
            multiplier: player.scoreBonusOption,
        };
        socket.send(JSON.stringify(message));
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
    <div class="grid grid-cols-1 gap-4">
        <h1 class="h1 text-center">
            <span class="gradient-heading text-center">Drink Bonus</span>
        </h1>
        {#if hasSelected}
            <p class="text-center">Waiting on other players</p>
        {:else if players.length > 0}
            <p class="text-center">
                Select a player to take a drink and get a multiplier:
            </p>
            <div class="card p-4">
                <div class="list-box-container">
                    <ListBox>
                        {#each players as player (player.name)}
                            <ListBoxItem
                                class="px-5 m-3"
                                bind:group={valueSingle}
                                name="medium"
                                value={player.name}
                                on:click={() => selectPlayer(player)}
                            >
                                <p class="text-base">{player.name}</p>
                                <p class="text-sm text-gray-500">
                                    {player.scoreBonusOption}x
                                </p>
                            </ListBoxItem>
                        {/each}
                    </ListBox>
                </div>
            </div>
        {:else}
            <p class="text-center">Waiting on other players</p>
        {/if}
    </div>
</body>

<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
    .list-box-container {
        text-align: center;
    }
    .gradient-heading {
        @apply bg-clip-text text-transparent box-decoration-clone;
        /* Direction */
        @apply bg-gradient-to-br;
        /* Color Stops */
        @apply from-indigo-500 via-purple-500 to-pink-500;
    }
</style>
