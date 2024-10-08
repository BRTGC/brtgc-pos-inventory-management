export interface User {
    id: string;
    name?: string; // Made optional if not always provided
    email?: string; // Made optional if not always provided
    username?: string; // Make this optional
    role: string;
  }