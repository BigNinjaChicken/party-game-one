<script lang="ts">
    export let stage: number;
    export let socket: WebSocket;
    export let receivedData: any;

    stage = 1;
</script>

<body data-theme="crimson">
    <main class="section">
        <div class="container">
            <h1 class="title">Poll Screen</h1>
                <button class="btn variant-filled">
                    <p class="whitespace-normal">
                        Lots of Text
                        Lots of TextResponse
                        Lots of Text
                        Lots of TextResponse
                        Lots of Text
                        Lots of TextResponse
                        Lots of Text
                        Lots of TextResponse
                        Lots of Text
                        Lots of TextResponse
                        Lots of Text
                        Lots of TextResponse
                        Lots of Text
                        Lots of TextResponse
                        Lots of Text
                        Lots of TextResponse
                    </p>
                </button>
        </div>
    </main>
</body>

<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
</style>
