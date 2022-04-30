import jwt from "jsonwebtoken";
import express from "express";
import prisma from "./prisma";

interface JwtPayload {
  email: string;
}

export const validateRoute = (handler: any) => {
  return async (req: express.Request, res: express.Response) => {
    const token = req.headers.cookie?.slice(17);
    if (token) {
      let user;
      try {
        const { email } = jwt.verify(token, "Secret") as JwtPayload;
        user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          throw new Error("Not a real user");
        }
      } catch (error) {
        res.status(401);
        res.json({ error: "Not Authorised Man" });
        return;
      }
      return handler(req, res, user);
    }
    res.status(401);
    res.json({ error: "Not Authorised" });
  };
};
