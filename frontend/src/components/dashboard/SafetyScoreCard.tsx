import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DashboardStats {
  activeVehicles: number;
  clipsRecordedToday: number;
  totalClips: number;
  safetyScore: number;
  weeklyScores: number[];
  improvementPoints: number;
}

interface SafetyScoreCardProps {
  stats: DashboardStats;
}

export const SafetyScoreCard: React.FC<SafetyScoreCardProps> = ({ stats }) => {
  const isImprovement = stats.improvementPoints > 0;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Safety Score</h3>
        <p className="text-sm text-gray-500">Weekly driver safety performance</p>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-blue-600 mb-2">
          {stats.safetyScore}
        </div>
        <div className="text-sm text-gray-500 mb-2">Average safety score this week</div>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
          isImprovement 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isImprovement ? (
            <TrendingUp className="w-3 h-3 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 mr-1" />
          )}
          {isImprovement ? '+' : ''}{stats.improvementPoints} points {isImprovement ? 'improvement' : 'decline'}
        </div>
      </div>

      {/* Weekly scores */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <div key={day}>
            <div className="text-gray-500 mb-1">{day}</div>
            <div className="font-medium">{stats.weeklyScores[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};