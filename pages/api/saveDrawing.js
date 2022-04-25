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

  const strokes = req.body.strokes.map((currentStroke) => {
    return {
      drawingId: drawing.id,
      lineData: currentStroke.lineData
    }
  });

  //array with {drawingId, lineData (as a string), strokeColor, strokeWidth}
  const createMany = await prisma.stroke.createMany({
    data: strokes
  })

  return res.status(200).json({ drawing });
}
