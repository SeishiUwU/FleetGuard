import React from 'react';

interface StatItem {
  title: string;
  value: string;
}

interface StatsCardsProps {
  statsData: StatItem[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ statsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};