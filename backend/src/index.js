//const express = require("express");
import express from "express";
import "dotenv/config"

const app = express();

console.log(process.env.DATABASE_URL);

app.listen(3000, () => console.log("Server is running on port 23"));