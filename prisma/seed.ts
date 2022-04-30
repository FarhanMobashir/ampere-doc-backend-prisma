import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { notes } from "./NoteData";

const prisma = new PrismaClient();

const run = async () => {
  const salt = bcryptjs.genSaltSync(10);
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      password: bcryptjs.hashSync("password", salt),
      firstName: "Scott",
      lastName: "Moss",
    },
  });
  await Promise.all(
    notes.map(async (item) => {
      return prisma.note.create({
        data: {
          title: item.title,
          body: item.body,
          tag: item.tag,
          author: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    })
  );
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
