import React, { useState } from 'react';
import { MapPin, Navigation, Zap, AlertTriangle } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'idle' | 'alert' | 'maintenance';
  driver: string;
  speed: number;
  lastUpdate: string;
}

interface InteractiveMapProps {
  vehicles: Vehicle[];
  onVehicleSelect?: (vehicle: Vehicle) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ vehicles, onVehicleSelect }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'alert': return 'bg-red-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Navigation className="w-3 h-3 text-white" />;
      case 'idle': return <MapPin className="w-3 h-3 text-white" />;
      case 'alert': return <AlertTriangle className="w-3 h-3 text-white" />;
      case 'maintenance': return <Zap className="w-3 h-3 text-white" />;
      default: return <MapPin className="w-3 h-3 text-white" />;
    }
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    onVehicleSelect?.(vehicle);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Fleet Map</h3>
          <div className="text-sm text-gray-500">{vehicles.length} vehicles</div>
        </div>
        
        {/* Mock Map Container */}
        <div className="relative bg-blue-50 rounded-lg h-96 overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Vehicle Markers */}
          {vehicles.map((vehicle, index) => {
            // Position vehicles in a grid-like pattern for demo
            const x = 15 + (index % 4) * 20;
            const y = 15 + Math.floor(index / 4) * 25;
            
            return (
              <div
                key={vehicle.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => handleVehicleClick(vehicle)}
              >
                <div className={`w-8 h-8 rounded-full ${getStatusColor(vehicle.status)} flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                  {getStatusIcon(vehicle.status)}
                </div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap">
                  {vehicle.name}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Idle</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Alert</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-gray-600">Maintenance</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Vehicle Details Panel */}
      {selectedVehicle && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{selectedVehicle.name}</h4>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Driver:</span>
              <span className="ml-1 text-gray-900">{selectedVehicle.driver}</span>
            </div>
            <div>
              <span className="text-gray-500">Speed:</span>
              <span className="ml-1 text-gray-900">{selectedVehicle.speed} mph</span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span className={`ml-1 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedVehicle.status)} text-white`}>
                {selectedVehicle.status}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Update:</span>
              <span className="ml-1 text-gray-900">{selectedVehicle.lastUpdate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};