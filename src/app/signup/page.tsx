"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, username, email, password, role }),
        });

        if (res.ok) {
            router.push("/login");
        } else {
            const data = await res.json();
            setError(data.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-md backdrop-filter backdrop-blur-md bg-opacity-70">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h1>

                {error && (
                    <p className="text-red-500 text-center bg-red-100 p-2 rounded-md mb-4">{error}</p>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-600 text-gray-900 shadow-sm"
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-600 text-gray-900 shadow-sm"
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-600 text-gray-900 shadow-sm"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-600 text-gray-900 shadow-sm"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
                            Role
                        </label>
                        <select
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 shadow-sm"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <button
                        className="w-full py-3 bg-gray-700 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-all focus:ring-2 focus:ring-gray-500"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-500 hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
