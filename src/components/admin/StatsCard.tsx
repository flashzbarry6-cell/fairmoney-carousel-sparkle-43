import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const StatsCard = ({ title, value, icon, trend, trendUp }: StatsCardProps) => {
  return (
    <Card className="bg-black/60 border-purple-500/30 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-purple-300 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-purple-600/20 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
};
