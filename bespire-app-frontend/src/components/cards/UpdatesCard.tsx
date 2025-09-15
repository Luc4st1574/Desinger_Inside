/* eslint-disable @next/next/no-img-element */
"use client";

import Dropdown, { DropdownItem } from "@/components/ui/Dropdown";
import PlanChart from "@/components/ui/PlanChart"; // Este nombre está bien, ya que es un gráfico de barras segmentado
import IconAsterisco from "@/assets/icons/asterisk-circle.svg";
// --- Tipos más genéricos ---
export interface ChartSegment {
  name: string;
  value: number;
  color: string;
}

export interface UpdatesData {
  title: string;
  insight: {
    text: string;
    value: string; // ej: "24%"
    trend: 'up' | 'down' | 'neutral';
  };
  chartData: ChartSegment[];
  dropdownItems: DropdownItem[];
}

interface UpdatesCardProps {
  data: UpdatesData;
  selectedSegment: string;
  onSegmentChange: (value: string) => void;
  className?: string;
}

const UpdatesCard: React.FC<UpdatesCardProps> = ({
  data,
  selectedSegment,
  onSegmentChange,
  className = ""
}) => {
  return (
    <div className={`relative bg-green-gradient rounded-xl p-6 overflow-hidden shadow-updates ${className} min-h-[260px]`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
         <IconAsterisco className="w-5 h-5 " />
          <h3 className="font-medium text-xl">
            {data.title}
          </h3>
        </div>
        <Dropdown
          items={data.dropdownItems}
          selectedValue={selectedSegment}
          placeholder="Filter" // Placeholder genérico
          variant="greenBP"
          size="md"
          onChange={onSegmentChange}
        />
      </div>
      
      <p className="text-lg text-gray-600 ">
        Smart Insights
      </p>
      
      <p className="text-2xl font-medium mb-2 text-gray-900">
        {data.insight.text.replace('{value}', data.insight.value)}
      </p>

      <PlanChart 
        data={data.chartData}
        height="h-4"
        showLabels={true}
        labelClassName="text-xs text-gray-600"
      />
    </div>
  );
};

export default UpdatesCard;