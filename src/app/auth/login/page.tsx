// src/app/auth/signin/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

const SignInPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSigningIn(true);
    const response = await signIn("credentials", {
      ...data,
      redirect: false, // Prevent automatic redirection
    });

    setIsSigningIn(false);

    if (response?.error) {
      // Handle error (e.g., show an alert)
      alert(response.error);
    } else {
      // Redirect to the dashboard on successful login
      window.location.href = "/dashboard"; // Adjust the path as needed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Sign In</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-3 bg-indigo-600 text-white rounded-md font-semibold shadow-md hover:bg-indigo-700 transition-all focus:ring-2 focus:ring-indigo-500 ${isSigningIn ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={isSigningIn}
        >
          {isSigningIn ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>

  );
};

export default SignInPage;
