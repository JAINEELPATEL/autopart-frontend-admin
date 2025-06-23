"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MarketplaceActivity {
  enquiriesByMonth: Array<{ month: string; count: string }>;
  quotationsByMonth: Array<{ month: string; count: string }>;
  ticketsByMonth: Array<{ month: string; count: string }>;
}

interface DashboardChartProps {
  marketplaceActivity?: MarketplaceActivity;
}

// Month names mapping
const monthNames = {
  "1": "Jan",
  "2": "Feb",
  "3": "Mar",
  "4": "Apr",
  "5": "May",
  "6": "Jun",
  "7": "Jul",
  "8": "Aug",
  "9": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

export function DashboardChart({ marketplaceActivity }: DashboardChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Process API data when marketplaceActivity changes
  useEffect(() => {
    if (marketplaceActivity) {
      const processedData = processMarketplaceData(marketplaceActivity);
      setChartData(processedData);
    }
  }, [marketplaceActivity]);

  const processMarketplaceData = (activity: MarketplaceActivity) => {
    // Create a map to store all months and their data
    const monthData: {
      [key: string]: {
        name: string;
        enquiries: number;
        quotations: number;
        tickets: number;
      };
    } = {};

    // Initialize all months with 0 values
    for (let i = 1; i <= 12; i++) {
      const monthKey = i.toString();
      monthData[monthKey] = {
        name: monthNames[monthKey as keyof typeof monthNames] || monthKey,
        enquiries: 0,
        quotations: 0,
        tickets: 0,
      };
    }

    // Process enquiries data
    activity.enquiriesByMonth.forEach((item) => {
      if (monthData[item.month]) {
        monthData[item.month].enquiries = parseInt(item.count) || 0;
      }
    });

    // Process quotations data
    activity.quotationsByMonth.forEach((item) => {
      if (monthData[item.month]) {
        monthData[item.month].quotations = parseInt(item.count) || 0;
      }
    });

    // Process tickets data
    activity.ticketsByMonth.forEach((item) => {
      if (monthData[item.month]) {
        monthData[item.month].tickets = parseInt(item.count) || 0;
      }
    });

    // Convert to array and filter out months with no data (optional)
    const result = Object.values(monthData).filter(
      (month) =>
        month.enquiries > 0 || month.quotations > 0 || month.tickets > 0
    );

    // If no data, return last 6 months with 0 values
    if (result.length === 0) {
      const currentMonth = new Date().getMonth() + 1;
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const month = (currentMonth - i + 12) % 12 || 12;
        last6Months.push({
          name:
            monthNames[month.toString() as keyof typeof monthNames] ||
            month.toString(),
          enquiries: 0,
          quotations: 0,
          tickets: 0,
        });
      }
      return last6Months;
    }

    return result;
  };

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";
  const textColor = isDark ? "#e2e8f0" : "#475569";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

  // If no data is available, show a message
  if (!marketplaceActivity || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-muted-foreground text-sm">
            No marketplace activity data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={gridColor}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={textColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            borderRadius: "0.5rem",
            color: textColor,
          }}
          formatter={(value: any, name: string) => [
            value,
            name.charAt(0).toUpperCase() + name.slice(1),
          ]}
        />
        <Legend />
        <Bar
          dataKey="enquiries"
          name="Enquiries"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="quotations"
          name="Quotations"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="tickets"
          name="Tickets"
          fill="#f97316"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
