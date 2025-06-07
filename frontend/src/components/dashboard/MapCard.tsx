import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'vehicle' | 'incident' | 'geofence';
  status?: string;
}

interface MapCardProps {
  locations: MapLocation[];
  title?: string;
  height?: string;
}

export const MapCard: React.FC<MapCardProps> = ({ 
  locations, 
  title = "Location Overview",
  height = "h-64"
}) => {
  const getLocationColor = (type: string, status?: string) => {
    if (type === 'vehicle') {
      switch (status) {
        case 'active': return 'bg-green-500';
        case 'idle': return 'bg-yellow-500';
        case 'alert': return 'bg-red-500';
        default: return 'bg-blue-500';
      }
    }
    if (type === 'incident') return 'bg-red-600';
    if (type === 'geofence') return 'bg-purple-500';
    return 'bg-gray-500';
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Navigation className="w-3 h-3 text-white" />;
      case 'incident': return <span className="text-white text-xs">!</span>;
      case 'geofence': return <span className="text-white text-xs">G</span>;
      default: return <MapPin className="w-3 h-3 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">{locations.length} locations</span>
      </div>
      
      {/* Simple Map Representation */}
      <div className={`relative bg-blue-50 rounded-lg ${height} overflow-hidden`}>
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200"></div>
        </div>
        
        {/* Location Markers */}
        {locations.map((location, index) => {
          // Simple positioning logic for demo
          const x = 20 + (index % 3) * 30;
          const y = 20 + Math.floor(index / 3) * 30;
          
          return (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${Math.min(x, 80)}%`, 
                top: `${Math.min(y, 80)}%` 
              }}
            >
              <div 
                className={`w-6 h-6 rounded-full ${getLocationColor(location.type, location.status)} flex items-center justify-center shadow-lg`}
                title={location.name}
              >
                {getLocationIcon(location.type)}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
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
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-600">Geofence</span>
        </div>
      </div>
    </div>
  );
};