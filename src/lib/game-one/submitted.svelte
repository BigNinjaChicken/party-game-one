<script lang="ts">
    import SubmittedTemplate from "./submitted_template.svelte";
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
            if (receivedData.Stage) {
                stage = receivedData.Stage;
                return;
            }
        };
    });
</script>

<SubmittedTemplate />