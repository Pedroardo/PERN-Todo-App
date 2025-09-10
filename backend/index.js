import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todos.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://pern-todo-frontend-xi.vercel.app/",
  })
);
app.use(express.json());

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log("Start on port ", PORT);
});
