// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from '@prisma/client';
let prisma;

export default async function handler(req, res) {
  prisma = new PrismaClient();

  // Create a user
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'cwoodlief6@gmail.com',
  //     name: 'Chris Woodlief',
  //     id: '1'
  //   },
  // });

  //get a user
  const userById = await prisma.user.findUnique({
    where: {
      id: '1'
    }
  });
  res.status(200).json({ response: userById });
}
