export interface DashboardStats {
  activeVehicles: number;
  clipsRecordedToday: number;
  totalClips: number;
  safetyScore: number;
  weeklyScores: number[];
  improvementPoints: number;
}

export interface RecentAlert {
  id: string;
  type: string;
  vehicle: string;
  company: string;
  time: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

export interface VehicleLocation {
  id: string;
  vehicle: string;
  company: string;
  status: 'active' | 'alert' | 'offline';
  lat?: number;
  lng?: number;
}