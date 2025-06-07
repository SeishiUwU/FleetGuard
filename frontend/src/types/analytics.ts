export interface AnalyticsData {
  companies: string[];
  vehicles: string[];
  totalClips: number;
  safetyRate: number;
  eventDistribution: EventData[];
  vehiclePerformance: VehicleData[];
}

export interface EventData {
  name: string;
  value: number;
  color: string;
}

export interface VehicleData {
  vehicle: string;
  company: string;
  actions: number;
  safetyScore: number;
}

export interface FilterState {
  company: string;
  vehicle: string;
  eventType: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}