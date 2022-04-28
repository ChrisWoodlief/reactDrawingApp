import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  const prisma = new PrismaClient();

  // Find all drawings
  const drawings = await prisma.drawing.findMany({
    where: {
      isPrivate: false
    },
    orderBy: [ //Newest drawings first
      {
        createdAt: 'desc',
      }
    ],
    include: {
      strokes: true,
      user: { //Use select when including users so no passwords are shared!
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  return res.status(200).json({ drawings });
}
