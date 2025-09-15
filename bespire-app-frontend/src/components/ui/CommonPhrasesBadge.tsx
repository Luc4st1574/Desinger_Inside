import React from "react";

// 1. Definimos la paleta de colores que mencionaste.
// Usamos un Set para asegurar que no haya colores duplicados y luego lo convertimos a un array.
const colorPalette = Array.from(
  new Set(["#F3FEE7", "#DEFCBD", "#DEFCBD", "#F0F3F4", "#FEEDCF", "#FEEDCF"])
);

// Función helper para obtener un color aleatorio de la paleta
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex];
};

interface CommonPhrasesBadgeProps {
  phrase: string;
  className?: string;
  variant?: "default" | "colored" | "outlined";
  size?: "sm" | "md" | "lg";
  // El icono ya no es necesario si la única función es mostrar la frase con un color
}

const CommonPhrasesBadge: React.FC<CommonPhrasesBadgeProps> = ({
  phrase,
  className = "",
  variant = "default",
  size = "md",
}) => {
  // 2. Usamos useState con una función de inicialización.
  // Esto asegura que el color aleatorio se genere SÓLO UNA VEZ,
  // cuando el componente se monta por primera vez.
  const [badgeColor] = React.useState(getRandomColor);

  // Estilos base según el tamaño
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  // 3. La función de variantes ahora usa el color aleatorio del estado.
  const getVariantStyles = () => {
    switch (variant) {
      case "colored":
        return {
          // El borde es transparente para que el color de fondo sea el protagonista
          className: "border-transparent",
          style: { backgroundColor: badgeColor },
        };
      case "outlined":
        return {
          className: "bg-transparent border border-[#3F4744] hover:bg-gray-50",
          style: {},
        };
      case "default":
      default:
        return {
          className: "border border-gray-200 bg-gray-100",
          style: {},
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <span
      className={`inline-flex items-center justify-center text-green-gray-700 rounded-full font-medium transition-colors ${sizeClasses[size]} ${variantStyles.className} ${className}`}
      style={variantStyles.style}
      title={phrase}
    >
      {phrase}
    </span>
  );
};

export default CommonPhrasesBadge;