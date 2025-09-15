import React from 'react';
import Link from 'next/link';
import ClientCard, { Client } from './ClientCard';

interface ClientsSectionProps {
  clients: Client[];
  showViewAll?: boolean;
  title?: string;
  count?: number;
}

const ClientsSection: React.FC<ClientsSectionProps> = ({ 
  clients, 
  showViewAll = true, 
  title = "Clients",
  count 
}) => {
  const displayTitle = count ? `${title} (${count})` : title;
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-green-gray-500">
          {displayTitle}
        </h3>
        {showViewAll && (
          <Link 
            href="/clients" 
            className="text-base font-medium text-pale-green-700 underline"
          >
            View All
          </Link>
        )}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <ClientCard 
            key={client.id} 
            client={client}
            onClick={(id) => {
              // Aquí puedes manejar el click del cliente
              console.log('Client clicked:', id);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {clients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No clients found</p>
        </div>
      )}
    </div>
  );
};

export default ClientsSection;
