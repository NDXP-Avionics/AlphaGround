import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    server: {
        port: 5173,
    },
    define: {
        "process.env.VITE_DEV_SERVER_URL":
            mode === "development"
                ? JSON.stringify("http://localhost:5173")
                : undefined,
    },
    base: "./", // ← crucial for Electron
}));
