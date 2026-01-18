"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface StatusCardProps {
    temperature: number;
    humidity: number;
    lastUpdate: number;
    loading?: boolean;
}

export function StatusCard({ temperature, humidity, lastUpdate, loading }: StatusCardProps) {
    const [displayTemp, setDisplayTemp] = useState(0);

    // Animated counter effect
    useEffect(() => {
        if (loading) return;

        const duration = 800;
        const steps = 30;
        const increment = temperature / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += 1;
            setDisplayTemp(Math.min(current * increment, temperature));

            if (current >= steps) {
                clearInterval(timer);
                setDisplayTemp(temperature);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [temperature, loading]);

    // Safe range: 2-8°C
    const isSafe = temperature >= 2 && temperature <= 8;
    const isLow = temperature < 2;
    const isHigh = temperature > 8;

    let statusColor = "text-emerald-600";
    let statusBg = "bg-emerald-50 border-emerald-200";
    let statusText = "Safe";
    let cardGradient = "gradient-success";
    let glowEffect = "";

    if (isLow) {
        statusColor = "text-blue-600";
        statusBg = "bg-blue-50 border-blue-200";
        statusText = "Too Cold";
        cardGradient = "bg-gradient-to-br from-blue-500 to-cyan-500";
        glowEffect = "animate-pulse-glow";
    } else if (isHigh) {
        statusColor = "text-red-600";
        statusBg = "bg-red-50 border-red-200";
        statusText = "Critical High";
        cardGradient = "gradient-danger";
        glowEffect = "animate-pulse-glow";
    }

    // Format timestamp
    const timeString = lastUpdate > 0 ? new Date(lastUpdate).toLocaleTimeString() : "Syncing...";

    if (loading) {
        return (
            <div className="glass overflow-hidden rounded-2xl border border-gray-200/50 shadow-xl p-6">
                <div className="animate-shimmer h-4 rounded w-1/3 mb-4"></div>
                <div className="animate-shimmer h-12 rounded w-2/3 mb-2"></div>
                <div className="animate-shimmer h-4 rounded w-1/2"></div>
            </div>
        );
    }

    return (
        <div
            className={`glass-hover overflow-hidden rounded-2xl border border-white/50 shadow-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${glowEffect}`}
        >
            {/* Gradient Background Overlay */}
            <div className={`absolute inset-0 ${cardGradient} opacity-5`}></div>

            <div className="relative">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-2">Current Temperature</p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-6xl sm:text-7xl font-extrabold tracking-tight ${isSafe ? "text-gray-900" : isLow ? "text-blue-700" : "text-red-700"
                                } transition-colors duration-300`}>
                                {displayTemp.toFixed(1)}
                            </span>
                            <span className="text-3xl font-semibold text-gray-400">°C</span>
                        </div>
                    </div>

                    <div className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${statusBg} ${statusColor} shadow-md animate-slideDown`}>
                        {statusText}
                    </div>
                </div>

                {/* Safe Range Indicator */}
                <div className="mb-6 p-3 rounded-xl bg-gray-50/80 border border-gray-200/50">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span className="font-medium">Safe Range</span>
                        <span className="font-semibold">2°C - 8°C</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-[13.33%] right-[46.67%] gradient-success opacity-30"></div>
                        <div
                            className={`absolute top-0 bottom-0 w-1 ${isSafe ? "bg-emerald-500" : isLow ? "bg-blue-500" : "bg-red-500"
                                } transition-all duration-500 shadow-lg`}
                            style={{
                                left: `${Math.min(Math.max((temperature / 15) * 100, 0), 100)}%`,
                                transform: 'translateX(-50%)'
                            }}
                        ></div>
                    </div>
                </div>

                {/* Last Update */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50/50 border border-purple-100/50">
                    <Clock size={20} className="text-purple-500" />
                    <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-semibold text-gray-900">{timeString}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
