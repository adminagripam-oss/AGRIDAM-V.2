"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { BarChart2, Users, TrendingUp } from "lucide-react";

/**
 * SideTrack component – a compact vertical panel displayed on the right side of the dashboard.
 * It provides quick‑access widgets such as summary stats, recent activity, or shortcuts.
 * The layout already renders this component with `className="hidden xl:block w-48 ml-6"`,
 * so we keep the markup lightweight and responsive.
 */
export function SideTrack({ className }: { className?: string }) {
  return (
    <aside className={"flex flex-col space-y-4 " + (className || "") }>
      {/* Example Card 1 – KPI Overview */}
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            <BarChart2 className="w-4 h-4" /> KPI Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs">
          <div className="flex justify-between">
            <span>Plantations</span>
            <span className="font-semibold text-green-600">124</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Harvest (t)</span>
            <span className="font-semibold text-green-600">3 842</span>
          </div>
        </CardContent>
      </Card>

      {/* Example Card 2 – Recent Users */}
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            <Users className="w-4 h-4" /> Recent Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs space-y-1">
          <ul className="list-disc list-inside">
            <li>Rita – Aceh</li>
            <li>Andi – Sumut 1</li>
            <li>Bayu – Riau 3</li>
          </ul>
        </CardContent>
      </Card>

      {/* Example Card 3 – Trends */}
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-xs">
          <p className="text-green-600">+8% YoY Harvest</p>
          <p className="text-red-600 mt-1">-2% Defect Rate</p>
        </CardContent>
      </Card>
    </aside>
  );
}
