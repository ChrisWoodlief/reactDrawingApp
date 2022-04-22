// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  let prisma = new PrismaClient();

  // Create a drawing
  const drawing = await prisma.drawing.create({
    data: {
      userId: session.userId
    },
  });

  res.status(200).json({ drawing });
}
