// Configuración de tipos de requests comunes con sus iconos emoji
export interface CommonRequestType {
  id: string;
  name: string;
  icon: string;
  category?: string;
}

export const COMMON_REQUEST_TYPES: CommonRequestType[] = [
  {
    id: "graphic-design",
    name: "Graphic Design",
    icon: "🎨",
    category: "Design"
  },
  {
    id: "brand",
    name: "Brand",
    icon: "🏷️",
    category: "Brand"
  },
  {
    id: "content-and-social",
    name: "Content & Social",
    icon: "📲",
    category: "Content"
  },
  {
    id: "copywriting",
    name: "Copywriting",
    icon: "✍️",
    category: "Content"
  },
  {
    id: "email",
    name: "Email",
    icon: "📧",
    category: "Email"
  },
  {
    id: "motion-graphics",
    name: "Motion Graphics",
    icon: "�",
    category: "Motion"
  },
  {
    id: "paid-ads",
    name: "Paid Ads",
    icon: "�",
    category: "Ads"
  },
  {
    id: "web",
    name: "Web",
    icon: "🌐",
    category: "Web"
  }
];

// Función helper para encontrar un request type por nombre
export const findRequestTypeByName = (name: string): CommonRequestType | undefined => {
  return COMMON_REQUEST_TYPES.find(
    type => type.name.toLowerCase() === name.toLowerCase()
  );
};

// Función helper para obtener un request type con fallback
export const getRequestTypeWithFallback = (name: string): CommonRequestType => {
  const found = findRequestTypeByName(name);
  return found || {
    id: "other",
    name: name,
    icon: "🔧",
    category: "Other"
  };
};
