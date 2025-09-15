/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/components/clients/ClientList.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";

// Importa el nuevo componente de tabla
import DataTable, { Column } from "../ui/DataTable";

// Importa los componentes necesarios para el renderizado de celdas
import StarRating from "../ui/StarRating";
import ActionMenu, { ActionMenuItem } from "../ui/ActionMenu";

// Importa los modales
import { TeamListAdmin, useTeamListAdmin } from "@/hooks/team/useListTeamAdmin";
import AddTeamMemberModal from "../modals/team/AddTeamMemberModal";
import TeamDetailModal from "../modals/team/TeamDetailModal";
import { Edit, Trash } from "lucide-react";


export default function TeamList() {
  const { team_members, loading, error, refetch } = useTeamListAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");


 const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | undefined>(undefined);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | number | null>(
    null
  );

  // Opciones para el dropdown de filtro
  const statusFilterOptions = [
    { value: "all", label: "Filter" },
    { value: "new", label: "New" },
    { value: "recurring", label: "Recurring" },
  ];


  const handleRowClick = (team: any) => {
    setSelectedTeamId(team.id);
    setIsDetailModalOpen(true);
  };


  const handleDeleteTeam = (teamId: string | number) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      console.log("Deleting team:", teamId);
    }
  };

  // Definición de las columnas para la tabla de clientes
 // Columnas para Team optimizadas
const columns: Column<TeamListAdmin>[] = [
  {
    header: "Name",
    accessor: "name",
    minWidth: "220px", // Espacio mínimo para imagen + texto
    maxWidth: "280px", // Evita que se haga demasiado ancho
    render: (team) => (
      <div className="flex items-center">
        <img
          className="w-10 h-10 rounded-full flex-shrink-0"
          src={
            team.avatarUrl
              ? team.avatarUrl
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  team.name
                )}&background=e5e7eb&color=374151`
          }
          alt={team.name}
        />
        <div className="ml-4 min-w-0"> {/* min-w-0 para permitir truncate */}
          <div className="text-sm font-medium text-[#353B38] truncate">
            {team.name}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {team.roleTitle || "Team Member"}
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "KPI",
    accessor: "kpi",
    minWidth: "70px",
    maxWidth: "90px",
    render: (team) => (
      <div className="text-sm text-[#353B38] font-medium">
        {team.kpi ?? "N/A"}%
      </div>
    ),
  },
  {
    header: "Ave Rating",
    accessor: "rating", 
    minWidth: "100px",
    maxWidth: "120px",
    render: (team) => <StarRating rating={team.rating} />,
  },
  {
    header: "Tasks",
    accessor: "tasks",
    minWidth: "90px",
    maxWidth: "110px",
    render: (team) => (
      <div className="text-sm text-[#353B38]">
        {team.tasks ?? "N/A"} tasks
      </div>
    ),
  },
  { 
    header: "Work Hours", 
    accessor: "workHours", 
    minWidth: "100px",
    maxWidth: "120px",
    render: (team) => (
      <div className="text-sm text-[#353B38]">
        {team.workHours}
      </div>
    ),
  },
  { 
    header: "Time/Request", 
    accessor: "timeRequest", 
    minWidth: "110px",
    maxWidth: "130px",
    render: (team) => (
      <div className="text-sm text-[#353B38]">
        {team.timeRequest}
      </div>
    ),
  },
  { 
    header: "Accept Time", 
    accessor: "acceptTime", 
    minWidth: "100px",
    maxWidth: "120px",
    render: (team) => (
      <div className="text-sm text-[#353B38]">
        {team.acceptTime}
      </div>
    ),
  },
  { 
    header: "Response Time", 
    accessor: "response", 
    minWidth: "110px",
    maxWidth: "130px",
    render: (team) => (
      <div className="text-sm text-[#353B38]">
        {team.response}
      </div>
    ),
  },
  {
    header: "Revisions",
    accessor: "revisions",
    minWidth: "90px",
    maxWidth: "110px",
    render: (team) => (
      <div className="text-sm text-[#353B38]">
        {team.revisions ?? 0} revisions
      </div>
    ),
  },
  {
    header: "Late Rate",
    accessor: "lateRate",
    minWidth: "80px",
    maxWidth: "100px",
    render: (team) => (
      <div className="text-sm text-[#353B38] font-medium">
        {team.lateRate ?? 0}%
      </div>
    ),
  },
  {
    header: "Actions",
    accessor: "actions",
    minWidth: "60px",
    maxWidth: "80px",
    sticky: "right", 
    render: (team) => {
      const menuItems: ActionMenuItem[] = [
        {
          label: "Edit",
          icon: <Edit size={14} />,
          action: () => {
            console.log("Editing user:", team.id);
            setEditingUserId(team.id);
            setOpenEdit(true);
          }
        },
        {
          label: "Delete",
          icon: <Trash size={14} />,
          action: () => handleDeleteTeam(team.id),
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
        title="Team Members"
        data={team_members}
        columns={columns}
        isLoading={loading}
        error={error}
        itemCount={team_members.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search a team member"
        filterOptions={statusFilterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onAddButtonClick={() => setOpenCreate(true)}
        onRowClick={handleRowClick}
        onRetry={refetch}
      />

      {/* Create */}
      <AddTeamMemberModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        mode="create"
        onDone={() => refetch()}
      />

      {/* Edit */}
      <AddTeamMemberModal
        isOpen={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setEditingUserId(undefined);
        }}
        mode="edit"
        userIdToEdit={editingUserId}
        onDone={() => refetch()}
      />

 {selectedTeamId && (
        <TeamDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          memberId={selectedTeamId}
        />
      )}

    </>
  );
}
