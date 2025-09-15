/* eslint-disable @next/next/no-img-element */
// src/components/ui/DataTable.tsx

import React from "react";
import Button from "./Button";
import Plus from "@/assets/icons/plus.svg"; // Íconos
import FilterIcon from "@/assets/icons/filter.svg";
import Dropdown, { DropdownItem } from "./Dropdown";
import { z } from "zod";

// Definimos los tipos para las props para que sea reutilizable y seguro
export interface Column<T> {
  header: string;
  accessor: keyof T | string; // La clave para acceder a los datos
  render?: (row: T) => React.ReactNode; // Función para renderizado personalizado
  minWidth?: string;
  // NUEVO: soporte para columnas fijas
  width?: string; // NUEVO: ancho fijo
  maxWidth?: string; // NUEVO: ancho máximo
  sticky?: "left" | "right";
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  error?: { message: string } | null;
  itemCount: number;

  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  filterOptions?: DropdownItem[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;

  onAddButtonClick?: () => void;
  onRowClick: (row: T) => void;
  onRetry?: () => void;

  // New customization props
  showHeader?: boolean;
  headerClassName?: string;
  bodyClassName?: string;
  wrapperClassName?: string; // Color de fondo del contenedor
}

// helpers para clases sticky
const stickyHeaderClasses = (sticky?: "left" | "right") => {
  if (sticky === "left")
    return "sticky left-0 z-20 bg-gray-50 border-r border-gray-200";
  if (sticky === "right")
    return "sticky right-0 z-20 bg-gray-50 border-l border-gray-200";
  return "";
};

const stickyCellClasses = (sticky?: "left" | "right") => {
  if (sticky === "left")
    return "sticky left-0 z-10 bg-white border-r border-gray-200";
  if (sticky === "right")
    return "sticky right-0 z-10 bg-white border-l border-gray-200";
  return "";
};

export default function DataTable<T extends { id: string | number }>({
  title,
  data,
  columns,
  isLoading = false,
  error = null,
  itemCount,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterOptions,
  selectedFilter,
  onFilterChange,
  onAddButtonClick,
  onRowClick,
  onRetry,
  showHeader = true,
  headerClassName = "bg-gray-50",
  bodyClassName = "bg-white",
  wrapperClassName = "bg-white border border-gray-200",
}: DataTableProps<T>) {
  console.log("DataTable render with data:", data);
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-8 text-center text-red-500">
        Error loading data: {error.message}
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 text-blue-500 hover:underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full ${wrapperClassName} rounded-lg  overflow-hidden`}
    >
      {/* Header */}
      {showHeader && (
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium text-[#353B38]">{title}</h2>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                {itemCount}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="#4C5652"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {filterOptions && (
                <Dropdown
                  items={filterOptions}
                  selectedValue={selectedFilter}
                  onSelect={(item) => onFilterChange(item.value)}
                  placeholder="Filter"
                  variant="outlineG"
                  size="md"
                  icon={FilterIcon}
                />
              )}

              <Button
                type="button"
                variant="green2"
                size="md"
                onClick={onAddButtonClick}
              >
                <div className="flex items-center gap-1">
                  <span className="text-base">Add</span>
                  <Plus className="w-5 h-5 text-white" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto max-h-[600px]">
        <table className="w-full ">
          <thead className={`${headerClassName} sticky top-0 z-10 `}>
            <tr className="relative z-0">
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-4 py-3 text-left text-sm font-medium text-gray-500 tracking-wider relative ${stickyHeaderClasses(
                    col.sticky
                  )} ${col.headerClassName || ""}`}
                  style={{
                    minWidth: col.minWidth || "auto",
                    width: col.width || "auto",
                    maxWidth: col.maxWidth || "auto",
                  }}
                >
                  {/* Sombra para columna sticky derecha */}
                  {col.sticky === "right" && (
                    <div
                      className="absolute inset-y-0 left-0 w-2 pointer-events-none"
                      style={{
                        boxShadow: "rgba(0,0,0,0.05) -4px -1px 6px 0px",
                      }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    {col.header}
                    <img
                      src="/assets/icons/ChevronDown.svg"
                      alt=""
                      className="h-2 w-2"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={`${bodyClassName} divide-y divide-gray-200 text-[#353B38]`}>
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 cursor-pointer "
                onClick={() => onRowClick(row)}
              >
                {columns.map((col) => (
                  <td
                    key={`${row.id}-${col.accessor}`}
                    className={`px-6 py-4 whitespace-nowrap relative ${stickyCellClasses(
                      col.sticky
                    )} ${col.cellClassName || ""}`}
                    style={{
                      minWidth: col.minWidth || "auto",
                      width: col.width || "auto",
                      maxWidth: col.maxWidth || "auto",
                    }}
                  >
                    {/* Sombra para columna sticky derecha */}
                    {col.sticky === "right" && (
                      <div
                        className="absolute inset-y-0 left-0 w-2 pointer-events-none"
                        style={{
                          boxShadow: "rgba(0,0,0,0.05) -4px -1px 6px 0px",
                        }}
                      />
                    )}
                    {col.render
                      ? col.render(row)
                      : (row[col.accessor as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
