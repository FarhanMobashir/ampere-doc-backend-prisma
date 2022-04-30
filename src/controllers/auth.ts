import bcryptjs from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import prisma from "../lib/prisma";

export const signUp = async (req: express.Request, res: express.Response) => {
  const salt = bcryptjs.genSaltSync(10);
  const { email, password, firstName } = req.body;
  let user;
  if (!email || !password || !firstName) {
    return res
      .status(400)
      .send({ message: "need email,password and firstName" });
  }
  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcryptjs.hashSync(password, salt),
        firstName,
      },
    });
  } catch (e) {
    res.status(401);
    res.json({
      error: `User already exist`,
    });
    return;
  }

  // creating the token
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    "Secret",
    { expiresIn: "8h" }
  );

  // setting the cookie
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("AMPERE_DOC_TOKEN", token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: true,
    })
  );
  res.json(user);
};

// signin
export const signIn = async (req: express.Request, res: express.Response) => {
  const salt = bcryptjs.genSaltSync(10);
  const {
    email,
    password,
  }: {
    email: string;
    password: string;
  } = req.body;
  let user;
  user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user && bcryptjs.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
        time: Date.now(),
      },
      "Secret",
      { expiresIn: "8h" }
    );

    // setting the cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("AMPERE_DOC_TOKEN", token, {
        httpOnly: true,
        maxAge: 8 * 60 * 60,
        path: "/",
        sameSite: "lax",
        secure: false,
      })
    );
    res.json(user);
  } else {
    res.status(401);
    res.json({
      error: "Email or password is wrong",
    });
  }
};
