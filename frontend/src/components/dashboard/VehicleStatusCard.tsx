import React from 'react';
import { Car, AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  driver?: string;
  status: 'active' | 'idle' | 'maintenance' | 'alert' | 'offline';
  location?: string;
  lastUpdate: string;
  mileage?: number;
  fuelLevel?: number;
}

interface VehicleStatusCardProps {
  vehicles: Vehicle[];
  title?: string;
}

export const VehicleStatusCard: React.FC<VehicleStatusCardProps> = ({ 
  vehicles,
  title = "Vehicle Status"
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'idle': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'offline': return <Car className="w-4 h-4 text-gray-400" />;
      default: return <Car className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'idle': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'alert': return 'bg-red-100 text-red-800 border-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">{vehicles.length} vehicles</span>
      </div>
      
      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {['active', 'idle', 'maintenance', 'alert', 'offline'].map((status) => (
          <div key={status} className="text-center">
            <div className="flex items-center justify-center mb-1">
              {getStatusIcon(status)}
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {statusCounts[status] || 0}
            </div>
            <div className="text-xs text-gray-500 capitalize">{status}</div>
          </div>
        ))}
      </div>
      
      {/* Vehicle List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Car className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{vehicle.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {vehicle.driver && <span>Driver: {vehicle.driver}</span>}
                  {vehicle.location && <span> • {vehicle.location}</span>}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              {getStatusIcon(vehicle.status)}
              <div className="text-xs text-gray-500 mt-1">
                {vehicle.lastUpdate}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {vehicles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Car className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p>No vehicles found</p>
        </div>
      )}
    </div>
  );
};