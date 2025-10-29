"use client";
import { useState } from "react";

export default function PasswordForm({errors}:{errors: string}) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState<string|null>(errors);


    const handleSubmit = async (e: React.FormEvent) => {
        if (newPassword !== confirmNewPassword) {
            setError("New password and confirm new password do not match.");
            e.preventDefault();
            return;
        }
    };

 
    return (
        <form method="POST" action="/api/profile/password" onSubmit={handleSubmit} className="p-12 w-full">
            {error && (<div className={`bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-8 transition-transform animate-fade-in`} role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>)}
            <div className="flex flex-col mb-4">
                <label htmlFor="current_password" className="dark:text-white">Current Password</label>
                <input type="password" id="current_password" name="current_password" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Confirm your current password" required />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="new_password" className="dark:text-white">New Password</label>
                <input type="password" id="new_password" name="new_password" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="confirm_new_password" className="dark:text-white">Confirm New Password</label>
                <input type="password" id="confirm_new_password" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Confirm your new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
            </div>
            <button type="submit" className="bg-black text-white rounded-lg px-6 py-2 mt-4">Save Changes</button>
        </form>
    );
}
