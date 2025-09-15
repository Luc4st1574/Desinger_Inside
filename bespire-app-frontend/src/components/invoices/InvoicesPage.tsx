"use client";

import { LayoutGrid, List, ArrowLeft } from "lucide-react";
import { useState } from "react";
import DataTable, { Column } from "@/components/ui/DataTable";
import { useInvoices, useClientInvoices } from "@/hooks/useInvoices";
import { type Client, type Invoice, formatCurrency } from "@/mocks/invoices";

export default function InvoicesPage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const { clients, isLoading: clientsLoading, error: clientsError } = useInvoices();
  const { invoices, isLoading: invoicesLoading, error: invoicesError } = useClientInvoices(
    selectedClient?.id || ""
  );

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.successManager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.mainContact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Client table columns
  const clientColumns: Column<Client>[] = [
    {
      header: "Client Name",
      accessor: "name",
      render: (client) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
            {client.logo}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{client.name}</span>
           
          </div>
        </div>
      ),
      minWidth: "200px"
    },
    {
      header: "Success Manager",
      accessor: "successManager",
      render: (client) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium">
              {client.successManager.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm text-gray-900">{client.successManager.name}</span>
        </div>
      ),
      minWidth: "180px"
    },
    {
      header: "Main Point of Contact",
      accessor: "mainContact",
      render: (client) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium">
              {client.mainContact.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-sm text-gray-900">{client.mainContact.name}</span>
        </div>
      ),
      minWidth: "200px"
    },
    {
      header: "Contract Start",
      accessor: "contractStart",
      render: (client) => (
        <span className="text-sm text-gray-900">{client.contractStart}</span>
      ),
      minWidth: "120px"
    },
    {
      header: "Contract Renew",
      accessor: "contractRenew",
      render: (client) => (
        <span className="text-sm text-gray-900">{client.contractRenew}</span>
      ),
      minWidth: "120px"
    }
  ];

  // Invoice table columns
  const invoiceColumns: Column<Invoice>[] = [
    {
      header: "Date",
      accessor: "date",
      render: (invoice) => (
        <span className="text-sm text-gray-900">{invoice.date}</span>
      ),
      minWidth: "120px"
    },
    {
      header: "Plan",
      accessor: "plan",
      render: (invoice) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900">{invoice.plan}</span>
        </div>
      ),
      minWidth: "100px"
    },
    {
      header: "Invoice Total",
      accessor: "total",
      render: (invoice) => (
        <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</span>
      ),
      minWidth: "120px"
    },
    {
      header: "Status",
      accessor: "status",
      render: (invoice) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            invoice.status === 'Paid' ? 'bg-[#62864D]' : 
            invoice.status === 'Pending' ? 'bg-yellow-500' : 
            invoice.status === 'Overdue' ? 'bg-red-500' : 'bg-gray-500'
          }`}></div>
          <span className="text-sm text-[#62864D]">{invoice.status}</span>
        </div>
      ),
      minWidth: "100px"
    },
    {
      header: "Actions",
      accessor: "id",
      render: () => (
        <div className="flex items-center gap-2">
          <button className="text-sm text-blue-600 hover:text-blue-800 underline">
            View
          </button>
          <button className="text-sm text-blue-600 hover:text-blue-800 underline">
            Download
          </button>
        </div>
      ),
      minWidth: "120px",
    }
  ];

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
    setSearchTerm(""); // Reset search when switching to invoices
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
    setSearchTerm(""); // Reset search when going back
  };

  const handleAddClick = () => {
    if (selectedClient) {
      console.log("Add new invoice for client:", selectedClient.name);
    } else {
      console.log("Add new client");
    }
  };

  // Show client invoices table
  if (selectedClient) {
    return (
      <section className="p-4 mx-auto max-w-[--breakpoint-2xl] md:p-6 flex flex-col gap-6">
        {/* Header with back button */}
        <div className="w-full flex items-center justify-between">
          <div className="flex flex-col items-start gap-4">
            <button
              onClick={handleBackToClients}
              className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h2 className="text-2xl font-medium text-gray-900">
              {selectedClient.name} Invoices
            </h2>
          </div>
        </div>

        {/* Invoices Table */}
        <DataTable
          title=""
          data={filteredInvoices}
          columns={invoiceColumns}
          isLoading={invoicesLoading}
          error={invoicesError ? { message: invoicesError } : null}
          itemCount={filteredInvoices.length}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search invoices..."
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          onAddButtonClick={handleAddClick}
          onRowClick={(invoice) => console.log("Invoice clicked:", invoice)}
          showHeader={false}
        headerClassName="bg-transparent"
        bodyClassName="bg-transparent"
        wrapperClassName="bg-transparent"
        />
      </section>
    );
  }

  // Show clients table
  return (
    <section className="p-4 mx-auto max-w-[--breakpoint-2xl] md:p-6 flex flex-col gap-6">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl font-medium text-gray-900">All Clients</h2>
        <div className="flex items-center bg-white rounded-full border-2 border-[#CEFFA3] p-1">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`px-4 py-1 text-sm font-medium flex items-center gap-2 rounded-full transition-colors duration-200 ${
              view === "list"
                ? "bg-[#CEFFA3] shadow-sm text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
            List
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`px-4 py-1 text-sm font-medium flex items-center gap-2 rounded-full transition-colors duration-200 ${
              view === "grid"
                ? "bg-[#CEFFA3] shadow-sm text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <DataTable
        title=""
        data={filteredClients}
        columns={clientColumns}
        isLoading={clientsLoading}
        error={clientsError ? { message: clientsError } : null}
        itemCount={filteredClients.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search clients..."
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onAddButtonClick={handleAddClick}
        onRowClick={handleClientClick}
        showHeader={false}
        headerClassName="bg-transparent"
        bodyClassName="bg-transparent"
        wrapperClassName="bg-transparent"
      />
    </section>
  );
}
