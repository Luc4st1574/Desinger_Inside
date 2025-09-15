"use client";

import React from "react";
import TrendBadge from "./TrendBadge";

interface MetricData {
  id: string;
  title: string;
  value: string | number;
  description: string;
  icon: string | React.ReactNode | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  
  // Hacemos 'percentage' opcional porque a veces usaremos 'badge' en su lugar
  percentage?: string; 
  trend: "up" | "down" | "neutral";
  trendColor?: "green" | "red" | "gray";

  // --- CAMPOS NUEVOS ---
  badge?: string;
  badgeColor?: 'green' | 'gray' | 'yellow' | 'red' | 'blue';
}


interface MetricsGridProps {
  metrics: MetricData[];
  columns?: string;
  className?: string;
  cardClassName?: string;
  cols?: number; // number of columns at md breakpoint, e.g. 2 or 4
}

const badgeColorClasses = (color?: 'green' | 'gray' | 'yellow' | 'red' | 'blue') => {
  switch (color) {
    case 'green':
      return 'bg-brand-green-light text-green-800';
    case 'gray':
      return 'bg-gray-100 text-gray-800';
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800';
    case 'red':
      return 'bg-red-100 text-red-800';
    case 'blue':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics,
  columns,
  className = "",
  cardClassName = "",
  cols = 2,
}) => {
  // Trend rendering is delegated to TrendBadge component

  const getIconComponent = (
    iconType: string | React.ReactNode | React.ComponentType<React.SVGProps<SVGSVGElement>>
  ) => {
    // If it's a React node (JSX element), return it directly
    if (React.isValidElement(iconType)) {
      return iconType;
    }

    // If it's a component type, render it
    if (typeof iconType === "function") {
      const IconComponent = iconType as React.ComponentType<React.SVGProps<SVGSVGElement>>;
      return <IconComponent className="w-8 h-8" style={{ color: "#697D67" }} />;
    }

    // Mapa de iconos disponibles (fallback para strings)
    const iconMap: { [key: string]: string } = {
      users: "👥",
      refresh: "🔄",
      star: "⭐",
      chart: "📊",
      target: "🎯",
      time: "⏰",
      trending: "📈",
      money: "💰",
      bell: "🔔",
      heart: "❤️",
    };

    return iconMap[iconType as string] || iconType;
  };

  const columnsClass = columns || `grid-cols-1 md:grid-cols-${cols ?? 2}`;

  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E6E4] overflow-hidden ${className}`}
    >
      <div
        className={`grid ${columnsClass} rounded-xl divide-x divide-gray-200`}
      >
        {metrics.map((metric, index) => (
          <div
            key={metric.id}
            className={`p-6 ${cardClassName} flex justify-start items-start gap-2 ${
              index < 2 ? 'border-b border-gray-200' : ''
            }`}
          >
            <span className="w-[40px]">{getIconComponent(metric.icon)}</span>
            <div className="flex flex-col mb-2">
              <span className="text-lg text-[#697D67] font-medium">
                {metric.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-medium text-gray-900">
                  {metric.value}
                </span>
             {metric.badge && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColorClasses(metric.badgeColor)}`}
                  >
                    {metric.badge}
                  </span>
                )}
                
                {/* Condición 2: Si NO hay 'badge' PERO SÍ hay 'percentage', muestra el TrendBadge. */}
                {!metric.badge && metric.percentage && (
                  <TrendBadge 
                    percentage={metric.percentage} 
                    trend={metric.trend} 
                    trendColor={metric.trendColor} 
                  />
                )}
          
                </div>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsGrid;
