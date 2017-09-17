const { ipcRenderer } = require("electron");

const serverSection = document.getElementById("server-section");
const serverInactiveSection = document.getElementById(
  "server-inactive-section",
);
const serverActiveSection = document.getElementById("server-active-section");
const clientSection = document.getElementById("client-section");
const clientActiveSection = document.getElementById("client-active-section");
const clientInactiveSection = document.getElementById(
  "client-inactive-section",
);
const serverIpContainer = document.getElementById("server-ip-container");
const serverIpInput = document.getElementById("server-ip-input");
const connectedTo = document.getElementById("connected-to");

const form = document.getElementById("form");
const formName = document.getElementById("form-name");
const formEmail = document.getElementById("form-email");
const formSubmit = document.getElementById("form-submit");

const dataCaptureWrapper = document.getElementById("dataCaptureWrapper");

formSubmit.addEventListener("click", () => {
  const name = formName.value;
  const email = formEmail.value;

  const data = {
    type: "data-capture",
    data: { name: name, email: email },
  };

  console.log("Sending data to server: ", data);

  ws.send(JSON.stringify(data));

  form.reset();
});

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
    connectedTo.textContent = serverIp;
    serverSection.style.display = "none";
    clientInactiveSection.style.display = "none";
    clientActiveSection.style.display = "block";
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

  serverIp = ipcRenderer.sendSync("start-server");
  serverIpContainer.textContent = serverIp;

  clientSection.style.display = "none";
  serverInactiveSection.style.display = "none";
  serverActiveSection.style.display = "block";

  ipcRenderer.on("data-capture", (e, data) => {
    console.log("DataCapture from main process:", data);
    dataCaptureWrapper.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="dataCapture">
          <b>Name</b>: "${data.name}" <br>
          <b>E-mail</b>: "${data.email}"
        </div>
      `,
    );
  });
}

const serverButton = document.getElementById("start-server");
serverButton.addEventListener("click", () => startServer());
