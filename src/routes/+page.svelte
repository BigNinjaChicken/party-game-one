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

	import { io } from "socket.io-client";

	const socket = io();

	socket.on("eventFromServer", (message) => {
		console.log(message);
	});
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
						/>
					</div>
				</div>
				<button class="button is-primary is-fullwidth">Join</button>
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
