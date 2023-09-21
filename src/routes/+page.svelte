<script lang="ts">
	import "bulma/css/bulma.css";

	let randomName: string;
	const generateRandomName = () => {
		const names = ["Frazier", "Tom"];
		const randomIndex = Math.floor(Math.random() * names.length);
		randomName = names[randomIndex];
	};
	// Generate a random name when the component loads
	generateRandomName();

	import { onMount } from "svelte";

	let socket: WebSocket;
	let message = "";

	onMount(() => {
		socket = new WebSocket("ws://localhost:8080"); // Change the URL as needed

		socket.onopen = (event) => {
			console.log("WebSocket connection opened", event);
		};

		socket.onmessage = (event) => {
			console.log("WebSocket message received", event);
			message = event.data;
		};

		socket.onclose = (event) => {
			console.log("WebSocket connection closed", event);
		};
	});

	let joinText = "Join";
	let lobbyCode: string = "";
	let playerName: string = "";

	function joinLobby() {
		joinText = "Joining Lobby...";

		// Get the lobbyCode and playerName from the input fields
		const enteredLobbyCode = lobbyCode.trim();
		const enteredPlayerName = playerName.trim();

		// Check if lobbyCode and playerName are not empty
		if (enteredLobbyCode && enteredPlayerName) {
			console.log("Lobby Code:", enteredLobbyCode);
			console.log("Player Name:", enteredPlayerName);

			const data = {
				lobbyCode: enteredLobbyCode,
				playerName: enteredPlayerName,
			};
			socket.send(JSON.stringify(data));
		} else {
			console.log("Please enter a valid Lobby Code and Player Name");
		}
	}
</script>

<svelte:head>
	<title>BlackoutBox Join Game</title>
	<meta
		name="description"
		content="This is where you join a lobby hosted by a computer."
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<section class="hero is-fullheight mx-7 background">
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
							bind:value={playerName}
						/>
					</div>
				</div>
				<button
					class="button is-primary is-fullwidth"
					on:click={joinLobby}>{joinText}</button
				>
			</div>
		</div>
	</div>
</section>

<style>
	/* Additional styling if needed */
	.background {
		background: linear-gradient(
			to bottom right,
			#d9e6f3,
			rgb(221, 236, 223)
		);
	}
</style>
