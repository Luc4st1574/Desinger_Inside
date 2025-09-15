"use client";

import { useState } from "react";
import DataTable, { Column } from "../ui/DataTable";
import GenericTabs from "../ui/GenericTabs";
import { useTemplates } from "@/hooks/templates/useTemplates";
import { Template, templateCategories } from "@/mocks/templates";
import TemplateDetailsModal from "../modals/TemplateDetailsModal";
import AddEditTemplateModal from "../modals/AddEditTemplateModal";
import Image from "next/image";
  import AllIcon from "@/assets/icons/icon_dashboard.svg";
  import GeneralIcon from "@/assets/icons/requests.svg";
  import BrandingIcon from "@/assets/icons/branding.svg";
  import MarketingIcon from "@/assets/icons/completed.svg";
  import UiuxIcon from "@/assets/icons/focus6.svg";
import CommonPhrasesBadge from "../ui/CommonPhrasesBadge";
import StatusBadge from "../ui/StatusBadge";
export default function TemplatesList() {
  const { templates, loading, searchTemplates, filterByCategory } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewDetails = (template: Template) => {
    setSelectedTemplate(template);
    setIsDetailsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTemplate(null);
    setIsAddEditModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setEditingTemplate(null);
  };

  const handleEditFromDetails = (template: Template) => {
    setIsDetailsModalOpen(false);
    setEditingTemplate(template);
    setIsAddEditModalOpen(true);
  };

  const handleSubmitTemplate = async (data: {
    title: string;
    type: string;
    description: string;
    visibility: string;
    status: string;
    file?: FileList;
    link?: string;
  }) => {
    // Here you would normally send data to your API
    console.log("Submitting template:", data);
    // For now, just close the modal
    handleCloseAddEditModal();
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    filterByCategory(tabValue);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchTemplates(query);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Active: "bg-green-100 text-green-800",
      Draft: "bg-gray-100 text-gray-800", 
      Expired: "bg-red-100 text-red-800",
      Inactive: "bg-yellow-100 text-yellow-800"
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || statusStyles.Draft}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const cleanType = type.replace(' Templates', '');
    const typeStyles = {
      General: "bg-blue-100 text-blue-800",
      Branding: "bg-purple-100 text-purple-800",
      Marketing: "bg-orange-100 text-orange-800", 
      "UI/UX": "bg-green-100 text-green-800"
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${typeStyles[cleanType as keyof typeof typeStyles] || typeStyles.General}`}>
        {cleanType}
      </span>
    );
  };

  const columns: Column<Template>[] = [
    {
      header: "Template Title",
      accessor: "title",
      render: (template) => (
        <button
          onClick={() => handleViewDetails(template)}
          className="text-left hover:text-green-600 transition-colors"
        >
          <div className="font-medium text-gray-900">{template.title}</div>
        </button>
      )
    },
    {
      header: "Type", 
      accessor: "type",
      render: (template) => <CommonPhrasesBadge phrase={template.type} variant="colored" />
    },
    {
      header: "Status",
      accessor: "status",
      render: (template) => <StatusBadge status={template.status} />
    },
    {
      header: "Times Used",
      accessor: "timesUsed",
      render: (template) => (
        <span className="text-gray-900">{template.timesUsed}</span>
      )
    },
    {
      header: "Visibility",
      accessor: "visibility",
      render: (template) => (
        <span className="text-gray-600">{template.visibility}</span>
      )
    },
    {
      header: "Created by",
      accessor: "createdBy",
      render: (template) => (
        <div className="flex items-center gap-2">
          <Image
            src={template.createdBy.avatar}
            alt={template.createdBy.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{template.createdBy.name}</div>
            <div className="text-xs text-gray-500">{template.createdBy.role}</div>
          </div>
        </div>
      )
    },
    {
      header: "Created on",
      accessor: "createdOn",
      render: (template) => (
        <span className="text-gray-600">{template.createdOn}</span>
      )
    },
    {
      header: "Last Updated",
      accessor: "lastUpdated",
      render: (template) => (
        <span className="text-gray-600">{template.lastUpdated}</span>
      )
    }
  ];


  

  
  // Template categories for filters
   const templateCategories = [
    { value: "all", label: "All", icon: <AllIcon className="h-5 w-5" /> },
    { value: "general", label: "General", icon: <GeneralIcon className="h-5 w-5" /> },
    { value: "branding", label: "Branding", icon: <BrandingIcon className="h-5 w-5" /> },
    { value: "marketing", label: "Marketing", icon: <MarketingIcon className="h-5 w-5" /> },
    { value: "uiux", label: "UI/UX", icon: <UiuxIcon className="h-5 w-5" />     }
  ];

  return (
    <div className="space-y-6">
      {/* Header with tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Template Library</h2>
        </div>
        
        <GenericTabs
          tabs={templateCategories.map(cat => ({
            id: cat.value,
            label: cat.label,
            icon: cat.icon
          }))}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Data Table */}
      <DataTable
        title="Templates"
        data={templates}
        columns={columns}
        itemCount={templates.length}
        isLoading={loading}
        searchTerm={searchQuery}
        onSearchChange={handleSearch}
        searchPlaceholder="Search a template"
        onAddButtonClick={handleAddNew}
        onRowClick={handleViewDetails}
      />

      {/* Modals */}
      <TemplateDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        template={selectedTemplate}
        onEdit={handleEditFromDetails}
      />

      <AddEditTemplateModal
        isOpen={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        template={editingTemplate}
        onSubmit={handleSubmitTemplate}
      />
    </div>
  );
}
