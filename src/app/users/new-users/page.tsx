"use client";

import { signIn } from "next-auth/react";
import withLayout from "@/components/withLayout";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

// Define the structure of the form data
interface FormData {
    email: string; // Email of the user
    password: string; // Password of the user
    name: string; // Name of the user
    username: string; // Username of the user
    role: string; // Role of the user, defaulting to "USER"
}

const page = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const router = useRouter(); // Use Next.js router for navigation

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        // Automatically set role to "USER" on the client side
        const result = await signIn("credentials", {
            ...data,
            role: "USER", // Set role here
            redirect: false,
        });

        if (result?.error) {
            console.error(result.error);
            // Optionally handle error state here, e.g., show an alert
        } else {
            // Redirect to the login page on successful signup
            router.push("/auth/login"); // Use router for navigation
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Add New User</h2>

                {/* Name Field */}
                <div className="mb-4">
                    <input
                        {...register("name", { required: "Name is required" })}
                        placeholder="Name"
                        className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                </div>

                {/* Username Field */}
                <div className="mb-4">
                    <input
                        {...register("username", { required: "Username is required" })}
                        placeholder="Username"
                        className={`w-full p-2 border rounded ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <input
                        {...register("email", { required: "Email is required" })}
                        placeholder="Email"
                        className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                    <input
                        {...register("password", { required: "Password is required" })}
                        type="password"
                        placeholder="Password"
                        className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default withLayout(page)