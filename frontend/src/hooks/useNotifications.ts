import { useState, useCallback, useEffect } from 'react';
import { VideoFile } from '@/services/videoService';

export interface Notification {
  id: string;
  type: 'destination' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  vehicleId?: string;
  company?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trackedVehicles, setTrackedVehicles] = useState<Set<string>>(new Set());

  // Process videos to detect destination arrivals
  const processVideosForDestinations = useCallback((videos: VideoFile[]) => {
    videos.forEach(video => {
      // Parse video filename to extract info
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
        
        return {
          company: 'UNKNOWN',
          vehicle: 'UNKNOWN',
          action: 'unknown'
        };
      };

      const { company, vehicle, action } = parseVideoFilename(video.filename);
      const vehicleKey = `${company}-${vehicle}`;
      
      // Check if this is a recent video (within last 30 minutes) and we haven't notified about this vehicle
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const videoDate = new Date(video.createdAt);
      
      if (videoDate > thirtyMinutesAgo && !trackedVehicles.has(vehicleKey)) {
        // Add destination notification
        const newNotification: Notification = {
          id: `dest-${vehicleKey}-${Date.now()}`,
          type: 'destination',
          title: 'Vehicle Destination Update',
          message: `Vehicle ${vehicle} from ${company} has reached its destination`,
          timestamp: new Date(),
          isRead: false,
          vehicleId: vehicle,
          company: company
        };

        setNotifications(prev => [newNotification, ...prev]);
        setTrackedVehicles(prev => new Set([...prev, vehicleKey]));
      }
    });
  }, [trackedVehicles]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setTrackedVehicles(new Set());
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    processVideosForDestinations
  };
};