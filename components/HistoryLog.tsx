import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HistoryLogProps {
    history: Array<{
        timestamp: number;
        temperature: number;
    }>;
}

export function HistoryLog({ history }: HistoryLogProps) {
    // Sort history by time descending (newest first)
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

    // Calculate time ago
    const getTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    // Get temperature trend
    const getTrend = (index: number) => {
        if (index >= sortedHistory.length - 1) return 'stable';
        const current = sortedHistory[index].temperature;
        const previous = sortedHistory[index + 1].temperature;
        const diff = current - previous;
        if (Math.abs(diff) < 0.3) return 'stable';
        return diff > 0 ? 'up' : 'down';
    };

    return (
        <div className="glass-hover rounded-2xl border border-white/50 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500 mt-1">Latest temperature readings</p>
            </div>

            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                {sortedHistory.slice(0, 10).map((log, idx) => {
                    const temp = Number(log.temperature);
                    const isSafe = temp >= 2 && temp <= 8;
                    const trend = getTrend(idx);

                    let statusColor = "border-l-emerald-500 bg-emerald-50/30";
                    let iconColor = "text-emerald-600";
                    let textColor = "text-emerald-700";

                    if (!isSafe) {
                        if (temp < 2) {
                            statusColor = "border-l-blue-500 bg-blue-50/30";
                            iconColor = "text-blue-600";
                            textColor = "text-blue-700";
                        } else {
                            statusColor = "border-l-red-500 bg-red-50/30";
                            iconColor = "text-red-600";
                            textColor = "text-red-700";
                        }
                    }

                    return (
                        <div
                            key={idx}
                            className={`glass-hover p-4 rounded-xl border-l-4 ${statusColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}
                            style={{
                                animationDelay: `${idx * 50}ms`,
                                animation: 'slideUp 0.4s ease-out forwards'
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`p-2 rounded-lg ${isSafe ? 'bg-emerald-100' : temp < 2 ? 'bg-blue-100' : 'bg-red-100'}`}>
                                        {isSafe ? (
                                            <CheckCircle size={18} className={iconColor} />
                                        ) : (
                                            <AlertTriangle size={18} className={iconColor} />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-gray-900">
                                                {temp.toFixed(1)}°C
                                            </span>
                                            {trend === 'up' && <TrendingUp size={16} className="text-red-500" />}
                                            {trend === 'down' && <TrendingDown size={16} className="text-blue-500" />}
                                            {trend === 'stable' && <Minus size={16} className="text-gray-400" />}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {getTimeAgo(log.timestamp)}
                                        </p>
                                    </div>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${textColor} ${isSafe ? 'bg-emerald-100' : temp < 2 ? 'bg-blue-100' : 'bg-red-100'}`}>
                                    {isSafe ? 'Safe' : temp < 2 ? 'Cold' : 'High'}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {sortedHistory.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <AlertTriangle size={24} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No data available yet</p>
                        <p className="text-sm text-gray-400 mt-1">Waiting for sensor readings...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
