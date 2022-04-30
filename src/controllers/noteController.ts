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
          id: req.params.id,
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
      const doc = await prisma.note.updateMany({
        where: {
          createdBy: user.id,
          id: req.params.id,
        },
        data: {
          title,
          body,
        },
      });
      if (doc) {
        res.status(200).json(
          await prisma.note.findMany({
            where: {
              createdBy: user.id,
            },
          })
        );
      } else {
        res.json({ error: "Something Went wrong" });
      }
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
      const doc = await prisma.note.deleteMany({
        where: {
          createdBy: user.id,
          id: req.params.id,
        },
      });
      if (doc) {
        res.status(200).json(
          await prisma.note.findMany({
            where: {
              createdBy: user.id,
            },
          })
        );
      } else {
        res.status(400).json({
          error: "Something went wrong",
        });
      }
      res.json(doc);
    } catch (error) {
      res.json({ error });
      res.status(400).end();
    }
  }
);
