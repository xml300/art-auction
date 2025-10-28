export default function ThemeSettings() {
    return (
        <div className="p-12 w-full">
            <div>
                <h1 className="dark:text-white">Theme</h1>
                <select name="theme_select" id="theme_select" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-6 py-2 rounded-lg">
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                </select>
            </div>
            <button type="submit" className="bg-black text-white rounded-lg px-6 py-2 mt-8">Save Changes</button>
        </div>
    );
}
