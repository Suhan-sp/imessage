import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import fs from "fs";

import { clerkMiddleware } from "@clerk/express";

import User from "./models/User.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import { app, server } from "./lib/socket.js";


const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 3000;

const publicDir = path.join(process.cwd(), "public");

//its important that u dont parse the webhook event data it should be in raw formats
app.use("/api/webhooks/clerk",express.raw({type: "application/json"}),clerkWebhook);

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());


app.get("/health", (req, res) => {
    res.status(200).json({ok: true});
});

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);


if(fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get("/{*any}", (req, res,next) => {
        res.sendFile(path.join(publicDir, "index.html"),(err) => next(err));
    });
}

async function startServer() {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log("MongoDB connected successfully");
            console.log("Server is running on port", PORT);

            if(process.env.NODE_ENV === "production") {
                job.start()
            }
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();