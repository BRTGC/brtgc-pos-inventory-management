import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma'; // Adjust relative path if needed
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    const { name, username, email, password, role } = await request.json();

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { name, username, email, password: hashedPassword, role },
    });

    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
}
