import React, { useState, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Car, 
  Building2, 
  Calendar,
  RefreshCw,
  Filter
} from 'lucide-react';
import { useVideos } from '@/hooks/useVideos';

const Analytics = () => {
  const { videos, loading, error, refetch } = useVideos();
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('7d');

  // Parse video filename to extract company, vehicle, and action
  const parseVideoFilename = (filename: string) => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const parts = nameWithoutExt.split('_');
    
    if (parts.length >= 3) {
      const lastPart = parts[parts.length - 1];
      const timestampMatch = lastPart.match(/^(\d{2})-(\d{2})-(\d{2})$/);
      
      if (timestampMatch) {
        return {
          company: parts[0].toUpperCase(),
          vehicle: parts[1].toUpperCase(),
          action: parts.slice(2, -1).join('_').toLowerCase(),
          timestamp: lastPart
        };
      } else {
        return {
          company: parts[0].toUpperCase(),
          vehicle: parts[1].toUpperCase(),
          action: parts.slice(2).join('_').toLowerCase(),
          timestamp: ''
        };
      }
    }
    
    return {
      company: 'UNKNOWN',
      vehicle: 'UNKNOWN',
      action: 'unknown',
      timestamp: ''
    };
  };

  const getActionLabel = (action: string) => {
    const cleanAction = action.replace(/\d{2}-\d{2}-\d{2}$/, '').replace(/_$/, '');
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

  // Get unique companies
  const companies = useMemo(() => {
    const companySet = new Set<string>();
    videos.forEach(video => {
      const { company } = parseVideoFilename(video.filename);
      companySet.add(company);
    });
    return Array.from(companySet).sort();
  }, [videos]);

  // Filter videos by company
  const filteredVideos = useMemo(() => {
    if (selectedCompany === 'all') return videos;
    return videos.filter(video => {
      const { company } = parseVideoFilename(video.filename);
      return company === selectedCompany;
    });
  }, [videos, selectedCompany]);

  // Calculate analytics data based on filtered videos
  const analyticsData = useMemo(() => {
    // Top vehicles by actions committed (with company differentiation)
    const vehicleActions = new Map<string, number>();
    filteredVideos.forEach(video => {
      const { company, vehicle, action } = parseVideoFilename(video.filename);
      const severity = getSeverity(action);
      if (severity !== 'safe') { // Only count non-safe actions
        const vehicleKey = selectedCompany === 'all' ? `${company} - Vehicle ${vehicle}` : `Vehicle ${vehicle}`;
        vehicleActions.set(vehicleKey, (vehicleActions.get(vehicleKey) || 0) + 1);
      }
    });

    const topVehicles = Array.from(vehicleActions.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([vehicle, count]) => ({
        vehicle,
        count,
        name: vehicle
      }));

    // Action types distribution
    const actionCounts = new Map<string, number>();
    filteredVideos.forEach(video => {
      const { action } = parseVideoFilename(video.filename);
      const actionLabel = getActionLabel(action);
      actionCounts.set(actionLabel, (actionCounts.get(actionLabel) || 0) + 1);
    });

    const actionTypes = Array.from(actionCounts.entries())
      .map(([action, count]) => ({
        action,
        count,
        name: action
      }))
      .sort((a, b) => b.count - a.count);

    // Severity distribution
    const severityCounts = new Map<string, number>();
    filteredVideos.forEach(video => {
      const { action } = parseVideoFilename(video.filename);
      const severity = getSeverity(action);
      severityCounts.set(severity, (severityCounts.get(severity) || 0) + 1);
    });

    const severityData = Array.from(severityCounts.entries())
      .map(([severity, count]) => ({
        severity: severity.charAt(0).toUpperCase() + severity.slice(1),
        count,
        name: severity.charAt(0).toUpperCase() + severity.slice(1)
      }));

    // Company comparison (only show when 'all' is selected)
    const companyStats = new Map<string, { total: number, high: number, medium: number, low: number, safe: number }>();
    if (selectedCompany === 'all') {
      videos.forEach(video => {
        const { company, action } = parseVideoFilename(video.filename);
        const severity = getSeverity(action);
        
        if (!companyStats.has(company)) {
          companyStats.set(company, { total: 0, high: 0, medium: 0, low: 0, safe: 0 });
        }
        
        const stats = companyStats.get(company)!;
        stats.total += 1;
        stats[severity as keyof typeof stats] += 1;
      });
    }

    const companyComparison = Array.from(companyStats.entries())
      .map(([company, stats]) => ({
        company,
        ...stats,
        name: company
      }));

    // Time-based trends (last 7 days)
    const now = new Date();
    const trends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      
      const dayVideos = filteredVideos.filter(video => {
        const videoDate = new Date(video.createdAt);
        return videoDate.toDateString() === date.toDateString();
      });
      
      trends.push({
        date: dateStr,
        incidents: dayVideos.filter(video => {
          const { action } = parseVideoFilename(video.filename);
          return getSeverity(action) !== 'safe';
        }).length,
        total: dayVideos.length
      });
    }

    return {
      topVehicles,
      actionTypes,
      severityData,
      companyComparison,
      trends,
      totalIncidents: filteredVideos.filter(video => {
        const { action } = parseVideoFilename(video.filename);
        return getSeverity(action) !== 'safe';
      }).length,
      totalVideos: filteredVideos.length
    };
  }, [filteredVideos, selectedCompany, videos]);

  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header with Filters */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-1">
                  Fleet safety insights and performance metrics
                  {selectedCompany !== 'all' && (
                    <span className="ml-2 text-blue-600 font-medium">
                      - {selectedCompany}
                    </span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Company Filter */}
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="w-48">
                    <Building2 className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Time Range Filter */}
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-40">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>

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
            </div>

            {/* Active Filters */}
            {selectedCompany !== 'all' && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Active filters:</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Company: {selectedCompany}
                  <button
                    onClick={() => setSelectedCompany('all')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {analyticsData.totalIncidents}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Safety violations detected
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.totalVideos}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clips analyzed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedCompany === 'all' ? companies.length : 1}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedCompany === 'all' ? 'Total companies' : selectedCompany}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.totalVideos > 0 
                      ? Math.round(((analyticsData.totalVideos - analyticsData.totalIncidents) / analyticsData.totalVideos) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Safe driving ratio
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Vehicles Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Top Vehicles by Safety Incidents
                    {selectedCompany !== 'all' && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({selectedCompany})
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Vehicles with the most safety violations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.topVehicles}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="vehicle" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Action Types Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Incident Types Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of safety incidents by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.actionTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analyticsData.actionTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Severity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                  <CardDescription>
                    Incidents categorized by severity level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.severityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="severity" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trend Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Incident Trends</CardTitle>
                  <CardDescription>
                    Safety incidents over the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="incidents" stroke="#ef4444" fill="#fecaca" />
                      <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#dbeafe" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Company Comparison (only when all companies selected) */}
            {selectedCompany === 'all' && analyticsData.companyComparison.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Company Performance Comparison</CardTitle>
                  <CardDescription>
                    Safety performance across all companies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={analyticsData.companyComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="company" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="high" stackId="a" fill="#ef4444" name="High Risk" />
                      <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium Risk" />
                      <Bar dataKey="low" stackId="a" fill="#3b82f6" name="Low Risk" />
                      <Bar dataKey="safe" stackId="a" fill="#10b981" name="Safe Driving" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Vehicle Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Performance Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of vehicle safety performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Vehicle</th>
                        {selectedCompany === 'all' && <th className="text-left p-2">Company</th>}
                        <th className="text-center p-2">Total Incidents</th>
                        <th className="text-center p-2">Risk Level</th>
                        <th className="text-right p-2">Last Incident</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topVehicles.map((vehicle, index) => {
                        const vehicleName = selectedCompany === 'all' 
                          ? vehicle.vehicle.split(' - ')[1] 
                          : vehicle.vehicle;
                        const companyName = selectedCompany === 'all' 
                          ? vehicle.vehicle.split(' - ')[0] 
                          : selectedCompany;
                        
                        const riskLevel = vehicle.count >= 3 ? 'High' : vehicle.count >= 2 ? 'Medium' : 'Low';
                        const riskColor = riskLevel === 'High' ? 'text-red-600' : riskLevel === 'Medium' ? 'text-yellow-600' : 'text-blue-600';
                        
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{vehicleName}</td>
                            {selectedCompany === 'all' && <td className="p-2">{companyName}</td>}
                            <td className="p-2 text-center">{vehicle.count}</td>
                            <td className={`p-2 text-center font-medium ${riskColor}`}>{riskLevel}</td>
                            <td className="p-2 text-right text-gray-500">
                              {/* You can add last incident date here if available in your data */}
                              Recently
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;