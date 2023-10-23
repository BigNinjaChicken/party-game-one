<script lang="ts">
    import { onMount } from "svelte";

    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    onMount(async () => {
        if (!socket) {
            console.log("Invalid Socket");
            return;
        }

        socket.onmessage = async (event) => {
            console.log("WebSocket message received", event);
            receivedData = JSON.parse(event.data);
            if (receivedData.Stage) stage++;
        };
    });
</script>

<div class="message">
    <div class="message-header">All Submitted.</div>
    <div class="message-body">
        <!-- Your message content here -->
    </div>
</div>
