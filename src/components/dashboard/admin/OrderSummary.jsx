
"use client";

import { useMemo, useState } from "react";
import { ShoppingBag, ChevronDown } from "lucide-react";

const orderData = {
  Weekly: [
    { label: "Completed", value: 85, color: "#55532B" },
    { label: "Processing", value: 24, color: "#D6B65D" },
    { label: "Pending", value: 15, color: "#7B9B8A" },
    { label: "Cancelled", value: 8, color: "#D98B80" },
  ],
  Monthly: [
    { label: "Completed", value: 156, color: "#55532B" },
    { label: "Processing", value: 52, color: "#D6B65D" },
    { label: "Pending", value: 28, color: "#7B9B8A" },
    { label: "Cancelled", value: 20, color: "#D98B80" },
  ],
  Yearly: [
    { label: "Completed", value: 1850, color: "#55532B" },
    { label: "Processing", value: 420, color: "#D6B65D" },
    { label: "Pending", value: 230, color: "#7B9B8A" },
    { label: "Cancelled", value: 150, color: "#D98B80" },
  ],
};

export default function OrderSummary() {
  const [period, setPeriod] = useState("Monthly");

  const data = orderData[period];

  const totalOrders = useMemo(
    () => data.reduce((total, item) => total + item.value, 0),
    [data]
  );

  const completedOrders = data[0].value;
  const completionRate = Math.round(
    (completedOrders / totalOrders) * 100
  );

  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  const segments = data.map((item) => {
    const percentage = (item.value / totalOrders) * 100;
    const dashLength = (percentage / 100) * circumference;

    const segment = {
      ...item,
      dashLength,
      offset,
    };

    offset += dashLength;

    return segment;
  });

  return (
    <section className="h-full rounded-2xl border border-[#EAE8D9] bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#292817]">
            Order Summary
          </h2>
          <p className="mt-1 text-sm text-[#999781]">
            Overview of your orders
          </p>
        </div>

        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="cursor-pointer appearance-none rounded-lg border border-[#EAE8D9] bg-[#FFFEF7] py-2 pl-3 pr-8 text-xs font-medium text-[#55532B] outline-none focus:border-[#55532B]"
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>

          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#77754E]"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col items-center justify-center py-7">
        <div className="relative h-[190px] w-[190px]">
          <svg
            viewBox="0 0 180 180"
            className="h-full w-full -rotate-90"
          >
            {/* Background Circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#F1F0E7"
              strokeWidth="17"
            />

            {/* Progress Segments */}
            {segments.map((segment) => (
              <circle
                key={segment.label}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="17"
                strokeDasharray={`${segment.dashLength} ${
                  circumference - segment.dashLength
                }`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="butt"
              />
            ))}
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDEEDC] text-[#55532B]">
              <ShoppingBag size={18} />
            </div>

            <h3 className="text-3xl font-bold text-[#292817]">
              {totalOrders.toLocaleString("en-IN")}
            </h3>

            <p className="mt-1 text-xs text-[#999781]">
              Total Orders
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-full bg-[#EDEEDC] px-3 py-1.5 text-xs font-semibold text-[#55532B]">
          {completionRate}% Completed
        </div>
      </div>

      {/* Order Status List */}
      <div className="space-y-4 border-t border-[#F0EEE3] pt-5">
        {data.map((item) => {
          const percentage = Math.round(
            (item.value / totalOrders) * 100
          );

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-[#77754E]">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#292817]">
                    {item.value.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[#999781]">
                    ({percentage}%)
                  </span>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#F1F0E7]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
