"use client";

import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, limitToLast, query } from 'firebase/database';

export interface TempDataPoint {
    timestamp: number;
    temperature: number;
    humidity: number;
}

export function useTemperature() {
    const [current, setCurrent] = useState<TempDataPoint | null>(null);
    const [history, setHistory] = useState<TempDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to current status
        const statusRef = ref(database, 'current_status');
        const unsubscribeStatus = onValue(statusRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                setCurrent({
                    timestamp: val.last_update,
                    temperature: val.temperature,
                    humidity: val.humidity
                });
            }
            setLoading(false);
        });

        // Listen to logs (last 50 for chart)
        const logsRef = query(ref(database, 'logs'), limitToLast(50));
        const unsubscribeLogs = onValue(logsRef, (snapshot) => {
            const val = snapshot.val();
            if (val) {
                // Convert object to array
                const list = Object.values(val) as TempDataPoint[];
                // Sort by timestamp if needed (Firebase keys usually ordered by time insertion if push() used)
                // push() keys are time-ordered.
                setHistory(list);
            } else {
                setHistory([]);
            }
        });

        return () => {
            unsubscribeStatus();
            unsubscribeLogs();
        };
    }, []);

    return { current, history, loading };
}
