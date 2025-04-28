import { WebSocketServer } from "ws";

const socket = new WebSocketServer({ port: 8080 }, () => {
  console.log("Web socket server started at port 8080");
});

socket.on("connection", (ws, req)=>{

    console.log("Client connected");

    ws.send("Hello from server");

})

