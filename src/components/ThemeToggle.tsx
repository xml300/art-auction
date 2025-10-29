'use client';
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeToggle({ className, switchToggle }: { className?: string, switchToggle?: boolean }) {
    const [theme, setTheme] = useState(false);

    useEffect(() => {

        if (typeof window !== 'undefined') {
            setTheme(localStorage.getItem('theme') === 'dark');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (theme == false) {
                document.body.parentElement?.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.parentElement?.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }
    }, [theme]);

    return (switchToggle ? (
        <div className="bg-gray-600 w-12 h-6 rounded-full overflow-hidden">
            <label htmlFor="check" className="relative flex w-full h-full">
                <input type="checkbox" name="check" id="check" className="peer sr-only" checked={theme} onChange={() => setTheme((oldTheme) => !oldTheme)} />
                <div className="bg-green-600 w-full h-full rounded-full transition-transform -translate-x-8 peer-checked:translate-x-0"></div>
                <div className="bg-white rounded-full w-6 h-6 z-10 absolute left-0 transition-transform peer-checked:translate-x-6"></div>
            </label>
        </div>
    ) : (
        <button onClick={() => setTheme((oldTheme) => !oldTheme)}>
            {theme ? <Sun className={className} /> : <Moon className={className} />}
        </button>
    ));
}

export function SwitchThemeToggle() {
    const [theme, setTheme] = useState(false);

    useEffect(() => {

        if (typeof window !== 'undefined') {
            setTheme(localStorage.getItem('theme') === 'dark');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (theme == false) {
                document.body.parentElement?.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.parentElement?.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }
    }, [theme]);

    return (
        <div className="bg-gray-600 w-12 h-6 rounded-full overflow-hidden">
            <label htmlFor="check" className="relative flex w-full h-full">
                <input type="checkbox" name="check" id="check" className="peer sr-only" checked={theme} onChange={() => setTheme((oldTheme) => !oldTheme)} />
                <div className="bg-green-600 w-full h-full rounded-full transition-transform -translate-x-8 peer-checked:translate-x-0"></div>
                <div className="bg-white rounded-full w-6 h-6 z-10 absolute left-0 transition-transform peer-checked:translate-x-6"></div>
            </label>
        </div>
    );
}
