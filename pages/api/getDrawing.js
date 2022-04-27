import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  const prisma = new PrismaClient();

  // Find the drawing for the passed in id
  const drawing = await prisma.drawing.findUnique({
    where: {
      id: req.body.drawingId
    },
    include: {
      strokes: true,
      user: true //todochris return user without the password, only necessary data
    }
  });

  return res.status(200).json({ drawing });
}
