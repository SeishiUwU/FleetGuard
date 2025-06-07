import React from 'react';
import { FleetMapCard } from './FleetMapCard';

// Local types to avoid import issues
interface DashboardStats {
  activeVehicles: number;
  clipsRecordedToday: number;
  totalClips: number;
  safetyScore: number;
  weeklyScores: number[];
  improvementPoints: number;
}

interface VehicleLocation {
  id: string;
  vehicle: string;
  company: string;
  status: 'active' | 'alert' | 'offline';
}

interface AtAGlanceSectionProps {
  stats: DashboardStats;
  vehicleLocations: VehicleLocation[];
}

export const AtAGlanceSection: React.FC<AtAGlanceSectionProps> = ({ stats, vehicleLocations }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">At a glance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Vehicles Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.activeVehicles}
            </div>
            <div className="text-sm text-gray-500">Active vehicles</div>
          </div>
        </div>

        {/* Clips Recorded Today Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.clipsRecordedToday}
            </div>
            <div className="text-sm text-gray-500">Clips recorded today</div>
          </div>
        </div>

        {/* Fleet Map Card */}
        <FleetMapCard vehicleLocations={vehicleLocations} />
      </div>
    </div>
  );
};