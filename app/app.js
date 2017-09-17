const { ipcRenderer } = require("electron");

const serverSection = document.getElementById("server-section");
const clientSection = document.getElementById("client-section");
const serverIpContainer = document.getElementById("server-ip-container");
const serverIpInput = document.getElementById("server-ip-input");

let ws = null;
function startClient() {
  if (ws) {
    alert("Client already connected.");
    return;
  }

  let serverIp = serverIpInput.value;
  console.log(`Connecting to: ${serverIp}...`);
  ws = new WebSocket(`ws:${serverIp}:8080`);

  ws.onopen = e => {
    console.log("Open: ", e);
    console.log(`Connected to: ${serverIp}`);
    serverSection.style.display = "none";
  };
  ws.onclose = e => console.log("Close: ", e);
  ws.onerror = e => {
    console.error("Error: ", e);
    ws = null;
  };
  ws.onmessage = e => console.log("Message received: ", e.data);
}

const clientButton = document.getElementById("client-button");
clientButton.addEventListener("click", () => startClient());

let serverIp;
function startServer() {
  if (serverIp) {
    alert("Server already started.");
    return;
  }

  serverIp = ipcRenderer.sendSync("start-server", "ping");
  serverIpContainer.textContent = serverIp;

  clientSection.style.display = "none";
}

const serverButton = document.getElementById("start-server");
serverButton.addEventListener("click", () => startServer());
