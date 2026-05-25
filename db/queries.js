import { prisma } from "../lib/prisma.js";

const getUserByEmail = async (email) =>
  prisma.user.findUnique({
    where: { email },
  });

const getUserById = async (id) =>
  prisma.user.findUnique({
    where: { id },
  });

const addUser = async (name, email, password) => {
  const user = await prisma.user.create({ data: { name, email, password } });
};

const addFile = async ({ name, mimeType, size }) => {
  console.log("WORKING!!!");
  const file = await prisma.file.create({
    data: {
      name,
      mimeType,
      size,
    },
  });
  console.log("uploaded");
};

export const db = {
  getUserByEmail,
  getUserById,
  addUser,
  addFile,
};
