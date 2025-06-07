import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Car, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Clock,
  Activity,
  Shield,
  Fuel,
  Route,
  ChevronRight,
  Play,
  RefreshCw
} from 'lucide-react';
import { VideoPlayer } from '@/components/dashboard/VideoPlayer';
import { useVideos } from '@/hooks/useVideos';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { videoApiService } from '@/services/videoService';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { videos, loading, error, refetch } = useVideos();
  const { processVideosForDestinations } = useNotificationContext();
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Process videos when they change to detect new destinations
  useEffect(() => {
    if (videos.length > 0) {
      processVideosForDestinations(videos);
    }
  }, [videos, processVideosForDestinations]);

  // Parse video filename for dashboard stats - UPDATED to handle timestamps
  const parseVideoFilename = (filename: string) => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const parts = nameWithoutExt.split('_');
    
    if (parts.length >= 3) {
      // Check if the last part looks like a timestamp (00-02-46)
      const lastPart = parts[parts.length - 1];
      const timestampMatch = lastPart.match(/^(\d{2})-(\d{2})-(\d{2})$/);
      
      if (timestampMatch) {
        // Remove timestamp from action
        return {
          company: parts[0].toUpperCase(),
          vehicle: parts[1].toUpperCase(),
          action: parts.slice(2, -1).join('_').toLowerCase() // Exclude timestamp
        };
      } else {
        // No timestamp in filename
        return {
          company: parts[0].toUpperCase(),
          vehicle: parts[1].toUpperCase(),
          action: parts.slice(2).join('_').toLowerCase()
        };
      }
    }
    
    return {
      company: 'UNKNOWN',
      vehicle: 'UNKNOWN',
      action: 'unknown'
    };
  };

  // Calculate dashboard statistics
  const stats = React.useMemo(() => {
    const companies = new Set<string>();
    const vehicles = new Set<string>();
    let alertCount = 0;
    let safeEvents = 0;

    videos.forEach(video => {
      const { company, vehicle, action } = parseVideoFilename(video.filename);
      companies.add(company);
      vehicles.add(vehicle);
      
      if (action.includes('safe') || action.includes('normal')) {
        safeEvents++;
      } else {
        alertCount++;
      }
    });

    return {
      totalCompanies: companies.size,
      totalVehicles: vehicles.size,
      totalAlerts: alertCount,
      safetyScore: videos.length > 0 ? Math.round((safeEvents / videos.length) * 100) : 100
    };
  }, [videos]);

  // Get recent alerts (non-safe driving events) - Show 10 alerts, split into two columns
  const recentAlerts = React.useMemo(() => {
    return videos
      .filter(video => {
        const { action } = parseVideoFilename(video.filename);
        return !action.includes('safe') && !action.includes('normal');
      })
      .slice(0, 10) // Show 10 alerts total
      .map(video => {
        const { company, vehicle, action } = parseVideoFilename(video.filename);
        return {
          id: video.id,
          type: action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          severity: action.includes('harsh') || action.includes('accident') ? 'high' : 
                   action.includes('speed') || action.includes('lane') ? 'medium' : 'low',
          description: `${action.replace(/_/g, ' ')} detected`,
          vehicle: vehicle,
          company: company,
          location: 'Highway 101', // You can enhance this with real location data
          time: new Date(video.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: video.createdAt
        };
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [videos]);

  // Split alerts into two columns
  const leftAlerts = recentAlerts.slice(0, 5);
  const rightAlerts = recentAlerts.slice(5, 10);

  // Get latest videos for recent activity
  const recentVideos = React.useMemo(() => {
    return videos
      .slice(0, 6)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [videos]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  // UPDATED function to remove timestamps from action labels
  const getActionLabel = (action: string) => {
    // Remove timestamp patterns like 00-00-03, 12-34-56, etc.
    const cleanAction = action.replace(/\d{2}-\d{2}-\d{2}$/, '').replace(/_$/, '');
    
    return cleanAction
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Real-time fleet monitoring and safety analytics
                </p>
              </div>
              <Button
                onClick={refetch}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    Active fleet partners
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVehicles}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently monitored
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Safety Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAlerts}</div>
                  <p className="text-xs text-muted-foreground">
                    Total incidents detected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.safetyScore}%</div>
                  <Progress value={stats.safetyScore} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Fleet safety rating
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Video Player - UPDATED to remove timestamps */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Latest Incident</CardTitle>
                      <CardDescription>
                        Most recent safety event captured
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentVideos.length > 0 ? (
                        <div className="space-y-4">
                          <VideoPlayer 
                            videoSrc={videoApiService.getVideoStreamUrl(selectedVideoId || recentVideos[0].id)}
                            className="w-full aspect-video"
                          />
                          <div className="text-sm text-gray-600">
                            <div className="font-medium">
                              {getActionLabel(parseVideoFilename(recentVideos[0].filename).action)}
                            </div>
                            <div>
                              Company: {parseVideoFilename(recentVideos[0].filename).company} • 
                              Vehicle: {parseVideoFilename(recentVideos[0].filename).vehicle}
                            </div>
                            <div>
                              {videoApiService.formatDate(recentVideos[0].createdAt)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <Play className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No videos available</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Activity Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Activity Summary</CardTitle>
                      <CardDescription>
                        Recent monitoring insights
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4 text-blue-500" />
                          <span>Total Clips</span>
                        </div>
                        <Badge variant="secondary">{videos.length}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>Safety Incidents</span>
                        </div>
                        <Badge variant="destructive">{stats.totalAlerts}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Safe Driving Events</span>
                        </div>
                        <Badge variant="secondary">{videos.length - stats.totalAlerts}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span>Last Updated</span>
                        </div>
                        <Badge variant="outline">
                          {videos.length > 0 
                            ? formatDistanceToNow(new Date(videos[0].createdAt), { addSuffix: true })
                            : 'No data'
                          }
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Safety Alerts</CardTitle>
                    <CardDescription>
                      Latest incidents requiring attention (10 most recent)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentAlerts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column - First 5 alerts */}
                        <div className="space-y-3">
                          {leftAlerts.map((alert) => (
                            <div 
                              key={alert.id} 
                              className={`flex items-center p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                            >
                              <div className="flex items-center gap-3">
                                <AlertTriangle className={`w-5 h-5 ${
                                  alert.severity === 'high' ? 'text-red-500' : 
                                  alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                }`} />
                                <div>
                                  <div className="font-medium">{alert.type}</div>
                                  <div className="text-sm opacity-75">
                                    {alert.company} • Vehicle {alert.vehicle} • {alert.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Right Column - Next 5 alerts */}
                        <div className="space-y-3">
                          {rightAlerts.map((alert) => (
                            <div 
                              key={alert.id} 
                              className={`flex items-center p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                            >
                              <div className="flex items-center gap-3">
                                <AlertTriangle className={`w-5 h-5 ${
                                  alert.severity === 'high' ? 'text-red-500' : 
                                  alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                                }`} />
                                <div>
                                  <div className="font-medium">{alert.type}</div>
                                  <div className="text-sm opacity-75">
                                    {alert.company} • Vehicle {alert.vehicle} • {alert.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-medium">No recent alerts</p>
                        <p className="text-sm">All vehicles are operating safely</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest video captures and events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentVideos.map((video) => {
                        const { company, vehicle, action } = parseVideoFilename(video.filename);
                        return (
                          <div 
                            key={video.id}
                            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                            onClick={() => {
                              // Navigate to clips page with the selected video ID
                              navigate(`/clips?selected=${video.id}`);
                            }}
                          >
                            <div className="aspect-video bg-gray-100 relative">
                              <video
                                src={videoApiService.getVideoStreamUrl(video.id)}
                                className="w-full h-full object-cover"
                                muted
                                preload="metadata"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                                <Play className="w-8 h-8 text-white opacity-80" />
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="font-medium text-sm truncate">
                                {getActionLabel(action)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {company} • Vehicle {vehicle}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {videoApiService.formatDate(video.createdAt)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {recentVideos.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="font-medium">No recent activity</p>
                        <p className="text-sm">Video data will appear here when available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;