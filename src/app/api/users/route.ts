import { NextResponse } from 'next/server';
import prisma from '../../../../prisma';
import { User } from '@prisma/client';

// Define the structure of the public user data
type PublicUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
};

// Define a common response structure
type ApiResponse<T> = {
    status: string;
    data: T | null;
    message?: string;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 20; // Number of users per page
    const skip = (page - 1) * limit;

    try {
        // Fetch users with the role of "USER" and apply pagination
        const users: User[] = await prisma.user.findMany({
            where: { role: 'USER' },
            skip: skip,
            take: limit,
        });

        // Map to PublicUser format (excluding sensitive fields like password)
        const publicUsers: PublicUser[] = users.map(user => ({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        // If no users found, return an empty array
        if (publicUsers.length === 0) {
            return NextResponse.json<ApiResponse<PublicUser[]>>({
                status: 'success',
                data: [],
                message: 'No users found',
            });
        }

        // Get the total count of users for pagination
        const totalUsers = await prisma.user.count({
            where: { role: 'USER' },
        });

        const totalPages = Math.ceil(totalUsers / limit);

        // Return the list of public users along with pagination info
        return NextResponse.json<ApiResponse<{ users: PublicUser[]; totalPages: number }>>({
            status: 'success',
            data: { users: publicUsers, totalPages },
        });

    } catch (error) {
        // Handle any errors and return a failure response
        return NextResponse.json<ApiResponse<null>>({
            status: 'error',
            data: null,
            message: 'An error occurred while fetching users',
        });
    }
}
