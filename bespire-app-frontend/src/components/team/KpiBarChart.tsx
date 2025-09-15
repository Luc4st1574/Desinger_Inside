// team/KpiBarChart.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { KpiPoint } from "@/graphql/types/team";

type Props = {
  data: KpiPoint[] | undefined;
  loading?: boolean;
};

// Componente para renderizar la etiqueta personalizada dentro de la barra
interface LocalLabelProps {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  value?: number | string;
  index?: number;
}

const renderCustomizedLabel = (props: LocalLabelProps) => {
  const { x = 0, y = 0, width = 0, value = "" } = props;
  const xNum = Number(x) || 0;
  const yNum = Number(y) || 0;
  const widthNum = Number(width) || 0;
  // Small green strip height
  const stripHeight = 8;
  const stripPadding = 6; // horizontal padding inside the bar for the strip
  const stripX = xNum + stripPadding;
  const stripY = yNum + 6; // little offset from the top edge of the bar
  const stripWidth = Math.max(0, widthNum - stripPadding * 2);

  // Percentage text positioned slightly below the strip, centered
  const textY = stripY + stripHeight + 18;

  return (
    <g>
      {/* top small green rounded bar */}
  <rect x={stripX} y={stripY} rx={4} ry={4} width={stripWidth} height={stripHeight} fill="#CEFFA3" />

      {/* percentage text inside the bar, white */}
      <text
        x={xNum + widthNum / 2}
        y={textY}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm font-semibold"
      >
        {value}%
      </text>
    </g>
  );
};


export default function KpiBarChart({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="h-full bg-gray-50 rounded-md flex items-center justify-center text-gray-400 animate-pulse">
        Loading chart...
      </div>
    );
  }

  return (
    // ResponsiveContainer es clave para que el gráfico se adapte a su contenedor
    <ResponsiveContainer width="100%" height="100%">
    <BarChart
        data={data}
      barGap={2}
      barCategoryGap="8%"
        margin={{
          top: 20,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="label"
          axisLine={false} // Oculta la línea del eje X
          tickLine={false} // Oculta las marcas del eje X
          tick={{ fill: "#9CA3AF", fontSize: 12 }} // Estilo del texto
          dy={10} // Desplaza el texto del eje X hacia abajo
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={80}>
           {/* Usamos LabelList para poner el valor dentro de cada barra */}
           <LabelList dataKey="value" content={renderCustomizedLabel} />
              {data?.map((entry, index) => (
             // Usamos Cell para colorear cada barra. La última es más oscura.
            <Cell key={`cell-${index}`} fill={index === (data.length - 1) ? "#697D67" : "#697D67"} />
          ))}
            </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}