// --- Mock Data para Overview Metrics de Orders ---

export const overviewMetricsOrdersByPeriod = {
  day: {
    updates: {
      title: "Updates",
      icon: "/assets/icons/asterisk-circle.svg",
      insight: {
        text: "Completed requests increased {value}",
        value: "5%",
        trend: 'up' as const,
      },
      // Datos para el gráfico de barras por estado
      chartData: [
        { name: "Queued", value: 3, color: "bg-gray-600" },
        { name: "In Progress", value: 4, color: "bg-yellow-400" },
        { name: "Revision", value: 2, color: "bg-red-400" },
        { name: "Completed", value: 5, color: "bg-green-700" },
      ],
      // Opciones para el dropdown de la tarjeta
      dropdownItems: [
        { value: "status", label: "Status" },
        { value: "priority", label: "Priority" },
      ],
    },
    completionTime: {
      value: "18 hours",
      percentage: "12.5%",
      trend: "down" as const,
      description: "On orders completed today",
    },
    revisionRate: {
      value: "0.5 revisions",
      percentage: "15.2%",
      trend: "down" as const,
      description: "Tasks required revisions",
    },
    clientRatings: {
      value: "4.9/5 stars",
      percentage: "2.1%",
      trend: "up" as const,
      description: "Across 8 completed tasks",
    },
    taskVolume: {
      value: "15 tasks",
      percentage: "6.7%",
      trend: "up" as const,
      description: "Tasks sent today",
    },
  },
  week: {
    updates: {
      title: "Updates",
      icon: "/assets/icons/asterisk-circle.svg",
      insight: {
        text: "Completed requests increased {value}",
        value: "24%",
        trend: 'up' as const,
      },
      // Datos para el gráfico de barras por estado
      chartData: [
        { name: "Queued", value: 12, color: "bg-gray-600" },
        { name: "In Progress", value: 15, color: "bg-yellow-400" },
        { name: "Revision", value: 13, color: "bg-red-400" },
        { name: "Completed", value: 16, color: "bg-green-700" },
      ],
      // Opciones para el dropdown de la tarjeta
      dropdownItems: [
        { value: "status", label: "Status" },
        { value: "priority", label: "Priority" },
      ],
    },
    completionTime: {
      value: "21 hours",
      percentage: "8.35%",
      trend: "down" as const,
      description: "On orders completed this week",
    },
    revisionRate: {
      value: "1.8 revisions",
      percentage: "8.35%",
      trend: "down" as const,
      description: "Tasks required revisions",
    },
    clientRatings: {
      value: "4.8/5 stars",
      percentage: "5.27%",
      trend: "up" as const,
      description: "Across 32 completed tasks",
    },
    taskVolume: {
      value: "120 tasks",
      percentage: "8.35%",
      trend: "down" as const,
      description: "Tasks sent this week",
    },
  },
  month: {
    updates: {
      title: "Updates",
      icon: "/assets/icons/asterisk-circle.svg",
      insight: {
        text: "Completed requests increased {value}",
        value: "18%",
        trend: 'up' as const,
      },
      // Datos para el gráfico de barras por estado
      chartData: [
        { name: "Queued", value: 45, color: "bg-gray-600" },
        { name: "In Progress", value: 52, color: "bg-yellow-400" },
        { name: "Revision", value: 38, color: "bg-red-400" },
        { name: "Completed", value: 65, color: "bg-green-700" },
      ],
      // Opciones para el dropdown de la tarjeta
      dropdownItems: [
        { value: "status", label: "Status" },
        { value: "priority", label: "Priority" },
      ],
    },
    completionTime: {
      value: "19 hours",
      percentage: "5.8%",
      trend: "down" as const,
      description: "On orders completed this month",
    },
    revisionRate: {
      value: "1.5 revisions",
      percentage: "12.1%",
      trend: "down" as const,
      description: "Tasks required revisions",
    },
    clientRatings: {
      value: "4.7/5 stars",
      percentage: "7.3%",
      trend: "up" as const,
      description: "Across 145 completed tasks",
    },
    taskVolume: {
      value: "480 tasks",
      percentage: "11.2%",
      trend: "up" as const,
      description: "Tasks sent this month",
    },
  },
  year: {
    updates: {
      title: "Updates",
      icon: "/assets/icons/asterisk-circle.svg",
      insight: {
        text: "Completed requests increased {value}",
        value: "35%",
        trend: 'up' as const,
      },
      // Datos para el gráfico de barras por estado
      chartData: [
        { name: "Queued", value: 120, color: "bg-gray-600" },
        { name: "In Progress", value: 150, color: "bg-yellow-400" },
        { name: "Revision", value: 95, color: "bg-red-400" },
        { name: "Completed", value: 180, color: "bg-green-700" },
      ],
      // Opciones para el dropdown de la tarjeta
      dropdownItems: [
        { value: "status", label: "Status" },
        { value: "priority", label: "Priority" },
      ],
    },
    completionTime: {
      value: "20 hours",
      percentage: "3.2%",
      trend: "down" as const,
      description: "On orders completed this year",
    },
    revisionRate: {
      value: "1.2 revisions",
      percentage: "18.5%",
      trend: "down" as const,
      description: "Tasks required revisions",
    },
    clientRatings: {
      value: "4.6/5 stars",
      percentage: "9.8%",
      trend: "up" as const,
      description: "Across 1800 completed tasks",
    },
    taskVolume: {
      value: "5800 tasks",
      percentage: "15.7%",
      trend: "up" as const,
      description: "Tasks sent this year",
    },
  },
};