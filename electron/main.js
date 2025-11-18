// electron/main.js
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "AlphaGround",
    });

    // load dev

    const devUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";

    mainWindow
        .loadURL(devUrl)
        .catch((err) => console.error("Failed to load URL:", err));

    mainWindow.webContents.openDevTools();

    //production
    //mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
}

app.setName("AlphaGround");

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
