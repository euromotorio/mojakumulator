require("dotenv").config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import akuRouter from "./controllers/aku";
import userRouter from "./controllers/user";

import { MONGODB_URI } from "./util/config";
import { errorHandler } from "./util/middleware";

const app = express();
const path = require("path");

app.use(express.json());
app.use(cors());

app.use(express.static(path.resolve(__dirname, "../frontend")));

app.use("/api/akus", akuRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI!).then((db) => {
	app.listen(PORT, () => {
		console.log(`Server running on ${PORT}`);
		console.log(`Connected to the ${db.connections[0].name} database`);
	});
});
