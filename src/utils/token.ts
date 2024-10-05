// src/utils/token.ts

import jwt from "jsonwebtoken";

export const generateToken = (user: any) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET must be defined in the environment variables");
    }

    // Include user role in the token payload
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
        expiresIn: "1h",
    });
};
