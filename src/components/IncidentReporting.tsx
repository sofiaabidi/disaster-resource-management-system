import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  FileText,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Users
} from 'lucide-react';
import { mockIncidents } from '../data/mockData';
import { Incident } from '../types';

export function IncidentReporting() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    type: '',
    severity: 'medium' as Incident['severity'],
    location: '',
    description: '',
    reportedBy: ''
  });

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });
  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.incidents.getAll();
      setIncidents(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIncident = async () => {
    try {
      const incidentData = {
        ...newIncident,
        coordinates: { lat: 28.6139, lng: 77.2090 },
        status: 'reported' as Incident['status']
      };

      const createdIncident = await api.incidents.create(incidentData);

      // Update state immediately with the new incident
      setIncidents(prevIncidents => [createdIncident, ...prevIncidents]);

      setNewIncident({
        title: '',
        type: '',
        severity: 'medium',
        location: '',
        description: '',
        reportedBy: ''
      });
      setIsNewIncidentOpen(false);
    } catch (error) {
      console.error('Error creating incident:', error);
      alert('Failed to create incident. Please try again.');
    }
  };

  const handleUpdateIncidentStatus = async (incidentId: string, newStatus: Incident['status']) => {
    try {
      const incident = incidents.find(i => i.id === incidentId);
      if (!incident) return;

      await api.incidents.update(incidentId, {
        ...incident,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      await loadIncidents();
    } catch (error) {
      console.error('Error:', error);
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
      case 'reported': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'investigating': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'responding': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Incident Reporting</h1>
          <p className="text-gray-600">Report and track emergency incidents</p>
        </div>
        <Dialog open={isNewIncidentOpen} onOpenChange={setIsNewIncidentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Report New Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Incident Title</label>
                <Input
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  placeholder="Brief description of incident"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Type</label>
                  <Input
                    value={newIncident.type}
                    onChange={(e) => setNewIncident({ ...newIncident, type: e.target.value })}
                    placeholder="e.g., Fire, Flood"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Severity</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as Incident['severity'] })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Location</label>
                <Input
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({ ...newIncident, location: e.target.value })}
                  placeholder="Incident location"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Reported By</label>
                <Input
                  value={newIncident.reportedBy}
                  onChange={(e) => setNewIncident({ ...newIncident, reportedBy: e.target.value })}
                  placeholder="Reporter name/organization"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Description</label>
                <Textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                  placeholder="Detailed description of the incident"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewIncidentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateIncident}>
                  Report Incident
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
              <p className="text-2xl text-gray-900">{incidents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <p className="text-2xl text-gray-900">
                {incidents.filter(i => ['reported', 'investigating', 'responding'].includes(i.status)).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="text-2xl text-gray-900">
                {incidents.filter(i => i.status === 'resolved').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Critical</p>
              <p className="text-2xl text-gray-900">
                {incidents.filter(i => i.severity === 'critical').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
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
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="reported">Reported</option>
              <option value="investigating">Investigating</option>
              <option value="responding">Responding</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg text-gray-900">{incident.title}</h3>
                  <div className="flex space-x-2">
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{incident.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {incident.location}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {incident.reportedBy}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(incident.createdAt).toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {incident.type}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIncident(incident)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                {incident.status === 'reported' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateIncidentStatus(incident.id, 'investigating')}
                  >
                    Investigate
                  </Button>
                )}
                {incident.status === 'investigating' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateIncidentStatus(incident.id, 'responding')}
                  >
                    Respond
                  </Button>
                )}
                {incident.status === 'responding' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateIncidentStatus(incident.id, 'resolved')}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Incident Details Dialog */}
      {selectedIncident && (
        <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedIncident.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Severity</label>
                  <Badge className={`${getSeverityColor(selectedIncident.severity)} block w-fit mt-1`}>
                    {selectedIncident.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(selectedIncident.status)} block w-fit mt-1`}>
                    {selectedIncident.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Type</label>
                  <p className="text-gray-900 mt-1">{selectedIncident.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <p className="text-gray-900 mt-1">{selectedIncident.location}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <p className="text-gray-900 mt-1">{selectedIncident.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Reported By</label>
                  <p className="text-gray-900 mt-1">{selectedIncident.reportedBy}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Assigned Team</label>
                  <p className="text-gray-900 mt-1">{selectedIncident.assignedTeam || 'Not assigned'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Reported</label>
                  <p className="text-gray-900 mt-1">{new Date(selectedIncident.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Updated</label>
                  <p className="text-gray-900 mt-1">{new Date(selectedIncident.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedIncident(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredIncidents.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">No incidents found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or report a new incident.</p>
        </Card>
      )}
    </div>
  );
}