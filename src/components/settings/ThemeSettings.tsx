'use client';
import { useState, useEffect } from "react";

export default function ThemeSettings() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        }
    }, [theme]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value);
    };

    return (
        <div className="p-12 w-full">
            <div>
                <h1 className="dark:text-white">Theme</h1>
                <select name="theme_select" id="theme_select" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-6 py-2 rounded-lg" value={theme} onChange={handleChange}>
                    <option value="light">Light Theme</option>
                    <option value="dark">Dark Theme</option>
                </select>
            </div>
        </div>
    );
}
