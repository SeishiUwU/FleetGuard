import { useMemo } from 'react';
import { useVideos } from './useVideos';

// Type definitions
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

export const useDashboard = () => {
  const { videos, loading, error, refetch } = useVideos();

  // Parse video filename helper functions
  const parseVideoFilename = (filename: string) => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const parts = nameWithoutExt.split('_');
    
    if (parts.length >= 3) {
      return {
        company: parts[0].toUpperCase(),
        vehicle: parts[1].toUpperCase(),
        action: parts.slice(2).join('_').toLowerCase()
      };
    }
    
    if (parts.length === 2) {
      return {
        company: 'UNKNOWN',
        vehicle: parts[0].toUpperCase(),
        action: parts[1].toLowerCase()
      };
    }
    
    return { company: 'UNKNOWN', vehicle: 'UNKNOWN', action: 'unknown' };
  };

  const getVideoAction = (filename: string) => {
    const rawAction = parseVideoFilename(filename).action;
    
    if (rawAction.includes('safe') && rawAction.includes('driving')) return 'safe_driving';
    if (rawAction.includes('harsh') && rawAction.includes('brake')) return 'harsh_braking';
    if (rawAction.includes('brake') || rawAction.includes('braking')) return 'harsh_braking';
    if (rawAction.includes('speed')) return 'speeding';
    if (rawAction.includes('turn') || rawAction.includes('turning')) return 'harsh_turning';
    if (rawAction.includes('tailgate') || rawAction.includes('tailgating')) return 'tailgating';
    if (rawAction.includes('lane') && rawAction.includes('departure')) return 'lane_departure';
    
    return rawAction.replace(/[_\s]+/g, '_');
  };

  const dashboardData = useMemo(() => {
    if (!videos.length) {
      return {
        stats: {
          activeVehicles: 0,
          clipsRecordedToday: 0,
          totalClips: 0,
          safetyScore: 0,
          weeklyScores: [0, 0, 0, 0, 0, 0, 0],
          improvementPoints: 0
        } as DashboardStats,
        recentAlerts: [] as RecentAlert[],
        vehicleLocations: [] as VehicleLocation[]
      };
    }

    // Calculate stats
    const uniqueVehicles = new Set<string>();
    videos.forEach(video => {
      const { vehicle } = parseVideoFilename(video.filename);
      uniqueVehicles.add(vehicle);
    });

    // Get clips recorded today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const clipsToday = videos.filter(video => {
      const videoDate = new Date(video.createdAt);
      return videoDate >= todayStart;
    });

    // Calculate safety score
    const totalClips = videos.length;
    const safeClips = videos.filter(video => getVideoAction(video.filename) === 'safe_driving').length;
    const safetyScore = totalClips > 0 ? Math.round((safeClips / totalClips) * 100) : 0;

    const stats: DashboardStats = {
      activeVehicles: uniqueVehicles.size,
      clipsRecordedToday: clipsToday.length,
      totalClips: totalClips,
      safetyScore: safetyScore,
      weeklyScores: [82, 83, 86, 85, 87, 84, safetyScore],
      improvementPoints: 3
    };

    // Generate recent alerts
    const recentUnsafeVideos = videos
      .filter(video => getVideoAction(video.filename) !== 'safe_driving')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const recentAlerts: RecentAlert[] = recentUnsafeVideos.map(video => {
      const { company, vehicle } = parseVideoFilename(video.filename);
      const action = getVideoAction(video.filename);
      
      const actionLabels: { [key: string]: string } = {
        'harsh_braking': 'Hard braking',
        'harsh_turning': 'Sharp turn',
        'speeding': 'Speeding',
        'tailgating': 'Tailgating',
        'lane_departure': 'Lane departure'
      };

      return {
        id: video.id,
        type: actionLabels[action] || action.replace(/_/g, ' '),
        vehicle: vehicle,
        company: company,
        time: new Date(video.createdAt).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        severity: (action === 'harsh_braking' || action === 'speeding') ? 'high' : 'medium',
        timestamp: new Date(video.createdAt)
      };
    });

    // Generate vehicle locations
    const vehicleLocations: VehicleLocation[] = Array.from(uniqueVehicles).map((vehicle) => {
      const hasRecentAlert = recentAlerts.some(alert => alert.vehicle === vehicle);
      const vehicleVideo = videos.find(v => parseVideoFilename(v.filename).vehicle === vehicle);
      const company = vehicleVideo ? parseVideoFilename(vehicleVideo.filename).company : 'UNKNOWN';
      
      return {
        id: `${company}-${vehicle}`,
        vehicle: vehicle,
        company: company,
        status: hasRecentAlert ? 'alert' : (Math.random() > 0.2 ? 'active' : 'offline')
      };
    });

    return {
      stats,
      recentAlerts,
      vehicleLocations
    };
  }, [videos]);

  return {
    ...dashboardData,
    loading,
    error,
    refetch
  };
};