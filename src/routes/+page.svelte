<script lang="ts">
	import { onMount } from "svelte";
	import NoSleep from "nosleep.js";

	import Login from "$lib/Login.svelte";
	import ReadyUp from "$lib/game-one/app.svelte";
	import Prompt from "$lib/game-one/prompt.svelte";
	import Submitted from "$lib/game-one/submitted.svelte";
	import Pole from "$lib/game-one/pole.svelte";
	import AllPole from "$lib/game-one/all_pole.svelte";
	import PointMult from "$lib/game-one/point_mult.svelte";
	import PromptAct3 from "$lib/game-one/prompt_act_3.svelte";
	import Restart from "$lib/game-one/restart.svelte";
	import Takeshotready from "$lib/game-one/takeshotready.svelte";

	let stage: number;
	let socket: WebSocket;
	let receivedData = {};
	let isSocketOpen = false;
	const NODE_ENV = process.env.NODE_ENV;

	const componentList = [
		Login, // Login
		ReadyUp,
		Submitted, // Tutorial
		Prompt, // Act 1
		Pole,
		AllPole,
		Submitted,
		PointMult, // Drinking Bonus
		Takeshotready,
		Prompt, // Act 2
		Pole,
		AllPole,
		Submitted,
		PointMult, // Drinking Bonus
		Takeshotready,
		PromptAct3, // Act 3
		Pole,
		AllPole,
		Submitted,
		Restart,
	];

	stage = 0;

	onMount(async () => {
		if (NODE_ENV == "dev") {
			socket = new WebSocket("ws://localhost:8080");
		} else if (NODE_ENV == "prod") {
			socket = new WebSocket("wss://party-game-web-service.onrender.com");
		} else {
			console.log("Invalid NODE_ENV");
			return;
		}

		var noSleep = new NoSleep();

		// Enable wake lock.
		// (must be wrapped in a user input event handler e.g. a mouse or touch handler)
		document.addEventListener(
			"click",
			function enableNoSleep() {
				document.removeEventListener("click", enableNoSleep, false);
				noSleep.enable();
			},
			false
		);

		// Disable wake lock at some point in the future.
		// (does not need to be wrapped in any user input event handler)
		// noSleep.disable();

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

	$: {
		if (isSocketOpen && stage === 0) {
			stage = 1;
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
	<div />
{:else}
	<svelte:component
		this={componentList[stage - 1]}
		bind:stage
		{socket}
		bind:receivedData
	/>
{/if}

<style>
	@font-face {
		font-family: "Scrappy";
		font-style: normal;
		font-weight: 100;
		src: url("/fonts/Scrappy.ttf") format("truetype");
	}
</style>
