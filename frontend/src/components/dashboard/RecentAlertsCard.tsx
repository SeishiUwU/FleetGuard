import React from 'react';
import { AlertTriangle, Clock, MapPin, ChevronRight } from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  vehicle: string;
  company: string;
  location: string;
  time: string;
}

interface RecentAlertsCardProps {
  alerts: Alert[];
}

export const RecentAlertsCard: React.FC<RecentAlertsCardProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
        {alerts.length > 0 && (
          <p className="text-sm text-gray-500">{alerts.length} alert{alerts.length !== 1 ? 's' : ''} in the last 24 hours</p>
        )}
      </div>
      
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`flex items-center justify-between p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === 'high' ? 'text-red-500' : 
                    alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{alert.type}</div>
                  <div className="text-sm text-gray-500">
                    {alert.company} • Vehicle {alert.vehicle} • Today at {alert.time}
                  </div>
                </div>
              </div>
              <div className="text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-medium">No recent alerts</p>
            <p className="text-sm">All vehicles are operating safely</p>
          </div>
        )}
      </div>
    </div>
  );
};