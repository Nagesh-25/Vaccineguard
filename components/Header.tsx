"use client";

import Link from "next/link";
import { Thermometer } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`glass sticky top-0 z-50 border-b transition-all duration-300 animate-slideDown ${scrolled
                    ? "border-purple-200/50 shadow-lg"
                    : "border-transparent"
                }`}
            style={{
                borderImage: scrolled
                    ? "linear-gradient(90deg, hsl(220, 90%, 56%), hsl(260, 90%, 60%)) 1"
                    : "none"
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-3">
                        <div className="gradient-primary p-2.5 rounded-xl text-white shadow-lg animate-float">
                            <Thermometer size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                VaccineGuard
                            </h1>
                            <p className="text-xs text-gray-500 hidden sm:block">Cold Storage Monitor</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select className="glass-hover block rounded-xl border border-gray-200/50 py-2 pl-3 pr-10 text-sm font-medium text-gray-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer hover:shadow-md">
                            <option>Main Storage - Unit A</option>
                            <option>Backup Unit B</option>
                            <option>Emergency Unit C</option>
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
}
