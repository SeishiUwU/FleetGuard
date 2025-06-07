import { useMemo } from 'react';
import { useVideos } from './useVideos';

export const useAnalytics = () => {
  const { videos, loading, error } = useVideos();

  // Same parsing functions as in Clips.tsx
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
    return { company: 'UNKNOWN', vehicle: 'UNKNOWN', action: 'unknown' };
  };

  const analyticsData = useMemo(() => {
    if (!videos.length) return null;

    const companies = [...new Set(videos.map(v => parseVideoFilename(v.filename).company))];
    const vehicles = [...new Set(videos.map(v => parseVideoFilename(v.filename).vehicle))];
    
    // Calculate stats and charts data
    return {
      companies,
      vehicles,
      totalClips: videos.length,
      // Add more analytics calculations here
    };
  }, [videos]);

  return {
    analyticsData,
    loading,
    error
  };
};