import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface VehicleData {
  vehicle: string;
  actions: number;
}

interface EventData {
  name: string;
  value: number;
  color: string;
}

interface ChartsSectionProps {
  vehicleData: VehicleData[];
  eventData: EventData[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ vehicleData, eventData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Top Vehicles by Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top vehicles by actions committed</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vehicleData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="vehicle" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value, 'Actions']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="actions" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Event Types Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Event types distribution</h3>
        <div className="flex items-center">
          <div className="w-3/5">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {eventData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, 'Events']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-2/5 pl-4">
            {eventData.map((entry, index) => (
              <div key={index} className="flex items-center mb-2">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}</span>
                <span className="text-sm text-gray-500 ml-auto">({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};