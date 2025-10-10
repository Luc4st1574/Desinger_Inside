import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Banknote,
  Repeat,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
} from 'lucide-react';
import adminData from '@/data/adminData.json';

// --- Type Definitions ---
type Period = 'Week' | 'Month' | 'Year';

// --- Date Helper Functions ---
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  // Note: setDate adjusts the month/year automatically if the day goes out of bounds.
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
};

const getStartOfMonth = (date: Date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

// --- Helper function to calculate percentage change ---
const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};


// --- Main Revenue Overview Component ---
const RevenueOverview = () => {
  const [activePeriod, setActivePeriod] = useState<Period>('Month');
  const periods: Period[] = ['Week', 'Month', 'Year'];
  const { clients, plans, team } = adminData.dashboardData;

  // --- Logic for Top KPI Cards ---
  const revenueData = useMemo(() => {
    const now = new Date('2025-10-10T12:00:00-05:00');
    let currentStartDate: Date, previousStartDate: Date;

    switch (activePeriod) {
      case 'Week':
        currentStartDate = getStartOfWeek(now);
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        previousStartDate = getStartOfWeek(lastWeek);
        break;
      case 'Year':
        currentStartDate = new Date(now.getFullYear(), 0, 1);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      case 'Month':
      default:
        currentStartDate = getStartOfMonth(now);
        const lastMonth = new Date(now);
        lastMonth.setMonth(now.getMonth() - 1);
        previousStartDate = getStartOfMonth(lastMonth);
        break;
    }

    const calculateMetricsForPeriod = (startDate: Date) => {
      let revenue = 0;
      // This logic calculates MRR based on all active clients who joined *before* the period started.
      const activeClientsInPeriod = clients.filter(client => {
        const joinDate = new Date(client.joinDate);
        return client.status === 'Active' && joinDate <= startDate;
      });

      activeClientsInPeriod.forEach(client => {
        const planKey = client.planId as keyof typeof plans;
        if (plans[planKey]) {
          revenue += plans[planKey].price;
        }
      });
      return { revenue, clientCount: activeClientsInPeriod.length };
    };

    const currentData = calculateMetricsForPeriod(currentStartDate);
    const previousData = calculateMetricsForPeriod(previousStartDate);

    const revenuePerClient = currentData.clientCount > 0 ? currentData.revenue / currentData.clientCount : 0;
    const prevRevenuePerClient = previousData.clientCount > 0 ? previousData.revenue / previousData.clientCount : 0;

    return {
      totalRevenue: { current: currentData.revenue, previous: previousData.revenue },
      recurringRevenue: { current: currentData.revenue, previous: previousData.revenue },
      revenuePerClient: { current: revenuePerClient, previous: prevRevenuePerClient },
    };
  }, [activePeriod, clients, plans]);

  const totalRevenueChange = calculatePercentageChange(revenueData.totalRevenue.current, revenueData.totalRevenue.previous);
  const recurringRevenueChange = calculatePercentageChange(revenueData.recurringRevenue.current, revenueData.recurringRevenue.previous);
  const revenuePerClientChange = calculatePercentageChange(revenueData.revenuePerClient.current, revenueData.revenuePerClient.previous);

  const kpiMetrics = [
    { title: 'Total Revenue', icon: Banknote, value: revenueData.totalRevenue.current, change: totalRevenueChange, label: 'All client payments' },
    { title: 'Recurring Revenue', icon: Repeat, value: revenueData.recurringRevenue.current, change: recurringRevenueChange, label: 'Subscriptions and one-time' },
    { title: 'Revenue per Client', icon: Users, value: revenueData.revenuePerClient.current, change: revenuePerClientChange, label: 'Average per client' },
  ];

  // --- [MODIFIED] Logic for Bottom Detailed Client Table ---
  const processedClients = useMemo(() => {
    const now = new Date('2025-10-10T12:00:00-05:00');
    let periodStartDate: Date;

    // 1. Determine the start date for the filter based on the active period
    switch (activePeriod) {
      case 'Week':
        periodStartDate = getStartOfWeek(now);
        break;
      case 'Year':
        periodStartDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'Month':
      default:
        periodStartDate = getStartOfMonth(now);
        break;
    }

    const mappedClients = clients
      // 2. Filter clients who joined within the selected period (from periodStartDate to now)
      .filter(client => {
        const joinDate = new Date(client.joinDate);
        return client.status === 'Active' && joinDate >= periodStartDate && joinDate <= now;
      })
      .map(client => {
        const clientPlan = plans[client.planId as keyof typeof plans];
        if (!clientPlan) return null;

        const joinDate = new Date(client.joinDate);
        const renewalDate = new Date(joinDate);
        renewalDate.setFullYear(joinDate.getFullYear() + 1);

        // This calculates total revenue since joining (Lifetime Value)
        const monthsDifference = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());
        // We add 1 to include the current month's payment
        const totalRevenue = clientPlan.price * (monthsDifference + 1);
        
        return { ...client, plan: clientPlan, joinDate, renewalDate, totalRevenue };
      });

    const validClients = mappedClients.filter(
      (client): client is NonNullable<typeof client> => client !== null
    );

    return validClients.sort((clientA, clientB) => 
      clientB.joinDate.getTime() - clientA.joinDate.getTime()
    );
  // 3. Add `activePeriod` to the dependency array to re-run this logic when the period changes
  }, [activePeriod, clients, plans]);

  const getPlanStyles = (planId: string) => {
    switch (planId) {
      case 'growth': return 'bg-[#f3fee7] text-black';
      case 'pro': return 'bg-[#defcbd] text-black';
      case 'starter': return 'bg-[#f0f3f4] text-black';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pb-8">
      {/* --- TOP PART: HEADER AND KPI CARDS --- */}
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <h2 className="mb-3 text-xl font-semibold text-gray-800 sm:mb-0">
          Revenue
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
      <div className="mb-8 flex divide-x divide-gray-200 rounded-md border border-gray-200 bg-white shadow-sm">
        {kpiMetrics.map((metric, index) => {
          const isIncrease = metric.change >= 0;
          const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(metric.value);
          return (
            <div key={index} className="flex-1 p-5">
              <metric.icon className="h-6 w-6 text-[#697d67]" strokeWidth={1.5} />
              <p className="mt-4 text-base font-light text-[#5e6b66]">{metric.title}</p>
              <div className="mt-1 flex items-baseline space-x-2">
                <p className="text-xl font-light text-black">{formattedValue}</p>
                <div className={`flex items-center space-x-0.5 rounded-full py-px pl-1.5 pr-0 text-[11px] font-normal text-gray-900 ${isIncrease ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'}`}>
                  <span>{Math.abs(metric.change).toFixed(2)}%</span>
                  <span className="mt-px">
                    {isIncrease ? <ArrowUpRight size={10} strokeWidth={3} className="text-[#62864d]" /> : <ArrowDownRight size={10} strokeWidth={3} className="text-[#f01616]" />}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{metric.label}</p>
            </div>
          );
        })}
      </div>
      <div className="overflow-hidden rounded-md border border-gray-200 shadow-sm">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[30%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="flex items-center">Company<ChevronDown className="ml-1 h-4 w-4 text-gray-400" /></div>
              </th>
              <th className="w-[12%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="flex items-center">Plan<ChevronDown className="ml-1 h-4 w-4 text-gray-400" /></div>
              </th>
              <th className="w-[12%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="flex items-center">Price<ChevronDown className="ml-1 h-4 w-4 text-gray-400" /></div>
              </th>
              <th className="w-[16%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="flex items-center">Renewal Date<ChevronDown className="ml-1 h-4 w-4 text-gray-400" /></div>
              </th>
              <th className="w-[15%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="flex items-center">Total Revenue<ChevronDown className="ml-1 h-4 w-4 text-gray-400" /></div>
              </th>
              <th className="w-[15%] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="flex items-center">Assigned<ChevronDown className="ml-1 h-4 w-4 text-gray-400" /></div>
              </th>
            </tr>
          </thead>
        </table>
        <div className="h-[360px] overflow-y-auto">
          <table className="min-w-full table-fixed">
            <tbody className="divide-y divide-gray-200 bg-white">
              {processedClients.length > 0 ? (
                processedClients.map(client => {
                  const assignedMembers = client.assignedTeamMemberIds.map(id => team.find(member => member.id === id));
                  return (
                    <tr key={client.id}>
                      <td className="w-[30%] px-6 py-4">
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm font-light text-gray-500">Since {client.joinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </td>
                      <td className="w-[12%] whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5 ${getPlanStyles(client.planId)}`}>{client.plan.name}</span>
                      </td>
                      <td className="w-[12%] whitespace-nowrap px-6 py-4 text-sm text-gray-700">${client.plan.price.toLocaleString()}/mo</td>
                      <td className="w-[16%] whitespace-nowrap px-6 py-4 text-sm text-gray-500">{client.renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="w-[15%] whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-800">${client.totalRevenue.toLocaleString()}</td>
                      <td className="w-[15%] whitespace-nowrap px-6 py-4">
                        <div className="flex -space-x-2 overflow-hidden">
                          {assignedMembers.map(member => member && (<Image key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={member.avatar} alt={member.name} width={32} height={32} />))}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                // 5. Added a message for when no new clients are found for the period
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No new clients joined in this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;