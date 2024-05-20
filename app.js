import "dotenv/config";

import express from "express";

import morgan from "morgan";

import cors from "cors";

import routes from "./routes/contactsRouter.js";

import "./server.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", routes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(8080, () => {
  console.log("Server is running. Use our API on port: 8080");
});
