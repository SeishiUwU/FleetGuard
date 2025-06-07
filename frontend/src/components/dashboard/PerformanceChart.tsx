import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface PerformanceData {
  date: string;
  safetyScore: number;
  incidents: number;
  milesDriver: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  title?: string;
  timeframe?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  data, 
  title = "Safety Performance",
  timeframe = "Last 7 days"
}) => {
  const maxScore = Math.max(...data.map(d => d.safetyScore));
  const minScore = Math.min(...data.map(d => d.safetyScore));
  const avgScore = Math.round(data.reduce((sum, d) => sum + d.safetyScore, 0) / data.length);
  const trend = data.length > 1 ? data[data.length - 1].safetyScore - data[0].safetyScore : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{timeframe}</p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{avgScore}</div>
          <div className="text-sm text-gray-500">Avg Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{maxScore}</div>
          <div className="text-sm text-gray-500">Best</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <span className={`text-2xl font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}
            </span>
            {trend >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="text-sm text-gray-500">Trend</div>
        </div>
      </div>
      
      {/* Simple Bar Chart */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">Daily Safety Scores</div>
        <div className="flex items-end justify-between h-32 space-x-2">
          {data.map((item, index) => {
            const height = ((item.safetyScore - minScore) / (maxScore - minScore)) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '100px' }}>
                  <div 
                    className="bg-blue-500 rounded-t transition-all duration-300 w-full absolute bottom-0"
                    style={{ height: `${Math.max(height, 10)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs font-medium text-gray-700">
                  {item.safetyScore}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Additional Metrics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Incidents:</span>
            <span className="ml-2 font-medium text-gray-900">
              {data.reduce((sum, d) => sum + d.incidents, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Miles Driven:</span>
            <span className="ml-2 font-medium text-gray-900">
              {data.reduce((sum, d) => sum + d.milesDriver, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};