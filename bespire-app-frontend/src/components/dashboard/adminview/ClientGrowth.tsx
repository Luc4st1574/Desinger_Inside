import React from 'react'
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react'
import adminData from '@/data/adminData.json'

// --- Date Helper Functions ---
const getWeekRange = date => {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return { start, end }
}

const getMonthRange = date => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1)
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)
    return { start, end }
}

const getYearRange = date => {
    const start = new Date(date.getFullYear(), 0, 1)
    const end = new Date(date.getFullYear(), 11, 31)
    end.setHours(23, 59, 59, 999)
    return { start, end }
}

// --- Tooltip and Hover Dot Sub-Components ---

const ChartTooltip = ({ info, year }) => {
    const { data, position } = info

    const StatPill = ({ value, isGood }) => {
        const isIncrease = value >= 0
        const isPositiveOutcome = (isGood && isIncrease) || (!isGood && !isIncrease)

        return (
            <div
                className={`flex items-center space-x-0.5 rounded-full py-px pl-1.5 pr-0 text-[11px] font-normal text-gray-900 ${
                    isPositiveOutcome ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'
                }`}
            >
                <span>{Math.abs(value).toFixed(0)}%</span>
                <span className="mt-px">
                    {isIncrease ? (
                        <ArrowUpRight size={10} strokeWidth={3} className="text-[#62864d]" />
                    ) : (
                        <ArrowDownRight size={10} strokeWidth={3} className="text-[#f01616]" />
                    )}
                </span>
            </div>
        )
    }

    return (
        <div
            className="pointer-events-none absolute z-40 w-48 rounded-lg border border-gray-200 bg-white p-4 text-sm shadow-lg transition-opacity"
            style={{
                left: position.x + 15,
                top: position.y,
                opacity: info ? 1 : 0,
            }}
        >
            <p className="font-bold text-gray-800">Insights</p>
            <p className="mb-4 text-gray-500">
                {data.label} {year}
            </p>

            <div className="flex flex-col space-y-3">
                <div>
                    <div className="flex items-center">
                        <div className="mr-2 h-2.5 w-2.5 rounded-full bg-[#697d67]"></div>
                        <span className="text-gray-600">Active Clients</span>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 pl-[18px]">
                        <span className="font-medium text-gray-800">{data.activeAccumulated}</span>
                        <StatPill value={data.activeChange} isGood={true} />
                    </div>
                </div>
                <div>
                    <div className="flex items-center">
                        <div className="mr-2 h-2.5 w-2.5 rounded-full bg-[#fedaa0]"></div>
                        <span className="text-gray-600">Clients Acquired</span>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 pl-[18px]">
                        <span className="font-medium text-gray-800">{data.acquired}</span>
                        <StatPill value={data.acquiredChange} isGood={true} />
                    </div>
                </div>
                <div>
                    <div className="flex items-center">
                        <div className="mr-2 h-2.5 w-2.5 rounded-full bg-[#e2e6e4]"></div>
                        <span className="text-gray-600">Unsubscribed</span>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 pl-[18px]">
                        <span className="font-medium text-gray-800">{data.unsubscribed}</span>
                        <StatPill value={data.unsubscribedChange} isGood={false} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const HoverDots = ({ info, data, maxValue }) => {
    const { index, data: hoverData } = info
    const x = `calc(${(index + 0.5) / data.length * 100}%)`

    const Dot = ({ value, color }) => {
        if (!value || value === 0) {
            return null
        }

        const y = Math.min(100, Math.max(0, 100 - (value / maxValue) * 100))

        return (
            <div
                className="pointer-events-none absolute z-30 -mt-2 flex h-4 w-4 items-center justify-center rounded-full"
                style={{
                    left: x,
                    top: `${y}%`,
                    backgroundColor: color,
                    transform: 'translateX(-50%)',
                }}
            >
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
            </div>
        )
    }

    return <Dot value={hoverData.activeAccumulated} color="#5e6b66" />
}

const CustomChart = ({ data, year }) => {
    const chartContainerRef = React.useRef(null)
    const [hoverInfo, setHoverInfo] = React.useState(null)

    const maxValue = React.useMemo(() => {
        if (!data || data.length === 0) return 50
        const maxVal = Math.max(
            ...data.map(d => Math.max(d.activeAccumulated, d.acquired, d.unsubscribed))
        )
        if (maxVal === 0) return 10
        return Math.ceil(maxVal / 10) * 10 + 10
    }, [data])

    const yAxisMarkers = React.useMemo(() => {
        const step = maxValue / 5
        return Array.from({ length: 6 }, (_, i) => Math.round(i * step))
    }, [maxValue])

    const handleMouseMove = (itemData, index, e) => {
        const rect = chartContainerRef.current.getBoundingClientRect()
        setHoverInfo({
            index,
            data: itemData,
            position: {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            },
        })
    }

    const linePath = React.useMemo(() => {
        if (!data || data.length < 2) return ''
        const points = data.map((d, index) => {
            const clampedValue = Math.max(0, d.activeAccumulated);
            return {
                x: ((index + 0.5) / data.length) * 100,
                y: Math.min(100, 100 - (clampedValue / maxValue) * 100),
            };
        });

        let path = `M${points[0].x},${points[0].y}`
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = i > 0 ? points[i - 1] : points[0]
            const p1 = points[i]
            const p2 = points[i + 1]
            const p3 = i < points.length - 2 ? points[i + 2] : p2

            const tension = 1/6;
            
            const cp1x = p1.x + (p2.x - p0.x) * tension;
            let cp1y = p1.y + (p2.y - p0.y) * tension;
            const cp2x = p2.x - (p3.x - p1.x) * tension;
            let cp2y = p2.y - (p3.y - p1.y) * tension;

            cp1y = Math.min(100, cp1y);
            cp2y = Math.min(100, cp2y);

            path += ` C${cp1x},${cp1y},${cp2x},${cp2y},${p2.x},${p2.y}`
        }
        return path
    }, [data, maxValue])

    return (
        <div className="relative mt-8 h-[300px] w-full">
            <div className="absolute left-0 top-0 flex h-[calc(100%-30px)] w-8 flex-col justify-between text-right">
                {yAxisMarkers
                    .slice()
                    .reverse()
                    .map(label => (
                        <span key={label} className="text-xs text-gray-400">
                            {label}
                        </span>
                    ))}
            </div>

            <div className="relative ml-10 h-full" ref={chartContainerRef} onMouseLeave={() => setHoverInfo(null)}>
                <div className="absolute bottom-6 left-0 right-0 h-px bg-gray-200"></div>

                <div className="absolute bottom-0 left-0 flex h-full w-full justify-around">
                    {data.map((item, index) => (
                        <div
                            key={item.label}
                            className="relative z-10 flex h-full w-full flex-col items-center justify-end"
                            onMouseMove={e => handleMouseMove(item, index, e)}
                        >
                            <div className="flex h-full w-full items-end justify-center gap-1 pb-6">
                                <div
                                    className="w-2.5 rounded-t-sm bg-[#fedaa0]"
                                    style={{ height: `${(item.acquired / maxValue) * 100}%` }}
                                ></div>
                                <div
                                    className="w-2.5 rounded-t-sm bg-[#e2e6e4]"
                                    style={{ height: `${(item.unsubscribed / maxValue) * 100}%` }}
                                ></div>
                            </div>
                            <span className="absolute -bottom-4 text-xs text-gray-500">{item.label}</span>
                        </div>
                    ))}
                </div>

                <svg
                    className="pointer-events-none absolute bottom-6 left-0 z-20 h-[calc(100%-24px)] w-full overflow-visible"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <path d={linePath} fill="none" stroke="#697d67" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                </svg>

                {hoverInfo && hoverInfo.data.activeAccumulated > 0 && (
                    <>
                        <div className="absolute bottom-6 left-0 h-[calc(100%-24px)] w-full">
                            <HoverDots info={hoverInfo} data={data} maxValue={maxValue} />
                        </div>
                        <ChartTooltip info={hoverInfo} year={year} />
                    </>
                )}
            </div>
        </div>
    )
}

// --- Main Client Growth Component ---
const ClientGrowth = () => {
    const [activePeriod, setActivePeriod] = React.useState('Year')
    const periods = ['Week', 'Month', 'Year']
    const { clients } = adminData.dashboardData

    const processedData = React.useMemo(() => {
        const today = new Date()

        const allClients = clients.map(c => ({
            ...c,
            joinDate: new Date(c.joinDate),
            statusChangeDate: new Date(c.statusChangeDate),
        }))

        const calculateChange = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0
            return ((current - previous) / previous) * 100
        }

        const getMetricsForPeriod = (startDate, endDate) => {
            const active = allClients.filter(
                c => c.status === 'Active' && c.statusChangeDate >= startDate && c.statusChangeDate <= endDate
            ).length

            const unsubscribed = allClients.filter(
                c =>
                    c.status === 'Unsubscribed' &&
                    c.statusChangeDate >= startDate &&
                    c.statusChangeDate <= endDate
            ).length

            const acquired = allClients.filter(
                c => c.joinDate >= startDate && c.joinDate <= endDate
            ).length
            
            // --- MODIFICATION ---
            // This logic now correctly calculates the number of clients who were active
            // at the end of any given historical period.
            const activeAccumulated = allClients.filter(c => {
                const joinedBeforeOrOnEndDate = c.joinDate <= endDate;
                if (!joinedBeforeOrOnEndDate) return false;

                // A client is counted if they are still 'Active', OR if they 'Unsubscribed'
                // but only *after* the period we are calculating for had ended.
                return c.status === 'Active' || (c.status === 'Unsubscribed' && c.statusChangeDate > endDate);
            }).length;

            return { active, unsubscribed, acquired, activeAccumulated }
        }

        let chartData = []
        const kpis = {}
        let comparisonLabel = ''
        const year = today.getFullYear()

        switch (activePeriod) {
            case 'Week': {
                comparisonLabel = 'vs last week'
                const currentWeek = getWeekRange(today)
                const lastWeekDate = new Date(today)
                lastWeekDate.setDate(today.getDate() - 7)
                const previousWeek = getWeekRange(lastWeekDate)
                kpis.current = getMetricsForPeriod(currentWeek.start, today)
                kpis.previous = getMetricsForPeriod(previousWeek.start, previousWeek.end)
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                chartData = days.map((day, i) => {
                    const dayStart = new Date(currentWeek.start)
                    dayStart.setDate(currentWeek.start.getDate() + i)
                    const dayEnd = new Date(dayStart)
                    dayEnd.setHours(23, 59, 59, 999)
                    if (dayStart > today) {
                        return { label: day, active: 0, unsubscribed: 0, acquired: 0, activeAccumulated: 0 }
                    }
                    return { label: day, ...getMetricsForPeriod(dayStart, dayEnd) }
                })
                break
            }
            case 'Month': {
                comparisonLabel = 'vs last month'
                const currentMonth = getMonthRange(today)
                const lastMonthDate = new Date(today)
                lastMonthDate.setMonth(today.getMonth() - 1)
                const previousMonth = getMonthRange(lastMonthDate)
                kpis.current = getMetricsForPeriod(currentMonth.start, today)
                kpis.previous = getMetricsForPeriod(previousMonth.start, previousMonth.end)
                chartData = [1, 2, 3, 4].map(weekNum => {
                    const weekStart = new Date(currentMonth.start)
                    weekStart.setDate(currentMonth.start.getDate() + (weekNum - 1) * 7)
                    let weekEnd = new Date(weekStart)
                    weekEnd.setDate(weekStart.getDate() + 6)
                    if (weekEnd.getMonth() !== currentMonth.start.getMonth()) {
                        weekEnd = new Date(currentMonth.end)
                    }
                    return { label: `W${weekNum}`, ...getMetricsForPeriod(weekStart, weekEnd > today ? today : weekEnd) }
                })
                break
            }
            case 'Year': {
                comparisonLabel = 'vs last year'
                const currentYear = getYearRange(today)
                const lastYearDate = new Date(today)
                lastYearDate.setFullYear(today.getFullYear() - 1)
                const previousYear = getYearRange(lastYearDate)
                kpis.current = getMetricsForPeriod(currentYear.start, today)
                kpis.previous = getMetricsForPeriod(previousYear.start, previousYear.end)
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                chartData = months.map((month, i) => {
                    const monthStart = new Date(today.getFullYear(), i, 1)
                    if (monthStart > today) {
                        return { label: month, active: 0, unsubscribed: 0, acquired: 0, activeAccumulated: 0 }
                    }
                    const monthEnd = new Date(today.getFullYear(), i + 1, 0)
                    return { label: month, ...getMetricsForPeriod(monthStart, monthEnd > today ? today : monthEnd) }
                })
                break
            }
        }

        const chartDataWithChanges = chartData.map((item, index) => {
            const prevItem = index > 0 ? chartData[index - 1] : null
            return {
                ...item,
                activeChange: prevItem ? calculateChange(item.activeAccumulated, prevItem.activeAccumulated) : 0,
                acquiredChange: prevItem ? calculateChange(item.acquired, prevItem.acquired) : 0,
                unsubscribedChange: prevItem ? calculateChange(item.unsubscribed, prevItem.unsubscribed) : 0,
            }
        })

        const activeClientsChange = calculateChange(kpis.current.active, kpis.previous.active)
        const unsubscribedChange = calculateChange(kpis.current.unsubscribed, kpis.previous.unsubscribed)

        return {
            activeClients: { current: kpis.current.active, change: activeClientsChange },
            unsubscribedClients: { current: kpis.current.unsubscribed, change: unsubscribedChange },
            totalClientsOverall: allClients.length,
            chartData: chartDataWithChanges,
            comparisonLabel,
            year,
        }
    }, [activePeriod, clients])

    const { activeClients, unsubscribedClients, totalClientsOverall, chartData, comparisonLabel, year } =
        processedData
    const isIncreaseForActive = activeClients.change >= 0
    const isIncreaseForUnsubscribed = unsubscribedClients.change >= 0

    return (
        <div className="pb-4">
            <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                <h2 className="mb-3 text-xl font-semibold text-gray-800 sm:mb-0">Client Growth</h2>
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

            <div className="rounded-md border border-gray-200/80 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-y-0">
                    <div className="md:border-r md:border-gray-200/80 md:pr-6">
                        <p className="text-sm text-[#5e6b66]">New Active Clients</p>
                        <p className="mt-1 text-3xl font-light text-gray-800">{activeClients.current}</p>
                        <div className="mt-2 flex items-center gap-x-2">
                            <div
                                className={`flex items-center space-x-0.5 rounded-full py-px pl-1.5 pr-0 text-[11px] font-normal text-gray-900 ${
                                    isIncreaseForActive ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'
                                }`}
                            >
                                <span>{Math.abs(activeClients.change).toFixed(1)}%</span>
                                <span className="mt-px">
                                    {isIncreaseForActive ? (
                                        <ArrowUpRight size={10} strokeWidth={3} className="text-[#62864d]" />
                                    ) : (
                                        <ArrowDownRight size={10} strokeWidth={3} className="text-[#f01616]" />
                                    )}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">{comparisonLabel}</span>
                        </div>
                    </div>
                    <div className="md:border-r md:border-gray-200/80 md:px-6">
                        <p className="text-sm text-[#5e6b66]">New Unsubscribed</p>
                        <p className="mt-1 text-3xl font-light text-gray-800">{unsubscribedClients.current}</p>
                        <div className="mt-2 flex items-center gap-x-2">
                            <div
                                className={`flex items-center space-x-0.5 rounded-full py-px pl-1.5 pr-0 text-[11px] font-normal text-gray-900 ${
                                    !isIncreaseForUnsubscribed ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'
                                }`}
                            >
                                <span>{Math.abs(unsubscribedClients.change).toFixed(1)}%</span>
                                <span className="mt-px">
                                    {isIncreaseForUnsubscribed ? (
                                        <ArrowUpRight size={10} strokeWidth={3} className="text-[#62864d]" />
                                    ) : (
                                        <ArrowDownRight size={10} strokeWidth={3} className="text-[#f01616]" />
                                    )}
                                </span>
                            </div>
                            <span className="text-xs text-gray-400">{comparisonLabel}</span>
                        </div>
                    </div>
                    <div className="md:pl-6">
                        <p className="text-sm text-[#5e6b66]">Total Clients Overall</p>
                        <p className="mt-1 text-3xl font-light text-gray-800">{totalClientsOverall}</p>
                        <p className="mt-2 text-xs text-gray-400">Accumulated since inception</p>
                    </div>
                </div>

                <CustomChart data={chartData} year={year} />

                <div className="flex items-center justify-between pt-6">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        <div className="flex items-center">
                            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-[#697d67]"></div>
                            <span className="text-sm text-gray-600">Accumulated Active</span>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-[#fedaa0]"></div>
                            <span className="text-sm text-gray-600">Clients Acquired</span>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-2 h-2.5 w-2.5 rounded-full bg-[#e2e6e4]"></div>
                            <span className="text-sm text-gray-600">Unsubscribed</span>
                        </div>
                    </div>
                    <button className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-gray-800">
                        <span>View all</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ClientGrowth