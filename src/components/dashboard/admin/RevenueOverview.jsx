
"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

const revenueData = {
  Weekly: [
    { label: "Mon", revenue: 8500 },
    { label: "Tue", revenue: 12000 },
    { label: "Wed", revenue: 9500 },
    { label: "Thu", revenue: 15000 },
    { label: "Fri", revenue: 11000 },
    { label: "Sat", revenue: 18000 },
    { label: "Sun", revenue: 14500 },
  ],
  Monthly: [
    { label: "Jan", revenue: 42000 },
    { label: "Feb", revenue: 55000 },
    { label: "Mar", revenue: 48000 },
    { label: "Apr", revenue: 68000 },
    { label: "May", revenue: 60000 },
    { label: "Jun", revenue: 82000 },
    { label: "Jul", revenue: 75000 },
    { label: "Aug", revenue: 95000 },
    { label: "Sep", revenue: 88000 },
    { label: "Oct", revenue: 110000 },
    { label: "Nov", revenue: 98000 },
    { label: "Dec", revenue: 125000 },
  ],
  Yearly: [
    { label: "2022", revenue: 450000 },
    { label: "2023", revenue: 620000 },
    { label: "2024", revenue: 780000 },
    { label: "2025", revenue: 950000 },
    { label: "2026", revenue: 1250000 },
  ],
};

const formatCurrency = (value) => {
  return `৳${value.toLocaleString("en-IN")}`;
};

export default function RevenueOverview() {
  const [period, setPeriod] = useState("Monthly");

  const data = revenueData[period];

  const totalRevenue = useMemo(
    () => data.reduce((sum, item) => sum + item.revenue, 0),
    [data]
  );

  const maxRevenue = Math.max(...data.map((item) => item.revenue));
  const chartHeight = 180;

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1 || 1)) * 100;
      const y = chartHeight - (item.revenue / maxRevenue) * chartHeight;

      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${chartHeight} ${points} 100,${chartHeight}`;

  return (
    <section className="h-full rounded-2xl border border-[#EAE8D9] bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-[#292817]">
            Revenue Overview
          </h2>
          <p className="mt-1 text-sm text-[#999781]">
            Track your store revenue over time
          </p>
        </div>

        <div className="relative w-fit">
          <CalendarDays
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#77754E]"
          />

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none rounded-xl border border-[#EAE8D9] bg-[#FFFEF7] py-2.5 pl-9 pr-9 text-sm font-medium text-[#55532B] outline-none transition focus:border-[#55532B]"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>

          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#77754E]"
          />
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="mt-6">
        <div className="flex flex-wrap items-end gap-3">
          <h3 className="text-3xl font-bold tracking-tight text-[#292817] sm:text-4xl">
            {formatCurrency(totalRevenue)}
          </h3>

          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
            <TrendingUp size={13} />
            Revenue
          </span>
        </div>

        <p className="mt-2 text-xs text-[#999781]">
          Total revenue for the selected period
        </p>
      </div>

      {/* Chart */}
      <div className="mt-8 w-full">
        <div className="relative h-[220px] w-full">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="w-full border-t border-dashed border-[#EAE8D9]"
              />
            ))}
          </div>

          {/* SVG Chart */}
          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-[180px] w-full overflow-visible"
          >
            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#55532B"
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor="#55532B"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <polygon
              points={areaPoints}
              fill="url(#revenueGradient)"
            />

            <polyline
              points={points}
              fill="none"
              stroke="#55532B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            {data.map((item, index) => {
              const x = (index / (data.length - 1 || 1)) * 100;
              const y =
                chartHeight - (item.revenue / maxRevenue) * chartHeight;

              return (
                <circle
                  key={item.label}
                  cx={x}
                  cy={y}
                  r="1.4"
                  fill="#55532B"
                  stroke="white"
                  strokeWidth="0.6"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
        </div>

        {/* X Axis Labels */}
        <div
          className="mt-3 grid gap-1 text-center"
          style={{
            gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
          }}
        >
          {data.map((item) => (
            <span
              key={item.label}
              className="text-[10px] font-medium text-[#999781] sm:text-xs"
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-[#F0EEE3] pt-4">
        <p className="text-xs text-[#999781]">
          Revenue performance
        </p>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#55532B]" />
          <span className="text-xs font-medium text-[#77754E]">
            Revenue
          </span>
        </div>
      </div>
    </section>
  );
}
