import express from "express";
import "dotenv/config";
import { z } from "zod";
import dayjs from "dayjs";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  dueDate: z.string().date().optional(),
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: dayjs().toISOString(),
  });
});

app.post("/tasks", (req, res) => {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid task data",
      details: result.error.issues,
    });
  }

  const task = {
    id: 1,
    title: result.data.title,
    dueDate: result.data.dueDate ?? null,
    createdAt: dayjs().toISOString(),
  };

  return res.status(201).json({ task });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});