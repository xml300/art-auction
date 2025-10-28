"use client";
import { useState, ReactNode } from "react";
import { User, CheckSquare, Send, Settings } from "lucide-react";

interface SettingsLayoutProps {
    children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { name: "Account", icon: User },
        { name: "Profile", icon: CheckSquare },
        { name: "Notifications", icon: Send },
        { name: "Appearance", icon: Settings },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 dark:text-white animate-fade-in">Settings</h1>

            <section className="flex flex-col lg:flex-row rounded-lg shadow-lg border border-gray-400 dark:border-gray-600 dark:bg-gray-800 animate-fade-in-delay-1">
                {/* Tabs */}
                <div className="border-b lg:border-b-0 lg:border-r-2 border-gray-400 dark:border-gray-600 p-4 lg:p-6">
                    <ul className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-8">
                        {tabs.map((tab, index) => (
                            <li
                                key={tab.name}
                                className={`border-b-4 lg:border-b-0 lg:border-r-4 ${activeTab === index ? 'border-red-800' : 'border-transparent'} p-2 hover:scale-105 transition-transform duration-200 cursor-pointer`}
                                onClick={() => setActiveTab(index)}
                            >
                                <tab.icon className="w-6 h-6" />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Content */}
                <div className="flex-1 animate-fade-in-delay-2">
                    {/* Render only the active tab's content */}
                    {children && (children as ReactNode[])[activeTab]}
                </div>
            </section>
        </div>
    );
}
