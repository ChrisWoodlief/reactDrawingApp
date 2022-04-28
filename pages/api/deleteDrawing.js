// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  const session = await getSession({ req })
  const prisma = new PrismaClient();

  //find the drawing to delete
  const drawing = await prisma.drawing.findUnique({
    where: {
      id: req.body.drawingId
    }
  });

  if(!drawing){
    return res.status(400).json({errorMessage: `Unable to find drawingId ${req.body.drawingId}`});
  }

  if(drawing.userId !== session.userId){
    return res.status(400).json({errorMessage: `Your user does not have permission delete drawing ${req.body.drawingId}`});
  }

  //delete the drawing
  await prisma.drawing.delete({
    where: {
      id: req.body.drawingId
    }
  });

  return res.status(200).json({success: true});
}
