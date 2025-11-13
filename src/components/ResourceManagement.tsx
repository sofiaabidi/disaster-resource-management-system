
import api from '../services/api';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  Package,
  Plus,
  Search,
  Filter,
  Users,
  Truck,
  Wrench,
  MapPin,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { mockResources } from '../data/mockData';
import { Resource } from '../types';

export function ResourceManagement() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isNewResourceOpen, setIsNewResourceOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'equipment' as Resource['type'],
    quantity: 0,
    available: 0,
    location: '',
    status: 'available' as Resource['status']
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.type === filterType;
    const matchesStatus = filterStatus === 'all' || resource.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });
  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.resources.getAll();
      setResources(data);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateResource = async () => {
    try {
      const createdResource = await api.resources.create(newResource);

      setResources([createdResource, ...resources]);

      setNewResource({
        name: '',
        type: 'equipment',
        quantity: 0,
        available: 0,
        location: '',
        status: 'available'
      });

      setIsNewResourceOpen(false);
    } catch (error) {
      console.error('Error creating resource:', error);
      alert('Failed to create resource');
    }
  };

  const handleUpdateResource = async () => {
    if (!selectedResource) return;

    try {
      await api.resources.update(selectedResource.id, selectedResource);
      await loadResources();
      setIsEditOpen(false);
      setSelectedResource(null);
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      await api.resources.delete(resourceId);
      await loadResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource');
    }
  };

  const handleDeployResource = (resourceId: string, quantity: number) => {
    setResources(resources.map(resource =>
      resource.id === resourceId
        ? {
          ...resource,
          available: Math.max(0, resource.available - quantity),
          status: resource.available - quantity === 0 ? 'deployed' : resource.status
        }
        : resource
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'deployed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personnel': return Users;
      case 'vehicle': return Truck;
      case 'equipment': return Wrench;
      case 'supplies': return Package;
      default: return Package;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Resource Management</h1>
          <p className="text-gray-600">Track and manage emergency response resources</p>
        </div>
        <Dialog open={isNewResourceOpen} onOpenChange={setIsNewResourceOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Name</label>
                <Input
                  value={newResource.name}
                  onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                  placeholder="Resource name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value as Resource['type'] })}
                  >
                    <option value="personnel">Personnel</option>
                    <option value="equipment">Equipment</option>
                    <option value="supplies">Supplies</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newResource.status}
                    onChange={(e) => setNewResource({ ...newResource, status: e.target.value as Resource['status'] })}
                  >
                    <option value="available">Available</option>
                    <option value="deployed">Deployed</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Total Quantity</label>
                  <Input
                    type="number"
                    value={newResource.quantity}
                    onChange={(e) => setNewResource({ ...newResource, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Available</label>
                  <Input
                    type="number"
                    value={newResource.available}
                    onChange={(e) => setNewResource({ ...newResource, available: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Location</label>
                <Input
                  value={newResource.location}
                  onChange={(e) => setNewResource({ ...newResource, location: e.target.value })}
                  placeholder="Resource location"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewResourceOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateResource}>
                  Add Resource
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
              <p className="text-sm text-gray-600 mb-1">Total Resources</p>
              <p className="text-2xl text-gray-900">{resources.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available</p>
              <p className="text-2xl text-gray-900">
                {resources.filter(r => r.status === 'available').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Deployed</p>
              <p className="text-2xl text-gray-900">
                {resources.filter(r => r.status === 'deployed').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Maintenance</p>
              <p className="text-2xl text-gray-900">
                {resources.filter(r => r.status === 'maintenance').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
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
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="personnel">Personnel</option>
              <option value="equipment">Equipment</option>
              <option value="supplies">Supplies</option>
              <option value="vehicle">Vehicle</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="deployed">Deployed</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResources.map((resource) => {
          const IconComponent = getTypeIcon(resource.type);
          const utilization = ((resource.quantity - resource.available) / resource.quantity) * 100;

          return (
            <Card key={resource.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">{resource.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(resource.status)}>
                  {resource.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className="text-sm text-gray-900">
                    {resource.available}/{resource.quantity}
                  </span>
                </div>
                <Progress value={100 - utilization} className="h-2" />

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {resource.location}
                </div>

                {resource.available === 0 && (
                  <div className="flex items-center text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Resource fully deployed
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedResource(resource);
                      setIsEditOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteResource(resource.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {resource.available > 0 && (
                  <Button
                    size="sm"
                    onClick={() => handleDeployResource(resource.id, 1)}
                  >
                    Deploy
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Resource Dialog */}
      {selectedResource && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Name</label>
                <Input
                  value={selectedResource.name}
                  onChange={(e) => setSelectedResource({ ...selectedResource, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Total Quantity</label>
                  <Input
                    type="number"
                    value={selectedResource.quantity}
                    onChange={(e) => setSelectedResource({ ...selectedResource, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Available</label>
                  <Input
                    type="number"
                    value={selectedResource.available}
                    onChange={(e) => setSelectedResource({ ...selectedResource, available: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Location</label>
                <Input
                  value={selectedResource.location}
                  onChange={(e) => setSelectedResource({ ...selectedResource, location: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={selectedResource.status}
                  onChange={(e) => setSelectedResource({ ...selectedResource, status: e.target.value as Resource['status'] })}
                >
                  <option value="available">Available</option>
                  <option value="deployed">Deployed</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateResource}>
                  Update Resource
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredResources.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new resource.</p>
        </Card>
      )}
    </div>
  );
}