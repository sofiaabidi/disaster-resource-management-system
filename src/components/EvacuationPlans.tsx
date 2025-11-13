import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  RefreshCw,
  Eye,
  Plus,
  Search,
  Filter,
  Play,
  Square,
  AlertTriangle,
  Home,
  Route
} from 'lucide-react';
import api from '../services/api';
import { EvacuationPlan } from '../types';

export function EvacuationPlans() {
  const [plans, setPlans] = useState<EvacuationPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<EvacuationPlan | null>(null);
  const [newPlan, setNewPlan] = useState<{ name: string; area: string; capacity: number }>({
    name: '',
    area: '',
    capacity: 0,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await api.evacuationPlans.getAll();
      setPlans(data);
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      if (!newPlan.name || !newPlan.area) {
        alert('Please fill in all required fields');
        return;
      }

      const planData = {
        name: newPlan.name,
        area: newPlan.area,
        capacity: newPlan.capacity,
        shelters: [],
        routes: [],
        status: 'inactive' as EvacuationPlan['status']
      };

      const createdPlan = await api.evacuationPlans.create(planData);
      
      // Update state immediately with the new plan
      setPlans(prevPlans => [createdPlan, ...prevPlans]);

      setNewPlan({ name: '', area: '', capacity: 0 });
      setIsNewPlanOpen(false);
    } catch (err) {
      console.error('Create failed:', err);
      alert('Failed to create plan.');
    }
  };

  const handleUpdateStatus = async (planId: string, status: EvacuationPlan['status']) => {
    try {
      const plan = plans.find((p) => p.id === planId);
      if (!plan) return;

      await api.evacuationPlans.update(planId, {
        ...plan,
        status,
        lastUpdated: new Date().toISOString(),
      });

      await loadPlans();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update status.');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await api.evacuationPlans.delete(planId);
      await loadPlans();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete plan.');
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const search =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.area.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === 'all' || plan.status === filterStatus;
    return search && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading evacuation plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Evacuation Plans</h1>
          <p className="text-gray-600">Manage evacuation routes and shelters</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={loadPlans}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Evacuation Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Plan Name</label>
                  <Input
                    placeholder="Plan Name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Coverage Area</label>
                  <Input
                    placeholder="Coverage Area"
                    value={newPlan.area}
                    onChange={(e) => setNewPlan({ ...newPlan, area: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Capacity</label>
                  <Input
                    type="number"
                    placeholder="Capacity"
                    value={newPlan.capacity}
                    onChange={(e) =>
                      setNewPlan({ ...newPlan, capacity: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewPlanOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlan} disabled={!newPlan.name || !newPlan.area}>
                    Create
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters - Fixed alignment */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="h-9 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="under-review">Under Review</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Plans List */}
      {filteredPlans.length === 0 ? (
        <Card className="p-12 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">No evacuation plans found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new plan.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg text-gray-900">{plan.name}</h3>
                    <Badge className={getStatusColor(plan.status)}>{plan.status.toUpperCase()}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Area: {plan.area}</p>
                    <p className="text-sm text-gray-600">Capacity: {plan.capacity.toLocaleString()} people</p>
                    <p className="text-sm text-gray-600">Shelters: {plan.shelters?.length || 0}</p>
                    <p className="text-sm text-gray-600">Routes: {plan.routes?.length || 0}</p>
                    <p className="text-sm text-gray-600">Last Updated: {new Date(plan.lastUpdated).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {/* View Details Popup */}
                  <Dialog
                    open={selectedPlan?.id === plan.id}
                    onOpenChange={(open: boolean) => {
                      if (!open) setSelectedPlan(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{plan.name} — Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600">Coverage Area</label>
                            <p className="text-gray-900 mt-1">{plan.area}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Status</label>
                            <Badge className={`${getStatusColor(plan.status)} block w-fit mt-1`}>
                              {plan.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Capacity</label>
                            <p className="text-gray-900 mt-1">{plan.capacity.toLocaleString()}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Last Updated</label>
                            <p className="text-gray-900 mt-1">{new Date(plan.lastUpdated).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Shelters Section */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                            <Home className="w-4 h-4 mr-2" /> Shelters
                          </h4>
                          {plan.shelters && plan.shelters.length > 0 ? (
                            <div className="space-y-2">
                              {plan.shelters.map((shelter, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-900 font-medium">{shelter.name}</p>
                                  <p className="text-xs text-gray-600">Location: {shelter.location}</p>
                                  <p className="text-xs text-gray-600">Capacity: {shelter.capacity} | Status: {shelter.status}</p>
                                  {shelter.facilities && shelter.facilities.length > 0 && (
                                    <p className="text-xs text-gray-600">Facilities: {shelter.facilities.join(', ')}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No shelters defined.</p>
                          )}
                        </div>

                        {/* Routes Section */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                            <Route className="w-4 h-4 mr-2" /> Routes
                          </h4>
                          {plan.routes && plan.routes.length > 0 ? (
                            <div className="space-y-2">
                              {plan.routes.map((route, i) => (
                                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-900 font-medium">{route.name}</p>
                                  <p className="text-xs text-gray-600">From: {route.from} → To: {route.to}</p>
                                  <p className="text-xs text-gray-600">Distance: {route.distance} | Time: {route.estimatedTime}</p>
                                  <p className="text-xs text-gray-600">Status: {route.status}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No routes defined.</p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                            Close
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateStatus(plan.id, plan.status === 'inactive' ? 'active' : 'inactive')
                    }
                  >
                    {plan.status === 'inactive' ? (
                      <>
                        <Play className="w-4 h-4 mr-1" /> Activate
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4 mr-1" /> Deactivate
                      </>
                    )}
                  </Button>

                  <Button variant="outline" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}