"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "sonner";
import AuthGuard from "@/guards/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = React.memo(({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <AuthGuard requireWorkspace>
        <div className="flex h-screen bg-[#fbfff7] text-sm text-brand-dark">
          {/* Permanent Left Navigation */}
          <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="w-64">
              <Sidebar />
            </div>
          </div>

          {/* Mobile Sidebar */}
          {isSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-black opacity-10"
                onClick={() => setIsSidebarOpen(false)}
              />
              <div className="relative flex flex-col w-64 bg-white">
                <Sidebar />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 min-w-0">
            <Header />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
            <Toaster
              position="bottom-right"
              expand={false}
              duration={3000}
              closeButton={false}
              className="z-[100]"
              toastOptions={{ unstyled: true }}
            />
          </div>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
});

DashboardLayout.displayName = "DashboardLayout";
export default DashboardLayout;