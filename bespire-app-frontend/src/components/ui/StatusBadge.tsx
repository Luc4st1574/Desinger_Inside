import React from 'react';

type StatusType = 'Active' | 'Inactive' | 'Expired' | 'Draft';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = (status: StatusType) => {
    switch (status) {
      case 'Active':
        return {
          backgroundColor: '#F1F3EE', 
          textColor: 'text-green-bg-700', // Verde oscuro
          dotColor: 'bg-green-bg-700' // Verde para el punto
        };
      case 'Expired':
        return {
          backgroundColor: '#FFE8E8', // Rojo claro
          textColor: 'text-red-red-800', // Rojo oscuro
          dotColor: 'bg-red-red-800' // Rojo para el punto
        };
      case 'Inactive':
        return {
       backgroundColor: '#FFE8E8', // Rojo claro
          textColor: 'text-red-red-800', // Rojo oscuro
          dotColor: 'bg-red-red-800' // Rojo para el punto
        };
      case 'Draft':
        return {
          backgroundColor: '#F6F7F7', // Gris claro
          textColor: 'text-green-gray-800', // Gris oscuro
          dotColor: 'bg-green-gray-800' // Gris para el punto
        };
      default:
        return {
          backgroundColor: '#F6F7F7',
          textColor: 'text-green-gray-800',
          dotColor: 'bg-green-gray-800'
        };
    }
  };

  const styles = getStatusStyles(status);

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${styles.textColor} ${className}`}
      style={{ backgroundColor: styles.backgroundColor }}
    >
      <div className={`w-2 h-2 rounded-full ${styles.dotColor}`} />
      {status}
    </div>
  );
};

export default StatusBadge;
