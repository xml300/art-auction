"use client";

import { useState, ReactNode } from "react";
import { User, CheckSquare, Send, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: "Security & Password", icon: User },
    { name: "Public Profile", icon: CheckSquare },
    { name: "Notifications", icon: Send },
    { name: "Appearance", icon: Settings },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-left">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Account Settings</h1>
        <p className="text-xs text-text-muted mt-1">Configure your credentials, preferences, and notifications</p>
      </div>

      <section className="flex flex-col lg:flex-row rounded-2xl border border-border-subtle bg-surface shadow-xs overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="border-b lg:border-b-0 lg:border-r border-border-subtle p-3 sm:p-4 lg:w-56 bg-surface-elevated shrink-0">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <li key={tab.name} className="flex-1 lg:flex-initial">
                  <button
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap text-left",
                      isActive
                        ? "bg-primary text-white shadow-xs"
                        : "text-text-muted hover:text-text hover:bg-surface"
                    )}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span>{tab.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          {children && (children as ReactNode[])[activeTab]}
        </div>
      </section>
    </div>
  );
}
