import { WebSocketServer } from "ws";

const socket = new WebSocketServer({ port: 8080 }, () => {
  console.log("Web socket server started at port 8080");
});

socket.on("connection", (ws: WebSocket, req: Request) => {
  console.log("Client connected");

  ws.send("Hello from server");

  ws.onmessage = (res) => {
    const data = JSON.parse(res.data);
    // console.log(data)
    if (data.message === "code") {
      console.log(data.data);
    }
  };
});
