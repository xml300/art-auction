"use client";

import Link from "next/link";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function RegisterForm({ error }: { error?: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [accountType, setAccountType] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const validateForm = () => {
            const isValid =
                accountType !== "" &&
                username.trim() !== "" &&
                email.trim() !== "" &&
                password.trim() !== "" &&
                confirmPassword.trim() !== "" &&
                password === confirmPassword;
            setIsFormValid(isValid);
        };
        validateForm();
    }, [accountType, username, email, password, confirmPassword]);

    return (
        <form className="text-lg mt-4 space-y-4" action="/api/auth/register" method="post">
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-1">Create Account</h3>
                <p className=" text-gray-600 dark:text-gray-400">Join our art community today</p>
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
                        Account Type
                    </label>
                    <select
                        name="accountType"
                        id="accountType"
                        autoComplete="accountType"
                        className="w-full text-lg rounded-lg p-3 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
                        required
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                    >
                        <option value="">Select Account Type</option>
                        {/* <option value="1">Artist</option> */}
                        <option value="2">Collector</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label htmlFor="username" className=" font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Choose a unique username"
                        autoComplete="username"
                        className="w-full text-lg rounded-lg p-3 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="email" className=" font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email address"
                        autoComplete="email"
                        className="w-full text-lg rounded-lg p-3 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            className="w-full text-lg rounded-lg p-3 pr-10 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                <div className="space-y-1">
                    <label htmlFor="confirmPassword" className=" font-medium flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            className="w-full text-lg rounded-lg p-3 pr-10 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* <div className="flex items-center !mt-2">
                    <input type="checkbox" name="terms" id="terms" className="mt-1 mr-2 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" required />
                    <label htmlFor="terms" className="">
                        I agree to the{' '}
                        <Link href="/terms" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                            Privacy Policy
                        </Link>
                    </label>
                </div> */}
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isFormValid
                            ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transform hover:scale-105 focus:ring-red-500"
                            : "bg-gray-300  dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!isFormValid}
                >
                    Create Account
                </button>
            </div>

            <div className="text-center pt-2">
                <p className=" text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/auth" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    );
}
