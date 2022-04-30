import prisma from "./prisma";
import { validateRoute } from "./validateRoute";
import express from "express";

export const me = validateRoute(
  async (req: express.Request, res: express.Response, user: any) => {
    const notes = await prisma.note.findMany({
      where: {
        createdBy: user.id,
      },
    });
    res.json({ ...user, notes });
  }
);
