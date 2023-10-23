<script lang="ts">
	import { onMount } from "svelte";

	import Login from "../lib/Login.svelte";
	import ReadyUp from "../lib/game-one/app.svelte";
	import Prompt from "../lib/game-one/prompt.svelte";
	import Submitted from "../lib/game-one/submitted.svelte";
	import Pole from "../lib/game-one/pole.svelte";
	import AllPole from "../lib/game-one/all_pole.svelte";
	import PointMult from "../lib/game-one/point_mult.svelte";

	let stage: number;
	let socket: WebSocket;
	let receivedData = {};
	let isSocketOpen = false; // Add this flag to track socket status
	const NODE_ENV = process.env.NODE_ENV;

	stage = 0; // Set the initial stage to 0

	onMount(async () => {
		if (NODE_ENV == "dev") {
			socket = new WebSocket("ws://localhost:8080");
		} else if (NODE_ENV == "prod") {
			socket = new WebSocket("wss://party-game-web-service.onrender.com");
		} else {
			console.log("Invalid NODE_ENV");
			return;
		}

		socket.onopen = (event) => {
			console.log("WebSocket connection opened", event);
			isSocketOpen = true; // Set the flag to true

			const data = {
				clientType: "Web",
			};
			socket.send(JSON.stringify(data));
		};

		socket.onmessage = async (event) => {
			console.log("WebSocket message received", event);
			receivedData = JSON.parse(event.data);
		};

		socket.onclose = (event) => {
			console.log("WebSocket connection closed", event);
		};
	});

	// Watch for changes in isSocketOpen and update the stage accordingly
	$: {
		if (isSocketOpen && stage === 0) {
			stage = 1; // Only change the stage when the socket is open
		}
	}
</script>

<svelte:head>
	<title>BlackoutBox</title>
	<meta
		name="description"
		content="This is where you join a lobby hosted by a computer."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

{#if stage == 0}
	<div/>
{:else if stage == 1}
	<Login bind:stage {socket} bind:receivedData />
{:else if stage == 2}
	<ReadyUp bind:stage {socket} bind:receivedData/>
{:else if stage == 3}
	<Submitted bind:stage {socket} bind:receivedData />
{:else if stage == 4}
	<Prompt bind:stage {socket} bind:receivedData />
{:else if stage == 5}
	<Submitted bind:stage {socket} bind:receivedData />
{:else if stage == 6}
	<Pole bind:stage {socket} bind:receivedData />
{:else if stage == 7}
	<AllPole bind:stage {socket} bind:receivedData />
{:else if stage == 8}
	<Submitted bind:stage {socket} bind:receivedData />
{:else if stage == 9}
	<PointMult bind:stage {socket} bind:receivedData />
{:else}
	<h1>Error</h1>
{/if}
