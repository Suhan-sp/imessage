import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import "dotenv/config";

import { clerkMiddleware } from "@clerk/express";

import User from "./models/User.js";
import { connectDB } from "./lib/db.js";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
    res.status(200).json({ok: true});
});

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("MongoDB connected successfully");
            console.log("Server is running on port", PORT);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();