"use client";

import { ExpertSidebar } from "@/components/expert-sidebar";
import { Bell, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SettingsClient = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ExpertSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-sm text-gray-500 mt-1">Gérer vos préférences et paramètres</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <HelpCircle className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 py-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">Paramètres du compte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Les paramètres seront disponibles prochainement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
