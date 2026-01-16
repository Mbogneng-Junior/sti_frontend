"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  trend?: {
    value: number;
    period: string;
  };
};

export const DashboardStatCard = ({ title, value, icon: Icon, iconColor, iconBgColor, trend }: Props) => {
  return (
    <Card className="overflow-hidden border-0 shadow-[0_2px_15px_rgb(0,0,0,0.08)] rounded-xl hover:shadow-[0_4px_20px_rgb(0,0,0,0.12)] transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>+{trend.value}% {trend.period}</span>
              </div>
            )}
          </div>
          <div className={`rounded-xl p-3 ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
