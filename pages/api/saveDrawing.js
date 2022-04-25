// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  //const body = JSON.parse(req.body);
  const session = await getSession({ req })
  const prisma = new PrismaClient();

  // Create a drawing
  const drawing = await prisma.drawing.create({
    data: {
      userId: '1',
      drawTimeMS: req.body.drawTimeMS
    },
  });
  return res.status(200).json({ drawing });
}
