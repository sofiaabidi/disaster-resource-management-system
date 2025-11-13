import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  MapPin,
  Clock,
  Users,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';
import { Alert } from '../types';

export function EmergencyAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isNewAlertOpen, setIsNewAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAlert, setNewAlert] = useState({
    title: '',
    severity: 'medium' as Alert['severity'],
    type: 'natural' as Alert['type'],
    location: '',
    description: ''
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.alerts.getAll();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleCreateAlert = async () => {
    try {
      if (!newAlert.title || !newAlert.location) {
        alert('Please fill in all required fields');
        return;
      }

      const alertData = {
        title: newAlert.title,
        severity: newAlert.severity,
        type: newAlert.type,
        location: newAlert.location,
        description: newAlert.description,
        status: 'active' as Alert['status']
      };

      // Create the alert and wait for completion
      const createdAlert = await api.alerts.create(alertData);

      // Update state immediately with the new alert
      setAlerts(prevAlerts => [createdAlert, ...prevAlerts]);

      // Clear the form
      setNewAlert({
        title: '',
        severity: 'medium',
        type: 'natural',
        location: '',
        description: ''
      });

      setIsNewAlertOpen(false);
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert. Please try again.');
    }
  };

  const handleUpdateAlertStatus = async (alertId: string, newStatus: Alert['status']) => {
    try {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;

      await api.alerts.update(alertId, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      // Update the alert in state immediately
      setAlerts(prevAlerts =>
        prevAlerts.map(a =>
          a.id === alertId
            ? { ...a, status: newStatus, updatedAt: new Date().toISOString() }
            : a
        )
      );
    } catch (error) {
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    try {
      await api.alerts.delete(alertId);

      // Remove from state immediately
      setAlerts(prevAlerts => prevAlerts.filter(a => a.id !== alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
      alert('Failed to delete alert. Please try again.');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-700 border-red-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Emergency Alerts</h1>
          <p className="text-gray-600">Monitor and manage emergency alerts and warnings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={loadAlerts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>

          <Dialog open={isNewAlertOpen} onOpenChange={setIsNewAlertOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Title</label>
                  <Input
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                    placeholder="Alert title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">Severity</label>
                    <select
                      className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md bg-white"
                      value={newAlert.severity}
                      onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as Alert['severity'] })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 mb-1 block">Type</label>
                    <select
                      className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md bg-white"
                      value={newAlert.type}
                      onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as Alert['type'] })}
                    >
                      <option value="natural">Natural</option>
                      <option value="man-made">Man-made</option>
                      <option value="health">Health</option>
                      <option value="security">Security</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Location</label>
                  <Input
                    value={newAlert.location}
                    onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                    placeholder="Incident location"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Description</label>
                  <Textarea
                    value={newAlert.description}
                    onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                    placeholder="Alert description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewAlertOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAlert} disabled={!newAlert.title || !newAlert.location}>
                    Create Alert
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="h-9 px-3 py-2 border border-gray-300 rounded-md bg-white"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              className="h-9 px-3 py-2 border border-gray-300 rounded-md bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className={`w-5 h-5 ${alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'high' ? 'text-orange-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                  <h3 className="text-lg text-gray-900">{alert.title}</h3>
                  <div className="flex space-x-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{alert.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {alert.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(alert.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {alert.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateAlertStatus(alert.id, 'monitoring')}
                  >
                    Monitor
                  </Button>
                )}
                {alert.status === 'monitoring' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateAlertStatus(alert.id, 'resolved')}
                  >
                    Resolve
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Alert Details Dialog */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedAlert.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Severity</label>
                  <Badge className={`${getSeverityColor(selectedAlert.severity)} block w-fit mt-1`}>
                    {selectedAlert.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(selectedAlert.status)} block w-fit mt-1`}>
                    {selectedAlert.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Location</label>
                <p className="text-gray-900 mt-1">{selectedAlert.location}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">{selectedAlert.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Created</label>
                  <p className="text-gray-900 mt-1">{new Date(selectedAlert.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Updated</label>
                  <p className="text-gray-900 mt-1">{new Date(selectedAlert.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredAlerts.length === 0 && (
        <Card className="p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new alert.</p>
        </Card>
      )}
    </div>
  );
}