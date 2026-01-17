"use client";

import { useEffect, useRef } from 'react';

interface AlertManagerProps {
    temperature: number;
    humidity: number;
}

export function AlertManager({ temperature, humidity }: AlertManagerProps) {
    const lastAlertTime = useRef<number>(0);
    const ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutes in milliseconds

    useEffect(() => {
        const checkAndAlert = async () => {
            // Check if temperature is out of range
            const isAlert = temperature < 2 || temperature > 8;

            if (!isAlert) {
                return;
            }

            // Check cooldown to prevent spam
            const now = Date.now();
            if (now - lastAlertTime.current < ALERT_COOLDOWN) {
                console.log('Alert cooldown active, skipping...');
                return;
            }

            // Send alert via API
            try {
                const response = await fetch('/api/telegram-alert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ temperature, humidity }),
                });

                const data = await response.json();

                if (data.success) {
                    console.log('Telegram alert sent successfully');
                    lastAlertTime.current = now;
                } else {
                    console.error('Failed to send alert:', data.error);
                }
            } catch (error) {
                console.error('Error sending alert:', error);
            }
        };

        // Only check if we have valid temperature data
        if (temperature !== 0) {
            checkAndAlert();
        }
    }, [temperature, humidity]);

    // This component doesn't render anything
    return null;
}
