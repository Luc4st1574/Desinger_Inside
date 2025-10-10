import React from 'react'
import { useState, useMemo } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

import Star from '@/assets/icons/rating_star.svg'
import Layers from '@/assets/icons/task_volume.svg'
import SendMetrics from '@/assets/icons/send_metrics.svg'
import MoneyMetrics from '@/assets/icons/money_metrics.svg'
import PeopleMetrics from '@/assets/icons/people_metrics.svg'
import ThreePeopleMetrics from '@/assets/icons/three_people_metrics.svg'

import adminData from '@/data/adminData.json'

// --- Date Helper Functions (Plain JS, no libraries needed) ---

// Returns the start of the week (Sunday) for a given date
const getStartOfWeek = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d
}

// Returns the end of the week (Saturday) for a given date
const getEndOfWeek = (date: Date) => {
    const d = getStartOfWeek(date)
    d.setDate(d.getDate() + 6)
    d.setHours(23, 59, 59, 999)
    return d
}

    // Returns the start of the month for a given date
const getStartOfMonth = (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth(), 1)
    d.setHours(0, 0, 0, 0)
    return d
}

    // Returns the end of the month for a given date
const getEndOfMonth = (date: Date) => {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    d.setHours(23, 59, 59, 999)
    return d
}

    // --- Type Definitions ---
type Period = 'Week' | 'Month' | 'Year'

    // --- Reusable Metric Item Component ---
type MetricItemProps = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    label: string
    value: string
    change: number
    changeIsPositive: boolean
    period: Period
}

const MetricItem: React.FC<MetricItemProps> = ({
    icon: Icon,
    label,
    value,
    change,
    changeIsPositive,
    period,
    }) => {
    const isIncrease = change > 0
    const comparisonText = `vs last ${period.toLowerCase()}`

    return (
        // --- SPACING ADJUSTED HERE ---
        <div className="flex items-start space-x-3 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
            <Icon className="h-10 w-10 text-[#697d67]" />
        </div>
        <div className="flex flex-col items-start">
            <p className="mb-1 text-xl font-medium text-[#5e6b66]">{label}</p>
            <h3 className="mb-3 text-xl font-medium text-gray-800">{value}</h3>
            <div className="flex items-center space-x-2 text-sm">
            <div
                className={`flex items-center space-x-0.5 rounded-full py-px pl-1.5 pr-1 text-[11px] font-normal text-gray-900 ${
                changeIsPositive ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'
                }`}
            >
                <span>{Math.abs(change).toFixed(2)}%</span>
                <span className="mt-px">
                {isIncrease ? (
                    <ArrowUpRight
                    size={10}
                    strokeWidth={3}
                    className={
                        changeIsPositive ? 'text-[#62864d]' : 'text-[#f01616]'
                    }
                    />
                ) : (
                    <ArrowDownRight
                    size={10}
                    strokeWidth={3}
                    className={
                        changeIsPositive ? 'text-[#62864d]' : 'text-[#f01616]'
                    }
                    />
                )}
                </span>
            </div>
            <span className="text-xs text-gray-400">{comparisonText}</span>
            </div>
        </div>
        </div>
    )
    }

    // --- Main Component ---
    const KeyPerformanceMetrics = () => {
    const [activePeriod, setActivePeriod] = useState<Period>('Month')
    const periods: Period[] = ['Week', 'Month', 'Year']

    const { clients, plans, tasks } = adminData.dashboardData

    const dynamicKpis = useMemo(() => {
        const now = new Date()
        let currentRange, previousRange

        switch (activePeriod) {
        case 'Week':
            currentRange = { start: getStartOfWeek(now), end: getEndOfWeek(now) }
            const lastWeek = new Date(now)
            lastWeek.setDate(now.getDate() - 7)
            previousRange = {
            start: getStartOfWeek(lastWeek),
            end: getEndOfWeek(lastWeek),
            }
            break
        case 'Year':
            currentRange = {
            start: new Date(now.getFullYear(), 0, 1),
            end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
            }
            previousRange = {
            start: new Date(now.getFullYear() - 1, 0, 1),
            end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
            }
            break
        case 'Month':
        default:
            currentRange = {
            start: getStartOfMonth(now),
            end: getEndOfMonth(now),
            }
            const lastMonth = new Date(now)
            lastMonth.setMonth(now.getMonth() - 1)
            previousRange = {
            start: getStartOfMonth(lastMonth),
            end: getEndOfMonth(lastMonth),
            }
            break
        }

        const getNewClients = (range: { start: Date; end: Date }) =>
        clients.filter(client => {
            const joinDate = new Date(client.joinDate)
            return joinDate >= range.start && joinDate <= range.end
        }).length

        const getCompletedTasks = (range: { start: Date; end: Date }) =>
        tasks.list.filter(task => {
            const deadline = new Date(task.deadline)
            return (
            task.status === 'Completed' &&
            deadline >= range.start &&
            deadline <= range.end
            )
        }).length

        const getTotalTaskVolume = (range: { start: Date; end: Date }) =>
        tasks.list.filter(task => {
            const deadline = new Date(task.deadline)
            return deadline >= range.start && deadline <= range.end
        }).length

        // Calculates Monthly Recurring Revenue (MRR) at a specific point in time
        const getMRR = (endDate: Date) => {
        let totalIncome = 0
        const activeClientsList = clients.filter(
            client =>
            new Date(client.joinDate) <= endDate && client.status === 'Active',
        )

        activeClientsList.forEach(client => {
            const planKey = client.planId as keyof typeof plans
            if (plans[planKey]) {
            totalIncome += plans[planKey].price
            }
        })
        return totalIncome
        }
        
        const getActiveClients = (endDate: Date) => {
            return clients.filter(
                client =>
                new Date(client.joinDate) <= endDate && client.status === 'Active',
            ).length
        }

        // --- DYNAMIC INCOME CALCULATION ---
        let currentPeriodIncome = 0
        let previousPeriodIncome = 0

        const currentMRR = getMRR(currentRange.end)
        const previousMRR = getMRR(previousRange.end)

        switch (activePeriod) {
        case 'Week':
            // Prorate monthly revenue to estimate weekly income
            currentPeriodIncome = currentMRR / 4.33
            previousPeriodIncome = previousMRR / 4.33
            break
        case 'Year':
            // Estimate Annual Revenue by averaging the MRR at the start and end of the year
            const mrrAtYearStart = getMRR(currentRange.start)
            currentPeriodIncome = ((mrrAtYearStart + currentMRR) / 2) * 12

            const mrrAtPrevYearStart = getMRR(previousRange.start)
            previousPeriodIncome = ((mrrAtPrevYearStart + previousMRR) / 2) * 12
            break
        case 'Month':
        default:
            // For a month, the income for the period is the MRR
            currentPeriodIncome = currentMRR
            previousPeriodIncome = previousMRR
            break
        }

        return {
        activeClients: {
            current: getActiveClients(currentRange.end),
            previous: getActiveClients(previousRange.end),
        },
        newClients: {
            current: getNewClients(currentRange),
            previous: getNewClients(previousRange),
        },
        periodIncome: {
            current: currentPeriodIncome,
            previous: previousPeriodIncome,
        },
        completedRequests: {
            current: getCompletedTasks(currentRange),
            previous: getCompletedTasks(previousRange),
        },
        taskVolume: {
            current: getTotalTaskVolume(currentRange),
            previous: getTotalTaskVolume(previousRange),
        },
        // NOTE: Client Rating is sourced from static data as there's no raw rating data to calculate it.
        clientRating: {
            current: 4.8,
            previous: 4.6,
            max: 5,
        },
        }
    }, [activePeriod, clients, plans, tasks])

    const metricsConfig = [
        {
        label: 'Active Clients',
        icon: PeopleMetrics,
        data: dynamicKpis.activeClients,
        format: (val: number) => val.toString(),
        },
        {
        label: 'New Clients',
        icon: ThreePeopleMetrics,
        data: dynamicKpis.newClients,
        format: (val: number) => val.toString(),
        },
        {
        label: `${activePeriod}ly Income`,
        icon: MoneyMetrics,
        data: dynamicKpis.periodIncome,
        format: (val: number) => `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        },
        {
        label: 'Completed Requests',
        icon: SendMetrics,
        data: dynamicKpis.completedRequests,
        format: (val: number) => val.toString(),
        },
        {
        label: 'Task Volume',
        icon: Layers,
        data: dynamicKpis.taskVolume,
        format: (val: number) => `${val} tasks`,
        isDecreasePositive: true,
        },
        {
        label: 'Overall Client Ratings',
        icon: Star,
        data: dynamicKpis.clientRating,
        format: (val: number) => `${val}/${dynamicKpis.clientRating.max} stars`,
        },
    ]

    const renderMetric = (metric: (typeof metricsConfig)[0]) => {
        const { current, previous } = metric.data
        const change =
        previous === 0
            ? current > 0
            ? 100
            : 0
            : ((current - previous) / previous) * 100

        const isChangePositive = metric.isDecreasePositive
        ? change <= 0
        : change >= 0

        return (
        <MetricItem
            key={metric.label}
            icon={metric.icon}
            label={metric.label}
            value={metric.format(current)}
            change={change}
            changeIsPositive={isChangePositive}
            period={activePeriod}
        />
        )
    }

    return (
        <div className="pb-8">
        <div className="mb-6 flex flex-col items-start justify-between px-2 sm:flex-row sm:items-center">
            <h2 className="mb-3 text-xl font-semibold text-gray-800 sm:mb-0">
            Key Performance Metrics
            </h2>
            <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
            {periods.map(period => (
                <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`w-20 rounded-full py-1.5 text-sm font-medium transition-colors focus:outline-none ${
                    activePeriod === period
                    ? 'bg-[#ceffa3] text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                >
                {period}
                </button>
            ))}
            </div>
        </div>
        <div className="rounded-md border border-gray-200/80 bg-white shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-gray-200/80 lg:grid-cols-3">
            {/* Top Row */}
            {metricsConfig.slice(0, 3).map(renderMetric)}

            {/* --- HORIZONTAL DIVIDER --- */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                <div className="w-full border-t border-gray-200/80"></div>
            </div>

            {/* Bottom Row */}
            {metricsConfig.slice(3).map(renderMetric)}
            </div>
        </div>
        </div>
    )
}

export default KeyPerformanceMetrics