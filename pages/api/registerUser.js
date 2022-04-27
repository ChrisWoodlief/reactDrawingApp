// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient, Prisma } from '@prisma/client';
import { getSession } from "next-auth/react"

export default async function handler(req, res) {
  const session = await getSession({ req })
  const prisma = new PrismaClient();

  if(!req.body.name || !req.body.email || !req.body.password){
    return res.status(400).json({errorMessage: 'Name, email and password are required'});
  }

  try {
    // Create a user
    await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') { //Unique constraint failed
        return res.status(400).json({errorMessage: 'A user with this email already exists'});
      }
    }
    throw e
  }

  return res.status(200).json({ success: true });
}
