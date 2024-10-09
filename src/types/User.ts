export interface User {
    id: string;
    name?: string; // Made optional if not always provided
    email?: string; // Made optional if not always provided
    username?: string; // Make this optional
    role: string;
}

export type PublicUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    createdAt: Date;
};