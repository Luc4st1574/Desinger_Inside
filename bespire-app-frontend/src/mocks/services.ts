// --- Mock Data para Overview Metrics de Services ---

export const overviewMetricsServicesByPeriod = {
  day: {
    updates: {
      title: "Updates",
      icon: "/assets/icons/asterisk-circle.svg",
      insight: {
        text: "{value} has the majority of the share in our services",
        value: "Social Posts",
        trend: 'neutral' as const,
      },
      // Datos del gráfico de barras por tipo de servicio
      chartData: [
        { name: "Graphic Design", value: 4, color: "bg-gray-700" },
        { name: "Motion Grap...", value: 3, color: "bg-yellow-400" },
        { name: "Paid Ads", value: 2, color: "bg-red-400" },
        { name: "Web", value: 1, color: "bg-orange-400" },
        { name: "Others", value: 3, color: "bg-gray-500" },
      ],
      // Opciones para el dropdown de la tarjeta
      dropdownItems: [
        { value: "type", label: "Type" },
        { value: "credits", label: "Credits" },
      ],
    },
    totalServices: {
      value: "12",
      percentage: "1%",
      trend: "up" as const,
      description: "Services added to the workspace",
    },
    mostRequested: {
      value: "Social Posts",
      percentage: "28% of requests",
      trend: "up" as const,
      description: "Highest-demand service today",
    },
    avgCredits: {
      value: "7.2 credits",
      percentage: "5.1%",
      trend: "up" as const,
      description: "Average credit usage per request",
    },
    totalCreditsAssigned: {
      value: "320 credits",
      percentage: "12.8%",
      trend: "up" as const,
      description: "Total credits used across clients",
    },
  },
  week: {
    updates: {
      title: "Updates",
      icon: "/assets/icons/asterisk-circle.svg",
      insight: {
        text: "{value} has the majority of the share in our services",
        value: "Graphic Design",
        trend: 'neutral' as const,
      },
      // Datos del gráfico de barras por tipo de servicio
      chartData: [
        { name: "Graphic Design", value: 16, color: "bg-gray-700" },
        { name: "Motion Grap...", value: 12, color: "bg-yellow-400" },
        { name: "Paid Ads", value: 9, color: "bg-red-400" },
        { name: "Web", value: 6, color: "bg-orange-400" },
        { name: "Others", value: 10, color: "bg-gray-500" },
      ],
      // Opciones para el dropdown de la tarjeta
      dropdownItems: [
        { value: "type", label: "Type" },
        { value: "credits", label: "Credits" },
      ],
    },
    totalServices: {
      value: "88",
      percentage: "3%",
      trend: "up" as const,
      description: "Services added to the workspace",
    },
    mostRequested: {
      value: "Social Posts",
      percentage: "24%",
      trend: "up" as const,
      description: "Highest-demand service this week",
    },
    avgCredits: {
      value: "8.4 credits",
      percentage: "8.2%",
      trend: "up" as const,
      description: "Average credit usage per request",
    },
    totalCreditsAssigned: {
      value: "2,350 credits",
      percentage: "8.35%",
      trend: "down" as const,
      description: "Total credits used across clients",
    },
  },
  month: {
    updates: {
      title: "Updates",
      icon: "/assets/icons/asterisk-circle.svg",
      insight: {
        text: "{value} has the majority of the share in our services",
        value: "Motion Graphics",
        trend: 'neutral' as const,
      },
      // Datos del gráfico de barras por tipo de servicio
      chartData: [
        { name: "Graphic Design", value: 65, color: "bg-gray-700" },
        { name: "Motion Grap...", value: 48, color: "bg-yellow-400" },
        { name: "Paid Ads", value: 35, color: "bg-red-400" },
        { name: "Web", value: 28, color: "bg-orange-400" },
        { name: "Others", value: 42, color: "bg-gray-500" },
      ],
      // Opciones para el dropdown de la tarjeta
      dropdownItems: [
        { value: "type", label: "Type" },
        { value: "credits", label: "Credits" },
      ],
    },
    totalServices: {
      value: "425",
      percentage: "12",
      trend: "up" as const,
      description: "Services added to the workspace",
    },
    mostRequested: {
      value: "Motion Graphics",
      percentage: "22% of requests",
      trend: "up" as const,
      description: "Highest-demand service this month",
    },
    avgCredits: {
      value: "9.1 credits",
      percentage: "6.8%",
      trend: "up" as const,
      description: "Average credit usage per request",
    },
    totalCreditsAssigned: {
      value: "18,750 credits",
      percentage: "11.2%",
      trend: "up" as const,
      description: "Total credits used across clients",
    },
  },
  year: {
    updates: {
      title: "Updates",
      icon: "/assets/icons/asterisk-circle.svg",
      insight: {
        text: "{value} has the majority of the share in our services",
        value: "Graphic Design",
        trend: 'neutral' as const,
      },
      // Datos del gráfico de barras por tipo de servicio
      chartData: [
        { name: "Graphic Design", value: 780, color: "bg-gray-700" },
        { name: "Motion Grap...", value: 580, color: "bg-yellow-400" },
        { name: "Paid Ads", value: 420, color: "bg-red-400" },
        { name: "Web", value: 350, color: "bg-orange-400" },
        { name: "Others", value: 510, color: "bg-gray-500" },
      ],
      // Opciones para el dropdown de la tarjeta
      dropdownItems: [
        { value: "type", label: "Type" },
        { value: "credits", label: "Credits" },
      ],
    },
    totalServices: {
      value: "5,120",
      percentage: "145%",
      trend: "up" as const,
      description: "Services added to the workspace",
    },
    mostRequested: {
      value: "Graphic Design",
      percentage: "26% of requests",
      trend: "up" as const,
      description: "Highest-demand service this year",
    },
    avgCredits: {
      value: "10.2 credits",
      percentage: "9.5%",
      trend: "up" as const,
      description: "Average credit usage per request",
    },
    totalCreditsAssigned: {
      value: "225,000 credits",
      percentage: "15.8%",
      trend: "up" as const,
      description: "Total credits used across clients",
    },
  },
};