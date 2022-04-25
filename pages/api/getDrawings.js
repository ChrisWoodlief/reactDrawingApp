import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  //const body = JSON.parse(req.body);
  const session = await getSession({ req })
  const prisma = new PrismaClient();

  // Find all drawings
  const drawings = await prisma.drawing.findMany({
    include: {
      strokes: true,
      user: true //todochris return user without the password, only necessary data
    }
  });

  return res.status(200).json({ drawings });
}
