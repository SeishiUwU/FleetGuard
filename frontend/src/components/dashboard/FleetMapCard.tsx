import React from 'react';

interface VehicleLocation {
  id: string;
  vehicle: string;
  company: string;
  status: 'active' | 'alert' | 'offline';
}

interface FleetMapCardProps {
  vehicleLocations: VehicleLocation[];
}

export const FleetMapCard: React.FC<FleetMapCardProps> = ({ vehicleLocations }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'alert': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const statusCounts = vehicleLocations.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Fleet Map</h3>
        <p className="text-sm text-gray-500">Real-time vehicle tracking</p>
      </div>
      
      {/* Simple map with vehicle dots */}
      <div className="relative bg-blue-100 h-32 rounded-lg mb-4 overflow-hidden">
        {vehicleLocations.slice(0, 6).map((vehicle, index) => {
          const positions = [
            { top: '20%', left: '25%' },
            { top: '30%', right: '20%' },
            { bottom: '25%', right: '30%' },
            { bottom: '20%', left: '40%' },
            { top: '60%', left: '60%' },
            { top: '40%', right: '50%' }
          ];
          
          const position = positions[index] || { top: '50%', left: '50%' };
          
          return (
            <div 
              key={vehicle.id} 
              className="absolute"
              style={position}
            >
              <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div>
        <div className="text-xs text-gray-600 mb-2">Legend</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Active</span>
            </div>
            <span className="text-gray-500">{statusCounts.active || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Alert</span>
            </div>
            <span className="text-gray-500">{statusCounts.alert || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-gray-600">Offline</span>
            </div>
            <span className="text-gray-500">{statusCounts.offline || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};