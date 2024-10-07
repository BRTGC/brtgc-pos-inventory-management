// src/app/api/users/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, email, role } = await request.json();

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}
