import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Search, 
  X, 
  Calendar, 
  RefreshCw, 
  Building2,
  Building,
  Car,
  AlertTriangle,
  Eye,
  Download,
  Grid3X3,
  List
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoPlayer } from '@/components/dashboard/VideoPlayer';
import { useVideos } from '@/hooks/useVideos';
import { VideoFile, videoApiService } from '@/services/videoService';
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Clips = () => {
  const { videos, loading, error, refetch } = useVideos();
  const [searchParams] = useSearchParams();
  const selectedVideoId = searchParams.get('selected');
  
  // Shared state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  
  // Video dialog state
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  
  // List view state (for dashboard integration)
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(selectedVideoId);
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Scroll to selected video when page loads (for dashboard integration)
  useEffect(() => {
    if (selectedVideoId) {
      setCurrentVideoId(selectedVideoId);
      setViewMode('list'); // Switch to list view when coming from dashboard
      // Scroll to the selected video after a short delay
      setTimeout(() => {
        const element = document.getElementById(`video-${selectedVideoId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  }, [selectedVideoId]);

  // Updated parse function to handle timestamp formatting
  const parseVideoFilename = (filename: string) => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const parts = nameWithoutExt.split('_');
    
    if (parts.length >= 3) {
      const lastPart = parts[parts.length - 1];
      const timestampMatch = lastPart.match(/^(\d{2})-(\d{2})-(\d{2})$/);
      
      if (timestampMatch) {
        const formattedTime = `${timestampMatch[1]}:${timestampMatch[2]}:${timestampMatch[3]}`;
        
        return {
          company: parts[0].toUpperCase(),
          vehicle: parts[1].toUpperCase(),
          action: parts.slice(2, -1).join('_').toLowerCase(),
          timestamp: lastPart,
          formattedTime: formattedTime
        };
      } else {
        return {
          company: parts[0].toUpperCase(),
          vehicle: parts[1].toUpperCase(),
          action: parts.slice(2).join('_').toLowerCase(),
          timestamp: '',
          formattedTime: ''
        };
      }
    }
    
    if (parts.length === 2) {
      return {
        company: 'UNKNOWN',
        vehicle: parts[0].toUpperCase(),
        action: parts[1].toLowerCase(),
        timestamp: '',
        formattedTime: ''
      };
    }
    
    return {
      company: 'UNKNOWN',
      vehicle: 'UNKNOWN',
      action: 'unknown',
      timestamp: '',
      formattedTime: ''
    };
  };

  const getDisplayName = (filename: string) => {
    const parsed = parseVideoFilename(filename);
    return getActionLabel(parsed.action);
  };

  const getVideoCompany = (filename: string) => {
    return parseVideoFilename(filename).company;
  };

  const getVideoVehicle = (filename: string) => {
    return parseVideoFilename(filename).vehicle;
  };

  const getVideoAction = (filename: string) => {
    const rawAction = parseVideoFilename(filename).action;
    
    // Map common action patterns
    if (rawAction.includes('safe') && rawAction.includes('driving')) return 'safe_driving';
    if (rawAction.includes('harsh') && rawAction.includes('brake')) return 'harsh_braking';
    if (rawAction.includes('brake') || rawAction.includes('braking')) return 'harsh_braking';
    if (rawAction.includes('speed')) return 'speeding';
    if (rawAction.includes('turn') || rawAction.includes('turning')) return 'harsh_turning';
    if (rawAction.includes('tailgate') || rawAction.includes('tailgating')) return 'tailgating';
    if (rawAction.includes('lane') && rawAction.includes('departure')) return 'lane_departure';
    if (rawAction.includes('lane')) return 'lane_departure';
    if (rawAction.includes('accident')) return 'accident';
    if (rawAction.includes('overtake') || rawAction.includes('overtaking')) return 'overtaking';
    if (rawAction.includes('distracted') || rawAction.includes('distraction')) return 'distracted_driving';
    if (rawAction.includes('drowsy') || rawAction.includes('fatigue')) return 'drowsy_driving';
    if (rawAction.includes('talking') && rawAction.includes('phone')) return 'talking_phone';
    if (rawAction.includes('hair') && rawAction.includes('makeup')) return 'hair_and_makeup';
    if (rawAction.includes('talking') && rawAction.includes('passenger')) return 'talking_to_passenger';
    if (rawAction.includes('texting')) return 'texting';
    if (rawAction.includes('drinking')) return 'drinking';
    
    return rawAction.replace(/[_\s]+/g, '_');
  };

  const actionTypes = [
    { value: 'safe_driving', label: 'Safe Driving' },
    { value: 'harsh_braking', label: 'Harsh Braking' },
    { value: 'speeding', label: 'Speeding' },
    { value: 'harsh_turning', label: 'Harsh Turning' },
    { value: 'tailgating', label: 'Tailgating' },
    { value: 'lane_departure', label: 'Lane Departure' },
    { value: 'accident', label: 'Accident' },
    { value: 'overtaking', label: 'Overtaking' },
    { value: 'distracted_driving', label: 'Distracted Driving' },
    { value: 'drowsy_driving', label: 'Drowsy Driving' },
    { value: 'talking_phone', label: 'Talking Phone' },
    { value: 'hair_and_makeup', label: 'Hair And Makeup' },
    { value: 'talking_to_passenger', label: 'Talking To Passenger' },
    { value: 'texting', label: 'Texting' },
    { value: 'drinking', label: 'Drinking' },
    { value: 'unknown', label: 'Unknown' },
  ];

  const getActionLabel = (action: string) => {
    const cleanAction = action.replace(/\d{2}-\d{2}-\d{2}$/, '').replace(/_$/, '');
    const actionType = actionTypes.find(type => type.value === action);
    if (actionType) return actionType.label;
    
    return cleanAction
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSeverity = (action: string) => {
    if (action.includes('harsh') || action.includes('accident')) return 'high';
    if (action.includes('speed') || action.includes('lane')) return 'medium';
    if (action.includes('safe') || action.includes('normal')) return 'safe';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get unique companies from video filenames
  const companies = React.useMemo(() => {
    const companySet = new Set<string>();
    videos.forEach(video => {
      const company = getVideoCompany(video.filename);
      companySet.add(company);
    });
    return Array.from(companySet).sort();
  }, [videos]);

  // Get unique vehicles from video filenames (filtered by selected company)
  const vehicles = React.useMemo(() => {
    const vehicleSet = new Set<string>();
    videos
      .filter(video => selectedCompany === 'all' || getVideoCompany(video.filename) === selectedCompany)
      .forEach(video => {
        const vehicle = getVideoVehicle(video.filename);
        vehicleSet.add(vehicle);
      });
    return Array.from(vehicleSet).sort();
  }, [videos, selectedCompany]);

  // Get unique actions from video filenames
  const availableActions = React.useMemo(() => {
    const actionSet = new Set<string>();
    videos.forEach(video => {
      const action = getVideoAction(video.filename);
      actionSet.add(action);
    });
    return Array.from(actionSet).sort();
  }, [videos]);

  // Filter videos based on selections and search
  const filteredVideos = videos.filter(video => {
    const videoCompany = getVideoCompany(video.filename);
    const videoVehicle = getVideoVehicle(video.filename);
    const videoAction = getVideoAction(video.filename);
    const severity = getSeverity(videoAction);
    
    const companyMatch = selectedCompany === 'all' || videoCompany === selectedCompany;
    const vehicleMatch = selectedVehicle === 'all' || videoVehicle === selectedVehicle;
    const actionMatch = selectedAction === 'all' || videoAction === selectedAction;
    const severityMatch = selectedSeverity === 'all' || severity === selectedSeverity;
    
    const searchMatch = searchQuery === '' || 
      video.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      videoCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      videoVehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getActionLabel(videoAction).toLowerCase().includes(searchQuery.toLowerCase());
    
    const dateMatch = !selectedDate || 
      new Date(video.createdAt).toDateString() === selectedDate.toDateString();
    
    return companyMatch && vehicleMatch && actionMatch && severityMatch && searchMatch && dateMatch;
  });

  // Group videos by company, then by vehicle (for grid view)
  const groupedVideos = React.useMemo(() => {
    const groups: { [company: string]: { [vehicle: string]: VideoFile[] } } = {};
    
    filteredVideos.forEach(video => {
      const company = getVideoCompany(video.filename);
      const vehicle = getVideoVehicle(video.filename);
      
      if (!groups[company]) {
        groups[company] = {};
      }
      if (!groups[company][vehicle]) {
        groups[company][vehicle] = [];
      }
      groups[company][vehicle].push(video);
    });
    
    return groups;
  }, [filteredVideos]);

  const handlePlayVideo = (video: VideoFile) => {
    setSelectedVideo(video);
    setIsVideoDialogOpen(true);
  };

  const handleVideoSelect = (videoId: string) => {
    setCurrentVideoId(videoId);
  };

  const handleNextVideo = () => {
    if (!selectedVideo) return;
    const currentCompany = getVideoCompany(selectedVideo.filename);
    const currentVehicle = getVideoVehicle(selectedVideo.filename);
    const vehicleVideos = groupedVideos[currentCompany]?.[currentVehicle] || [];
    const currentIndex = vehicleVideos.findIndex(v => v.id === selectedVideo.id);
    
    if (currentIndex < vehicleVideos.length - 1) {
      setSelectedVideo(vehicleVideos[currentIndex + 1]);
    }
  };

  const handlePreviousVideo = () => {
    if (!selectedVideo) return;
    const currentCompany = getVideoCompany(selectedVideo.filename);
    const currentVehicle = getVideoVehicle(selectedVideo.filename);
    const vehicleVideos = groupedVideos[currentCompany]?.[currentVehicle] || [];
    const currentIndex = vehicleVideos.findIndex(v => v.id === selectedVideo.id);
    
    if (currentIndex > 0) {
      setSelectedVideo(vehicleVideos[currentIndex - 1]);
    }
  };

  const hasNextVideo = () => {
    if (!selectedVideo) return false;
    const currentCompany = getVideoCompany(selectedVideo.filename);
    const currentVehicle = getVideoVehicle(selectedVideo.filename);
    const vehicleVideos = groupedVideos[currentCompany]?.[currentVehicle] || [];
    const currentIndex = vehicleVideos.findIndex(v => v.id === selectedVideo.id);
    return currentIndex < vehicleVideos.length - 1;
  };

  const hasPreviousVideo = () => {
    if (!selectedVideo) return false;
    const currentCompany = getVideoCompany(selectedVideo.filename);
    const currentVehicle = getVideoVehicle(selectedVideo.filename);
    const vehicleVideos = groupedVideos[currentCompany]?.[currentVehicle] || [];
    const currentIndex = vehicleVideos.findIndex(v => v.id === selectedVideo.id);
    return currentIndex > 0;
  };

  const clearFilter = (filterType: 'company' | 'vehicle' | 'action' | 'search' | 'date' | 'severity') => {
    switch (filterType) {
      case 'company':
        setSelectedCompany('all');
        setSelectedVehicle('all');
        break;
      case 'vehicle':
        setSelectedVehicle('all');
        break;
      case 'action':
        setSelectedAction('all');
        break;
      case 'severity':
        setSelectedSeverity('all');
        break;
      case 'search':
        setSearchQuery('');
        break;
      case 'date':
        setSelectedDate(undefined);
        break;
    }
  };

  // Reset vehicle selection when company changes
  React.useEffect(() => {
    if (selectedCompany !== 'all') {
      setSelectedVehicle('all');
    }
  }, [selectedCompany]);

  const activeFilters = [
    ...(selectedCompany !== 'all' ? [{ type: 'company' as const, label: `Company ${selectedCompany}`, value: selectedCompany }] : []),
    ...(selectedVehicle !== 'all' ? [{ type: 'vehicle' as const, label: `Vehicle ${selectedVehicle}`, value: selectedVehicle }] : []),
    ...(selectedAction !== 'all' ? [{ type: 'action' as const, label: getActionLabel(selectedAction), value: selectedAction }] : []),
    ...(selectedSeverity !== 'all' ? [{ type: 'severity' as const, label: `${selectedSeverity.charAt(0).toUpperCase() + selectedSeverity.slice(1)} Risk`, value: selectedSeverity }] : []),
    ...(searchQuery ? [{ type: 'search' as const, label: `Search: ${searchQuery}`, value: searchQuery }] : []),
    ...(selectedDate ? [{ type: 'date' as const, label: `Date: ${format(selectedDate, 'PPP')}`, value: selectedDate }] : []),
  ];

  const totalClips = filteredVideos.length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Clips</h1>
                {selectedVideoId && (
                  <p className="text-gray-600 mt-1">
                    Showing video selected from dashboard
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  {totalClips} clip{totalClips !== 1 ? 's' : ''} found
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={refetch}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search and Date Picker Row */}
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search clips, companies, vehicles, or actions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex gap-2">
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All companies</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company} value={company}>
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All vehicles</SelectItem>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle} value={vehicle}>
                          {vehicle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All actions</SelectItem>
                      {availableActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {getActionLabel(action)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {viewMode === 'list' && (
                    <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severity</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="safe">Safe Driving</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Filter Chips */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <span>{filter.label}</span>
                      <button
                        onClick={() => clearFilter(filter.type)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCompany('all');
                      setSelectedVehicle('all');
                      setSelectedAction('all');
                      setSelectedSeverity('all');
                      setSearchQuery('');
                      setSelectedDate(undefined);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading clips from server...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Videos</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={refetch} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!loading && !error && filteredVideos.length === 0 && videos.length > 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No clips found</h3>
                  <p className="text-gray-500 mb-4">
                    {activeFilters.length > 0 
                      ? "Try adjusting your filters or search terms" 
                      : "No clips match your criteria"}
                  </p>
                  {activeFilters.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCompany('all');
                        setSelectedVehicle('all');
                        setSelectedAction('all');
                        setSelectedSeverity('all');
                        setSearchQuery('');
                        setSelectedDate(undefined);
                      }}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* No Videos Available */}
            {!loading && !error && videos.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No videos available</h3>
                  <p className="text-gray-500 mb-4">
                    Add some video files to your backend videos folder to get started.
                    <br />
                    <span className="text-sm text-gray-400">Expected format: company_vehicle_action_timestamp.mp4</span>
                  </p>
                  <Button onClick={refetch} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check for videos
                  </Button>
                </div>
              </div>
            )}

            {/* Content Views */}
            {!loading && !error && filteredVideos.length > 0 && (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="space-y-10">
                    {Object.entries(groupedVideos).map(([company, vehicleGroups]) => (
                      <div key={company} className="space-y-6">
                        {/* Company Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                          <Building2 className="h-6 w-6 text-blue-600" />
                          <h2 className="text-2xl font-bold text-gray-900">{company}</h2>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {Object.values(vehicleGroups).reduce((sum, videos) => sum + videos.length, 0)} clips
                          </span>
                        </div>

                        {/* Vehicles within Company */}
                        {Object.entries(vehicleGroups).map(([vehicle, vehicleVideos]) => (
                          <div key={`${company}-${vehicle}`} className="space-y-4 ml-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-semibold text-gray-700">
                                Vehicle {vehicle}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {vehicleVideos.length} clip{vehicleVideos.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {vehicleVideos.map((video) => {
                                const videoAction = getVideoAction(video.filename);
                                const actionLabel = getActionLabel(videoAction);
                                const displayName = getDisplayName(video.filename);
                                const parsedInfo = parseVideoFilename(video.filename);
                                
                                return (
                                  <div 
                                    key={video.id} 
                                    className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
                                      video.id === selectedVideoId ? 'ring-2 ring-blue-500 shadow-lg' : ''
                                    }`}
                                  >
                                    <div className="relative aspect-video bg-gray-100">
                                      <video
                                        src={videoApiService.getVideoStreamUrl(video.id)}
                                        className="w-full h-full object-cover"
                                        muted
                                        preload="metadata"
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                                        <div 
                                          className="w-14 h-14 bg-white bg-opacity-90 rounded-full flex items-center justify-center text-blue-600 hover:bg-opacity-100 transition-colors cursor-pointer shadow-lg"
                                          onClick={() => handlePlayVideo(video)}
                                        >
                                          <Play size={24} className="ml-1" />
                                        </div>
                                      </div>
                                      {video.id === selectedVideoId && (
                                        <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800">
                                          From Dashboard
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="p-4">
                                      <h4 className="font-semibold text-gray-900 mb-2 truncate">{displayName}</h4>
                                      <p className="text-sm text-gray-500 mb-2">{videoApiService.formatDate(video.createdAt)}</p>
                                      
                                      {parsedInfo.formattedTime && (
                                        <p className="text-xs text-blue-600 mb-2">
                                          Time: {parsedInfo.formattedTime}
                                        </p>
                                      )}
                                      
                                      <div>
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                          videoAction === 'safe_driving' 
                                            ? 'bg-green-100 text-green-800'
                                            : videoAction === 'unknown'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {actionLabel}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* List View with Player */}
                {viewMode === 'list' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video List */}
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Video Library</CardTitle>
                          <CardDescription>
                            {filteredVideos.length} clip{filteredVideos.length !== 1 ? 's' : ''} found
                            {selectedVideoId && (
                              <span className="ml-2 text-blue-600 font-medium">
                                (From Dashboard Selection)
                              </span>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {filteredVideos.map((video) => {
                              const { company, vehicle, action } = parseVideoFilename(video.filename);
                              const severity = getSeverity(action);
                              const isSelected = video.id === selectedVideoId;
                              const isCurrentlyPlaying = video.id === currentVideoId;
                              
                              return (
                                <div
                                  id={`video-${video.id}`}
                                  key={video.id}
                                  className={`
                                    flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-200
                                    ${isSelected 
                                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 transform scale-[1.02]' 
                                      : isCurrentlyPlaying
                                      ? 'border-green-500 bg-green-50'
                                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }
                                  `}
                                  onClick={() => handleVideoSelect(video.id)}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="relative">
                                      <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                                        <video
                                          src={videoApiService.getVideoStreamUrl(video.id)}
                                          className="w-full h-full object-cover"
                                          muted
                                          preload="metadata"
                                        />
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="w-4 h-4 text-white opacity-80" />
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium text-sm">
                                          {getActionLabel(action)}
                                        </h3>
                                        {isSelected && (
                                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                                            Selected from Dashboard
                                          </Badge>
                                        )}
                                        {isCurrentlyPlaying && !isSelected && (
                                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                            <Eye className="w-3 h-3 mr-1" />
                                            Viewing
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Building className="w-3 h-3" />
                                        <span>{company}</span>
                                        <Car className="w-3 h-3 ml-2" />
                                        <span>Vehicle {vehicle}</span>
                                        <Calendar className="w-3 h-3 ml-2" />
                                        <span>{videoApiService.formatDate(video.createdAt)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Badge className={`text-xs ${getSeverityColor(severity)}`}>
                                      {severity === 'high' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                      {severity.charAt(0).toUpperCase() + severity.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Video Player */}
                    <div className="lg:col-span-1">
                      <Card>
                        <CardHeader>
                          <CardTitle>Video Player</CardTitle>
                          <CardDescription>
                            {currentVideoId ? 'Click on any clip to view' : 'Select a clip to play'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {currentVideoId ? (
                            <div className="space-y-4">
                              <VideoPlayer
                                videoSrc={videoApiService.getVideoStreamUrl(currentVideoId)}
                                className="w-full aspect-video"
                              />
                              <div className="text-sm text-gray-600">
                                {(() => {
                                  const video = videos.find(v => v.id === currentVideoId);
                                  if (!video) return null;
                                  const { company, vehicle, action } = parseVideoFilename(video.filename);
                                  return (
                                    <div>
                                      <div className="font-medium">{getActionLabel(action)}</div>
                                      <div className="text-xs mt-1">
                                        {company} • Vehicle {vehicle}
                                      </div>
                                      <div className="text-xs text-gray-400 mt-1">
                                        {videoApiService.formatDate(video.createdAt)}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  const video = videos.find(v => v.id === currentVideoId);
                                  if (video) {
                                    const link = document.createElement('a');
                                    link.href = videoApiService.getVideoStreamUrl(currentVideoId);
                                    link.download = video.filename;
                                    link.click();
                                  }
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          ) : (
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <Play className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Select a clip to view</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Video Dialog for Grid View */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedVideo && getDisplayName(selectedVideo.filename)}
            </DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="mt-4">
              <VideoPlayer 
                videoSrc={videoApiService.getVideoStreamUrl(selectedVideo.id)}
                className="w-full"
                onNextClip={hasNextVideo() ? handleNextVideo : undefined}
                onPreviousClip={hasPreviousVideo() ? handlePreviousVideo : undefined}
                hasNextClip={hasNextVideo()}
                hasPreviousClip={hasPreviousVideo()}
              />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Company:</span>
                    <span className="ml-2 text-gray-600">{getVideoCompany(selectedVideo.filename)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Vehicle:</span>
                    <span className="ml-2 text-gray-600">{getVideoVehicle(selectedVideo.filename)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Action:</span>
                    <span className="ml-2 text-gray-600">{getActionLabel(getVideoAction(selectedVideo.filename))}</span>
                  </div>
                  {parseVideoFilename(selectedVideo.filename).formattedTime && (
                    <div>
                      <span className="font-medium text-gray-700">Time:</span>
                      <span className="ml-2 text-gray-600">{parseVideoFilename(selectedVideo.filename).formattedTime}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Filename:</span>
                    <span className="ml-2 text-gray-600">{selectedVideo.originalName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <span className="ml-2 text-gray-600">{videoApiService.formatDate(selectedVideo.createdAt)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Size:</span>
                    <span className="ml-2 text-gray-600">{videoApiService.formatFileSize(selectedVideo.size)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clips;