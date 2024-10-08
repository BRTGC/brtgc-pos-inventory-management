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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full border border-gray-300 rounded p-2"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full border border-gray-300 rounded p-2"
            />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded ${isSigningIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
