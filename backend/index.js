import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todos.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/todos", todoRoutes);

app.listen(PORT, (req, res) => {
  console.log("Start on port ", PORT);
});
