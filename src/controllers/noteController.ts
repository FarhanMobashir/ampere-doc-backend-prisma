import { validateRoute } from "../lib/validateRoute";
import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { User } from "@prisma/client";

// --> get all notes
export const getAllNote = validateRoute(
  async (req: Request, res: Response, user: User) => {
    try {
      const doc = await prisma.note.findMany({
        where: {
          createdBy: user.id,
        },
      });
      res.json(doc);
    } catch (error) {
      res.json({ error });
      res.status(400).end();
    }
  }
);
// --> get single note
export const getOneNote = validateRoute(
  async (req: Request, res: Response, user: User) => {
    try {
      const doc = await prisma.note.findFirst({
        where: {
          createdBy: user.id,
          id: Number(req.params.id),
        },
      });
      res.json(doc);
    } catch (error) {
      res.json({ error });
      res.status(400).end();
    }
  }
);

// --> create one note
export const createOneNote = validateRoute(
  async (req: Request, res: Response, user: User) => {
    try {
      const {
        title,
        body,
      }: {
        title: string;
        body: string;
      } = req.body;
      const doc = await prisma.note.create({
        data: {
          title: title,
          body: body,
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      res.json(doc);
    } catch (error) {
      res.json({ error });
      res.status(400).end();
    }
  }
);

// --> update note
export const updateNote = validateRoute(
  async (req: Request, res: Response, user: User) => {
    try {
      const {
        title,
        body,
      }: {
        title: string;
        body: string;
      } = req.body;
      const doc = await prisma.note.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          title,
          body,
        },
      });
      res.json(doc);
    } catch (error) {
      res.json({ error });
      res.status(400).end();
    }
  }
);

// --> delete note
export const deleteNote = validateRoute(
  async (req: Request, res: Response, user: User) => {
    try {
      const {
        title,
        body,
      }: {
        title: string;
        body: string;
      } = req.body;
      const doc = await prisma.note.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.json(doc);
    } catch (error) {
      res.json({ error });
      res.status(400).end();
    }
  }
);
