// electron/main.js
import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "AlphaGround",
        webPreferences: {
            nodeIntegration: false, // Best practice for security
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"), // Optional if you have one
        },
    });

    // 1. Check if the app is packaged (Production) or in Development
    if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
        // --- DEVELOPMENT ---
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    } else {
        // --- PRODUCTION ---
        // Logic: __dirname points to 'app.asar/electron'
        // We need to go up one level to find 'app.asar/dist'
        const indexProdPath = path.join(__dirname, "../dist/index.html");

        mainWindow.loadFile(indexProdPath).catch((e) => {
            console.error("Failed to load file:", e);
        });
    }
}

app.setName("AlphaGround");

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
