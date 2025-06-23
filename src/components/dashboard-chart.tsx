"use client"

import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    enquiries: 65,
    quotations: 48,
    tickets: 12,
  },
  {
    name: "Feb",
    enquiries: 59,
    quotations: 38,
    tickets: 10,
  },
  {
    name: "Mar",
    enquiries: 80,
    quotations: 55,
    tickets: 15,
  },
  {
    name: "Apr",
    enquiries: 81,
    quotations: 56,
    tickets: 17,
  },
  {
    name: "May",
    enquiries: 56,
    quotations: 39,
    tickets: 11,
  },
  {
    name: "Jun",
    enquiries: 55,
    quotations: 28,
    tickets: 9,
  },
  {
    name: "Jul",
    enquiries: 40,
    quotations: 32,
    tickets: 7,
  },
]

export function DashboardChart() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"
  const textColor = isDark ? "#e2e8f0" : "#475569"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            borderRadius: "0.5rem",
            color: textColor,
          }}
        />
        <Legend />
        <Bar dataKey="enquiries" name="Enquiries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="quotations" name="Quotations" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="tickets" name="Tickets" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
