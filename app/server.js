const ip = require("ip");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

console.log("Server IP Address is: ", ip.address());

wss.on("connection", function connection(ws) {
  console.log("connection!");
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("Welcome from the Server.");
});
