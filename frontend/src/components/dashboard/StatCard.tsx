import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: LucideIcon;
  subtitle?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  subtitle,
  color = 'blue'
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          icon: 'text-green-500'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          text: 'text-red-600',
          icon: 'text-red-500'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-600',
          icon: 'text-yellow-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          icon: 'text-purple-500'
        };
      case 'gray':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          icon: 'text-gray-500'
        };
      default:
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          icon: 'text-blue-500'
        };
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4" />;
      case 'decrease': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {Icon && (
              <div className={`ml-2 p-1 rounded ${colorClasses.bg}`}>
                <Icon className={`w-4 h-4 ${colorClasses.icon}`} />
              </div>
            )}
          </div>
          
          <div className="mt-2">
            <p className={`text-3xl font-bold ${colorClasses.text}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${getChangeColor(changeType)}`}>
              {getChangeIcon(changeType)}
              <span className="text-sm font-medium ml-1">
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};