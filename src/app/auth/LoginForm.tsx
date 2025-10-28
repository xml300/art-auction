"use client"; 
import Link from "next/link";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useState } from "react";

export default function LoginForm({ error }: { error?: string }){
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="text-lg mt-4 space-y-4" action="/api/auth/login" method="post">
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-1">Welcome Back</h3>
                <p className=" text-gray-600 dark:text-gray-400">Sign in to your account</p>
            </div>

            {error && (
                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <div className="space-y-6">
                <div className="space-y-1">
                    <label htmlFor="username" className=" font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        autoComplete="username"
                        className="w-full text-lg rounded-lg p-3 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className=" font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full text-lg rounded-lg p-3 pr-10 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between !mt-2">
                    <label className="flex items-center">
                        <input type="checkbox" name="remember" className="mr-2 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                        <span className="">Remember me</span>
                    </label>
                    <Link href="/auth/forgot-password" className=" text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                        Forgot password?
                    </Link>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Sign In
                </button>
            </div>

            <div className="text-center pt-2">
                <p className=" text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">
                        Sign up
                    </Link>
                </p>
            </div>
        </form>
    );
}
