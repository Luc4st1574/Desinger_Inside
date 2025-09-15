"use client";

interface PlanData {
    name: string;
    value: number;
    color: string;
}

interface PlanChartProps {
    data: PlanData[];
    height?: string;
    className?: string;
    showLabels?: boolean;
    labelClassName?: string;
    showValuesInBars?: boolean;
    minWidthForText?: number;
}

const PlanChart: React.FC<PlanChartProps> = ({
    data,
    height = "h-8", // Aumentamos la altura por defecto para que quepa el texto
    className = "",
    showLabels = true,
    labelClassName = "text-xs text-gray-600",
    showValuesInBars = true,
    minWidthForText = 5 // Porcentaje mínimo para mostrar texto dentro de la barra
}) => {
    // Calcular el total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Calcular porcentajes y asegurar que sumen 100%
    const dataWithPercentages = data.map(item => ({
        ...item,
        percentage: total > 0 ? (item.value / total) * 100 : 0
    }));

    // Asegurar que los porcentajes sumen exactamente 100%
    const totalPercentage = dataWithPercentages.reduce((sum, item) => sum + item.percentage, 0);
    if (totalPercentage > 0 && totalPercentage !== 100) {
        const adjustment = 100 / totalPercentage;
        dataWithPercentages.forEach(item => {
            item.percentage *= adjustment;
        });
    }

    return (
        <div className={className}>
            {/* Barra de progreso */}
            <div className={`min-h-[40px] flex justify-start text-left rounded-lg overflow-hidden ${height} mb-2`}>
                {dataWithPercentages.map((item, index) => {
                    // Solo mostrar si tiene un porcentaje significativo (> 0.5%)
                    if (item.percentage < 0.5) return null;
                    
                    return (
                        <div
                            key={`${item.name}-${index}`}
                            className={`${item.color} relative flex items-center
                             justify-start p-3 transition-all duration-300 hover:opacity-80 py-2`}
                            style={{ 
                                width: `${item.percentage}%`,
                                minWidth: item.percentage > 0 ? '8px' : '0px'
                            }}
                            title={`${item.name}: ${item.value} (${item.percentage.toFixed(1)}%)`}
                        >
                            {/* Valor dentro de la barra */}
                            {showValuesInBars && item.percentage >= minWidthForText && (
                                <span className="text-xs font-medium text-white drop-shadow-sm px-1">
                                    {item.value}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Etiquetas debajo - Nueva implementación alineada con las barras */}
            {showLabels && (
                <div className="flex justify-start">
                    {dataWithPercentages.map((item, index) => {
                        // Solo mostrar etiquetas para items significativos
                        if (item.percentage < 0.5) return null;
                        
                        return (
                            <div 
                                key={`label-${item.name}-${index}`}
                                className="flex items-center justify-start"
                                style={{ 
                                    width: `${item.percentage}%`,
                                    minWidth: item.percentage > 0 ? '8px' : '0px'
                                }}
                            >
                                <span 
                                    className={`${labelClassName} truncate px-1`}
                                    title={item.name}
                                    style={{ 
                                        maxWidth: '100%'
                                    }}
                                >
                                    {item.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PlanChart;