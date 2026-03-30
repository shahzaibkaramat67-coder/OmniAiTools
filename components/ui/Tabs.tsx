"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}

export function Tabs({ tabs, defaultTab, children, className }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.key);

  return (
    <div className={className}>
      <div className="flex items-center gap-1 border-b border-surface-border mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px",
              active === tab.key
                ? "border-brand-500 text-white"
                : "border-transparent text-slate-400 hover:text-white hover:border-white/20"
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      {children(active)}
    </div>
  );
}
