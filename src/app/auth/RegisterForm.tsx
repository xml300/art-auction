"use client";

import { useError } from "@/hooks/useErrors";
import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [accountType, setAccountType] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const {error} = useError();

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
        <form className="text-base mt-4 space-y-4" action="/api/auth/register" method="post">
            <div className="text-center">
                <h3 className="text-xl font-bold mb-1">Create Account</h3>
                <p className="text-text opacity-70">Join our art community today</p>
            </div>

            {error && (
                <div className="bg-secondary bg-opacity-20 border border-secondary text-text px-4 py-3 rounded relative" role="alert">
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
                        className="w-full text-base rounded-lg p-3 border-2 border-secondary shadow-sm bg-background text-text focus:border-primary transition-all duration-200"
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
                        className="w-full text-base rounded-lg p-3 border-2 border-secondary shadow-sm bg-background text-text focus:border-primary transition-all duration-200"
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
                        className="w-full text-base rounded-lg p-3 border-2 border-secondary shadow-sm bg-background text-text focus:border-primary transition-all duration-200"
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
                            className="w-full text-base rounded-lg p-3 pr-10 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
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
                            className="w-full text-base rounded-lg p-3 pr-10 border-2 border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 text-black dark:text-white focus:border-red-500 dark:focus:border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all duration-200"
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
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isFormValid
                            ? "bg-primary text-white transform hover:scale-105"
                            : "bg-secondary bg-opacity-50 text-text opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!isFormValid}
                >
                    Create Account
                </button>
            </div>
        </form>
    );
}
