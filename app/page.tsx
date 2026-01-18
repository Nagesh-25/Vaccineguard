"use client";

import { Header } from "@/components/Header";
import { StatusCard } from "@/components/StatusCard";
import { TempChart } from "@/components/TempChart";
import { HistoryLog } from "@/components/HistoryLog";
import { AlertManager } from "@/components/AlertManager";
import { useTemperature } from "@/hooks/useTemperature";

export default function Home() {
  const { current, history, loading } = useTemperature();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      <Header />

      {/* Background alert monitoring - sends Telegram when temp is out of range */}
      <AlertManager
        temperature={Number(current?.temperature ?? 0)}
        humidity={Number(current?.humidity ?? 0)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Status & History */}
          <div className="lg:col-span-1 space-y-6 lg:space-y-8">
            <section className="animate-slideUp" style={{ animationDelay: '100ms' }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
              <StatusCard
                temperature={Number(current?.temperature ?? 0)}
                humidity={Number(current?.humidity ?? 0)}
                lastUpdate={current?.timestamp ?? 0}
                loading={loading}
              />
            </section>

            <section className="hidden lg:block animate-slideUp" style={{ animationDelay: '300ms' }}>
              <HistoryLog history={history} />
            </section>
          </div>

          {/* Right Column: Chart */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <section className="animate-slideUp" style={{ animationDelay: '200ms' }}>
              <TempChart data={history} />
            </section>

            {/* Mobile only history */}
            <section className="lg:hidden animate-slideUp" style={{ animationDelay: '300ms' }}>
              <HistoryLog history={history} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
