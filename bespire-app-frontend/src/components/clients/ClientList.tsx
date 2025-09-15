/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/components/clients/ClientList.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import { useClientsListAdmin } from "@/hooks/clients/useListClientsAdmin";

// Importa el nuevo componente de tabla
import DataTable, { Column } from "../ui/DataTable";

// Importa los componentes necesarios para el renderizado de celdas
import PlanBadge from "../ui/PlanBadge";
import StarRating from "../ui/StarRating";
import ActionMenu, { ActionMenuItem } from "../ui/ActionMenu";

// Importa los modales
import AddClientModal from "../modals/AddClientModal";
import ClientDetailModal from "../modals/ClientDetailModal";
import { Edit, Trash } from "lucide-react";

// Define un tipo para tus objetos de cliente para mayor claridad
// Deberías ajustar esto según la estructura real de tus datos
type Client = {
  id: string | number;
  name: string;
  roleTitle?: string;
  companyName: string;
  plan?: { name: string; icon: string };
  rating: number;
  timeRequest: string;
  revisions: number;
  lastSession?: string;
  contractStart?: string;
  status: "new" | "recurring";
};

export default function ClientList() {
  const { clients, loading, error, refetch } = useClientsListAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<
    string | number | null
  >(null);

  // Opciones para el dropdown de filtro
  const statusFilterOptions = [
    { value: "all", label: "Filter" },
    { value: "new", label: "New" },
    { value: "recurring", label: "Recurring" },
  ];

  // Lógica de filtrado de clientes
  const filteredClients = useMemo(() => {
    return (clients || []).filter(
      //@ts-ignore
      (client: Client) =>
        (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.companyName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || client.status.toLowerCase() === statusFilter)
    );
  }, [clients, searchTerm, statusFilter]);

  // --- Manejadores de eventos ---
  const handleAddClient = (clientData: Record<string, unknown>) => {
    console.log("Adding client:", clientData);
    refetch(); // Refresca la lista
  };

  const handleRowClick = (client: Client) => {
    setSelectedClientId(client.id);
    setIsDetailModalOpen(true);
  };

  const handleEditClient = (clientId: string | number) => {
    console.log("Editing client:", clientId);
  };

  const handleDeleteClient = (clientId: string | number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      console.log("Deleting client:", clientId);
    }
  };

  const getStatusBadge = (status: string) => {
    const colorClasses =
      {
        new: "bg-[#F6F8F5] text-[#4C604B]",
        recurring: "bg-[#F3FEE7] text-[#566644]",
      }[status.toLowerCase()] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}
      >
        <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></span>
        {status}
      </span>
    );
  };

  const formatDate = (dateString?: string | null): string | null => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

const columns: Column<Client>[] = [
  {
    header: "Client Name",
    accessor: "name",
    minWidth: "240px", // Espacio mínimo para imagen + texto
    maxWidth: "320px", // Evita que se haga demasiado ancho
    render: (client) => (
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full flex-shrink-0"
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            client.name
          )}&background=e5e7eb&color=374151`}
          alt={client.name}
        />
        <div className="ml-4 min-w-0"> {/* min-w-0 para permitir truncate */}
          <div className="text-sm font-medium text-[#353B38] truncate">
            {client.name}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {client.roleTitle || "Client"}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Plan",
    accessor: "plan",
    minWidth: "100px",
    maxWidth: "120px",
    render: (client) => (
      <PlanBadge name={client.plan?.name || null} icon={client.plan?.icon} />
    ),
  },
  { 
    header: "Organization(s)", 
    accessor: "companyName", 
    minWidth: "150px",
    maxWidth: "200px",
    render: (client) => (
      <div className="text-sm text-[#353B38] truncate" title={client.companyName}>
        {client.companyName}
      </div>
    ),
  },
  {
    header: "Ave Rating",
    accessor: "rating",
    minWidth: "120px",
    maxWidth: "140px",
    render: (client) => <StarRating rating={client.rating} />,
  },
  { 
    header: "Time/Request", 
    accessor: "timeRequest", 
    minWidth: "100px",
    maxWidth: "120px",
    render: (client) => (
      <div className="text-sm text-[#353B38]">
        {client.timeRequest}
      </div>
    ),
  },
  { 
    header: "Revisions", 
    accessor: "revisions", 
    minWidth: "80px",
    maxWidth: "100px",
    render: (client) => (
      <div className="text-sm text-[#353B38]">
        {client.revisions}
      </div>
    ),
  },
  {
    header: "Last Session",
    accessor: "lastSession",
    minWidth: "120px",
    maxWidth: "140px",
    render: (client) => (
      <div className="text-sm text-[#7A8882]">
        {formatDate(client?.lastSession) ?? "—"}
      </div>
    ),
  },
  {
    header: "Contract Start",
    accessor: "contractStart",
    minWidth: "120px",
    maxWidth: "140px",
    render: (client) => (
      <div className="text-sm text-[#7A8882]">
        {formatDate(client?.contractStart) ?? "—"}
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    minWidth: "100px",
    maxWidth: "120px",
    render: (client) => getStatusBadge(client.status),
  },
  {
    header: "Actions",
    accessor: "actions",
    minWidth: "60px",
    maxWidth: "80px",
    sticky: "right",
    render: (client) => {
      const menuItems: ActionMenuItem[] = [
        {
          label: "Edit",
          icon: <Edit size={14} />,
          action: () => handleEditClient(client.id), 
        },
        {
          label: "Delete",
          icon: <Trash size={14} />,
          action: () => handleDeleteClient(client.id), 
          isDanger: true,
          hasSeparator: true,
        },
      ];

      return (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex justify-center"
        >
          <ActionMenu items={menuItems} />
        </div>
      );
    },
  },
];

  return (
    <>
      <DataTable
        title="Clients"
        data={filteredClients}
        columns={columns}
        isLoading={loading}
        error={error}
        itemCount={filteredClients.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search a client"
        filterOptions={statusFilterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onAddButtonClick={() => setIsAddModalOpen(true)}
        onRowClick={handleRowClick}
        onRetry={refetch}
      />

      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddClient}
        clients={clients}
        loadingClients={loading}
        refetchClients={refetch}
      />

      {selectedClientId && (
        <ClientDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          clientId={selectedClientId}
        />
      )}
    </>
  );
}
