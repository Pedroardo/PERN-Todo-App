import { Router } from "express";

import pool from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { description, completed } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    const newTodo = await pool.query(
      "INSERT INTO todo (description, completed) VALUES ($1, $2) RETURNING *",
      [description, completed || false]
    );

    res.json(newTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    const updateTodo = await pool.query(
      "UPDATE todo set description = $1, completed = $2 WHERE todo_id = $3 RETURNING *",
      [description, completed || false, id]
    );
    if (updateTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({
      message: "Todo updated",
      todo: updateTodo.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id]
    );
    if (deleteTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json("Todo deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

export default router;
