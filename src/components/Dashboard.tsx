import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  AlertTriangle,
  Users,
  Package,
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import { Alert, Resource, Incident } from '../types';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [alertsData, resourcesData, incidentsData, analyticsData] = await Promise.all([
        api.alerts.getAll().catch(() => []),
        api.resources.getAll().catch(() => []),
        api.incidents.getAll().catch(() => []),
        api.analytics.getAll().catch(() => null)
      ]);

      setAlerts(alertsData);
      setResources(resourcesData);
      setIncidents(incidentsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">Connection Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const availableResources = resources.reduce((acc, resource) => acc + resource.available, 0);
  const totalResources = resources.reduce((acc, resource) => acc + resource.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-gray-900">Disaster Management Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            System Status: Online
          </Badge>
          <Button size="sm" onClick={loadDashboardData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => onPageChange('alerts')}>
            View All Alerts
          </Button>
        </div>
      </div>

      {/* ✅ Updated 3-Card Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Active Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Alerts</p>
              <p className="text-2xl text-gray-900">{activeAlerts.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-red-600"
              onClick={() => onPageChange('alerts')}
            >
              View Details →
            </Button>
          </div>
        </Card>

        {/* Total Incidents */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
              <p className="text-2xl text-gray-900">{incidents.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-blue-600"
              onClick={() => onPageChange('incidents')}
            >
              Manage Incidents →
            </Button>
          </div>
        </Card>

        {/* Available Resources */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Resources</p>
              <p className="text-2xl text-gray-900">{availableResources}/{totalResources}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-green-600"
              onClick={() => onPageChange('resources')}
            >
              View Resources →
            </Button>
          </div>
        </Card>

      </div>

      {/* Rest of the page remains unchanged */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">Recent Alerts</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange('alerts')}
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600">No active alerts</p>
              </div>
            ) : (
              activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${alert.severity === 'critical' ? 'bg-red-500' :
                      alert.severity === 'high' ? 'bg-orange-500' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.location}</p>
                    <div className="flex items-center mt-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(alert.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Resource Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">Resource Status</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange('resources')}
            >
              Manage
            </Button>
          </div>
          <div className="space-y-4">
            {resources.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No resources available</p>
              </div>
            ) : (
              resources.slice(0, 4).map((resource) => {
                const utilization = ((resource.quantity - resource.available) / resource.quantity) * 100;
                return (
                  <div key={resource.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">{resource.name}</span>
                      <span className="text-sm text-gray-600">
                        {resource.available}/{resource.quantity}
                      </span>
                    </div>
                    <Progress value={utilization} className="h-2" />
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => onPageChange('incidents')}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Report New Incident
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => onPageChange('teams')}>
              <Users className="w-4 h-4 mr-2" />
              Deploy Team
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => onPageChange('evacuation')}>
              <MapPin className="w-4 h-4 mr-2" />
              Activate Evacuation
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => onPageChange('communication')}>
              <Activity className="w-4 h-4 mr-2" />
              Send Alert
            </Button>
          </div>
        </Card>

        {/* System Status */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Communication Systems</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Weather Monitoring</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">GPS Tracking</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Database Sync</span>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {incidents.slice(0, 3).map((incident) => (
              <div key={incident.id} className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900">{incident.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(incident.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {incidents.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">No recent activity</p>
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
