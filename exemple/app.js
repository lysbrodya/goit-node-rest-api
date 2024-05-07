import "dotenv/config";

import express from "express";

import routes from "./routes/index.js";

import "./db.js";

const app = express();

app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).send("Not found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error");
});

app.listen(8080, () => {
  console.log("Server is running. Use our API on port: 8080");
});

// import mongoose, { connect } from "mongoose";

// const DB_URI = `mongodb+srv://Uzerdata:Uzerdata@cluster0.rdgn861.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0`;

// mongoose
//   .connect(DB_URI)
//   .then(() => {
//     console.log("Database connect success");
//   })
//   .catch((error) => {
//     console.log(error.message);
//     process.exit(1);
//   });
