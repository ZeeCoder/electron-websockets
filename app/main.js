const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const { ipcMain } = require("electron");
const ip = require("ip");
const WebSocket = require("ws");

let wss = null;
ipcMain.on("start-server", e => {
  if (wss) {
    e.returnValue = ip.address();
    return;
  }

  wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", function connection(ws) {
    console.log("connection!");
    ws.on("message", function incoming(message) {
      console.log("Message received: %s", message);

      try {
        message = JSON.parse(message);
      } catch (e) {
        console.error("Non-json message:", message, e);
        return;
      }

      if (message.type !== "data-capture") {
        console.log("Missing message type.");
        return;
      }

      win.webContents.send("data-capture", message.data);
    });

    ws.send("Welcome from the Server.");
  });

  e.returnValue = ip.address();
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true,
    }),
  );

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
