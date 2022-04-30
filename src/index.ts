import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { signIn, signUp } from "./controllers/auth";
import { me } from "./lib/me";
import {
  createOneNote,
  deleteNote,
  getAllNote,
  getNoteByTag,
  getOneNote,
  updateNote,
} from "./controllers/noteController";

const app = express();
const port = 8080;
dotenv.config();
app.disable("x-powered-by");
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

const prisma = new PrismaClient();

app.get("/", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.send({
    message: "Hello from the server",
    notes: notes,
  });
});

app.post("/signup", signUp);
app.post("/signin", signIn);
app.get("/me", me);
app.get("/notes", getAllNote);
app.get("/notes/:id", getOneNote);
app.patch("/notes/:id", updateNote);
app.delete("/notes/:id", deleteNote);
app.post("/notes/create", createOneNote);
app.get("/notes/tag/:tag", getNoteByTag);

// starting the app
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port} 🚀🚀`);
});
