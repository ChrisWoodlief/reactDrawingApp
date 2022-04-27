// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient, Prisma } from '@prisma/client';
import { getSession } from "next-auth/react"
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const session = await getSession({ req })
  const prisma = new PrismaClient();

  if(!req.body.name || !req.body.email || !req.body.password){
    return res.status(400).json({errorMessage: 'Name, email and password are required'});
  }

  //hash password from user
  const salt = bcrypt.genSaltSync(5); //5 salt rounds
  const hash = bcrypt.hashSync(req.body.password, salt);

  try {
    // Create a user
    await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: hash
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
