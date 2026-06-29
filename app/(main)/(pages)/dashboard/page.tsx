"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import {
  Workflow,
  Activity,
  Zap,
  Link2,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react"

// Demo data — swap for real DB queries later
const stats = [
  {
    label: "Workflows",
    value: 8,
    suffix: "",
    change: "+2 this week",
    icon: Workflow,
  },
  {
    label: "Total Runs",
    value: 1204,
    suffix: "",
    change: "+18% this month",
    icon: Activity,
  },
  {
    label: "Credits",
    value: 100,
    suffix: "",
    change: "of 100 remaining",
    icon: Zap,
  },
  {
    label: "Connections",
    value: 4,
    suffix: "",
    change: "All active",
    icon: Link2,
  },
]

const runData = [
  { day: "Mon", runs: 32 },
  { day: "Tue", runs: 48 },
  { day: "Wed", runs: 41 },
  { day: "Thu", runs: 67 },
  { day: "Fri", runs: 55 },
  { day: "Sat", runs: 72 },
  { day: "Sun", runs: 60 },
]

const recentActivity = [
  { name: "Drive → Discord", detail: "Sent a notification", time: "2h ago" },
  { name: "New file → Notion", detail: "Created a page", time: "5h ago" },
  { name: "Drive → Slack", detail: "Posted to #general", time: "1d ago" },
  { name: "Drive → Discord", detail: "Sent a notification", time: "2d ago" },
]

const connections = [
  { name: "Google Drive", connected: true },
  { name: "Discord", connected: true },
  { name: "Slack", connected: true },
  { name: "Notion", connected: true },
]

// Count-up animation hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start: number | null = null
    let frame: number
    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.floor(eased * target))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])
  return count
}

const StatCard = ({
  stat,
  index,
}: {
  stat: (typeof stats)[number]
  index: number
}) => {
  const count = useCountUp(stat.value)
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5"
    >
      {/* glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:bg-primary/20" />
      <div className="relative flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{stat.label}</span>
        <div className="rounded-lg border border-border bg-background/40 p-2 transition-colors group-hover:border-primary/40">
          <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </div>
      <p className="relative mt-4 text-4xl font-bold tracking-tight">
        {count.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="relative mt-1 text-xs text-muted-foreground">
        {stat.change}
      </p>
    </motion.div>
  )
}

const DashboardPage = () => {
  return (
    <div className="relative flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        Dashboard
      </h1>

      <div className="flex flex-col gap-6 p-6">
        {/* Stat cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </section>

        {/* Chart + Connections */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Run trend chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-border bg-card p-5 lg:col-span-2"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Runs this week</h2>
                <p className="text-xs text-muted-foreground">
                  Workflow executions over the last 7 days
                </p>
              </div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                +18%
              </span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={runData}>
                  <defs>
                    <linearGradient
                      id="runGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="oklch(0.65 0.2 290)"
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="100%"
                        stopColor="oklch(0.65 0.2 290)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.75rem",
                      color: "var(--foreground)",
                    }}
                    cursor={{ stroke: "oklch(0.65 0.2 290)", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="runs"
                    stroke="oklch(0.65 0.2 290)"
                    strokeWidth={2}
                    fill="url(#runGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Connections status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <h2 className="mb-4 text-lg font-semibold">Connections</h2>
            <ul className="flex flex-col gap-3">
              {connections.map((conn) => (
                <li
                  key={conn.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{conn.name}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    Active
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* Recent activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="flex flex-col gap-3">
            {recentActivity.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.detail}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  )
}

export default DashboardPage
