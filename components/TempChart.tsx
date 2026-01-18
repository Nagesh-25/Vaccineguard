"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ReferenceLine, AreaChart } from 'recharts';

interface TempDataPoint {
    timestamp: number;
    temperature: number;
    humidity: number;
}

interface TempChartProps {
    data: TempDataPoint[];
}

export function TempChart({ data }: TempChartProps) {
    const formattedData = data.map(d => ({
        ...d,
        time: new Date(d.timestamp).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
        }),
    }));

    // Calculate dynamic Y-axis domain
    const temperatures = data.map(d => d.temperature);
    const minTemp = temperatures.length > 0 ? Math.min(...temperatures) : 0;
    const maxTemp = temperatures.length > 0 ? Math.max(...temperatures) : 15;

    // Add padding to the domain (10% on each side)
    const padding = (maxTemp - minTemp) * 0.1 || 2;
    const yMin = Math.max(0, Math.floor(minTemp - padding));
    const yMax = Math.ceil(maxTemp + padding);

    // Generate dynamic ticks
    const generateTicks = () => {
        const ticks = [0, 2, 8]; // Always show 0, 2 (safe min), and 8 (safe max)

        // Add intermediate ticks based on range
        const range = yMax - yMin;
        const step = range <= 15 ? 5 : range <= 30 ? 10 : 15;

        for (let i = step; i <= yMax; i += step) {
            if (!ticks.includes(i)) {
                ticks.push(i);
            }
        }

        // Ensure max value is included
        if (!ticks.includes(yMax) && yMax > 8) {
            ticks.push(yMax);
        }

        return ticks.sort((a, b) => a - b);
    };

    const yTicks = generateTicks();

    return (
        <div className="glass-hover rounded-2xl border border-white/50 shadow-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Temperature Trend</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Last 24 hours monitoring</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 text-xs flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-gray-600">Safe Zone (2-8°C)</span>
                    </div>
                    {maxTemp > 15 && (
                        <div className="px-2 py-1 rounded-md bg-orange-100 text-orange-700 font-semibold">
                            Max: {maxTemp.toFixed(1)}°C
                        </div>
                    )}
                </div>
            </div>

            <div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={formattedData}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(220, 90%, 56%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(260, 90%, 60%)" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="safeZone" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0.1} />
                                <stop offset="100%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                            opacity={0.5}
                        />

                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
                            dy={10}
                            interval="preserveStartEnd"
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
                            domain={[yMin, yMax]}
                            ticks={yTicks}
                            dx={-10}
                            label={{
                                value: 'Temperature (°C)',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fill: '#6B7280', fontSize: 12, fontWeight: 600 }
                            }}
                        />

                        {/* Safe zone visual indicator - only show if within range */}
                        {yMin <= 2 && yMax >= 2 && (
                            <ReferenceLine
                                y={2}
                                stroke="hsl(142, 76%, 46%)"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                opacity={0.6}
                                label={{
                                    value: '2°C',
                                    position: 'right',
                                    fill: 'hsl(142, 76%, 36%)',
                                    fontSize: 10,
                                    fontWeight: 600
                                }}
                            />
                        )}
                        {yMin <= 8 && yMax >= 8 && (
                            <ReferenceLine
                                y={8}
                                stroke="hsl(142, 76%, 46%)"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                opacity={0.6}
                                label={{
                                    value: '8°C',
                                    position: 'right',
                                    fill: 'hsl(142, 76%, 36%)',
                                    fontSize: 10,
                                    fontWeight: 600
                                }}
                            />
                        )}

                        <Tooltip
                            contentStyle={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(12px)',
                                borderRadius: '12px',
                                border: '1px solid rgba(0,0,0,0.1)',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                padding: '12px'
                            }}
                            itemStyle={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#1F2937'
                            }}
                            labelStyle={{
                                color: '#6B7280',
                                marginBottom: '6px',
                                fontWeight: 500,
                                fontSize: '12px'
                            }}
                            formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(1)}°C`, 'Temperature'] : ['N/A', 'Temperature']}
                        />

                        <Area
                            type="monotone"
                            dataKey="temperature"
                            stroke="hsl(220, 90%, 56%)"
                            strokeWidth={3}
                            fill="url(#colorTemp)"
                            dot={false}
                            activeDot={{
                                r: 6,
                                strokeWidth: 2,
                                stroke: '#fff',
                                fill: 'hsl(220, 90%, 56%)'
                            }}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Temperature range info */}
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <span>Min: <span className="font-semibold text-blue-600">{minTemp.toFixed(1)}°C</span></span>
                    <span>Max: <span className="font-semibold text-red-600">{maxTemp.toFixed(1)}°C</span></span>
                    <span>Avg: <span className="font-semibold text-gray-700">
                        {temperatures.length > 0
                            ? (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)
                            : '0.0'}°C
                    </span></span>
                </div>
                <span className="text-gray-400">{data.length} readings</span>
            </div>
        </div>
    );
}
