export default function PasswordSettings() {
    return (
        <div className="p-12 w-full">
            <div className="flex flex-col mb-4">
                <label htmlFor="current_password" className="dark:text-white">Current Password</label>
                <input type="password" id="current_password" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Confirm your current password" />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="new_password" className="dark:text-white">New Password</label>
                <input type="password" id="new_password" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Enter your new password" />
            </div>
            <div className="flex flex-col mb-4">
                <label htmlFor="confirm_new_password" className="dark:text-white">Confirm New Password</label>
                <input type="password" id="confirm_new_password" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-2 rounded-lg w-full" placeholder="Confirm your new password" />
            </div>
            <button type="submit" className="bg-black text-white rounded-lg px-6 py-2 mt-4">Save Changes</button>
        </div>
    );
}
