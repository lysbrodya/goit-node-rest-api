import "dotenv/config";

import express from "express";

import morgan from "morgan";

import cors from "cors";

import routes from "./routes/routes.js";

import path from "node:path";

import "./server.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Server is running. Use our API on port: ${PORT}`)
);
