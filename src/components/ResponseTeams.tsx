import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import {
  Users,
  Plus,
  Search,
  Filter,
  Phone,
  MapPin,
  Shield,
  Flame,
  Heart,
  Eye,
  Navigation
} from 'lucide-react';
import { Team } from '../types';

export function ResponseTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isNewTeamOpen, setIsNewTeamOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    type: 'rescue' as Team['type'],
    leader: '',
    location: '',
    contact: ''
  });
  const [deploymentLocation, setDeploymentLocation] = useState('');

  const filteredTeams = teams.filter(team => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leader.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || team.type === filterType;
    const matchesStatus = filterStatus === 'all' || team.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await api.teams.getAll();
      setTeams(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      const teamData = {
        ...newTeam,
        members: [],
        status: 'available' as Team['status'],
        equipment: []
      };
      const createdTeam = await api.teams.create(teamData);
      setTeams([createdTeam, ...teams]);
      setNewTeam({
        name: '',
        type: 'rescue',
        leader: '',
        location: '',
        contact: ''
      });
      setIsNewTeamOpen(false);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team');
    }
  };

  const handleDeployTeam = async (teamId: string) => {
    try {
      const team = teams.find(t => t.id === teamId);
      if (!team) return;

      await api.teams.update(teamId, {
        ...team,
        status: 'deployed',
        location: deploymentLocation
      });

      await loadTeams();
      setDeploymentLocation('');
      setIsDeployOpen(false);
      setSelectedTeam(null);
    } catch (error) {
      console.error('Error deploying team:', error);
      alert('Failed to deploy team');
    }
  };

  const handleRecallTeam = async (teamId: string) => {
    try {
      const team = teams.find(t => t.id === teamId);
      if (!team) return;

      await api.teams.update(teamId, {
        ...team,
        status: 'available'
      });

      await loadTeams();
    } catch (error) {
      console.error('Error recalling team:', error);
      alert('Failed to recall team');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'deployed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'training': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fire': return Flame;
      case 'medical': return Heart;
      case 'police': return Shield;
      case 'rescue': return Users;
      case 'evacuation': return Navigation;
      default: return Users;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fire': return 'text-red-500';
      case 'medical': return 'text-blue-500';
      case 'police': return 'text-indigo-500';
      case 'rescue': return 'text-orange-500';
      case 'evacuation': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Emergency Response Teams</h1>
          <p className="text-gray-600">Manage and deploy emergency response teams</p>
        </div>
        <Dialog open={isNewTeamOpen} onOpenChange={setIsNewTeamOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Team Name</label>
                <Input
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  placeholder="Team name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newTeam.type}
                  onChange={(e) => setNewTeam({ ...newTeam, type: e.target.value as Team['type'] })}
                >
                  <option value="fire">Fire Department</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="police">Police</option>
                  <option value="rescue">Search & Rescue</option>
                  <option value="evacuation">Evacuation</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Team Leader</label>
                <Input
                  value={newTeam.leader}
                  onChange={(e) => setNewTeam({ ...newTeam, leader: e.target.value })}
                  placeholder="Team leader name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Location</label>
                <Input
                  value={newTeam.location}
                  onChange={(e) => setNewTeam({ ...newTeam, location: e.target.value })}
                  placeholder="Team location"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Contact</label>
                <Input
                  value={newTeam.contact}
                  onChange={(e) => setNewTeam({ ...newTeam, contact: e.target.value })}
                  placeholder="Contact number"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewTeamOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam}>
                  Add Team
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
              <p className="text-sm text-gray-600 mb-1">Total Teams</p>
              <p className="text-2xl text-gray-900">{teams.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available</p>
              <p className="text-2xl text-gray-900">
                {teams.filter(t => t.status === 'available').length}
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
                {teams.filter(t => t.status === 'deployed').length}
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
              <p className="text-sm text-gray-600 mb-1">In Training</p>
              <p className="text-2xl text-gray-900">
                {teams.filter(t => t.status === 'training').length}
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
              placeholder="Search teams..."
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
              <option value="fire">Fire Department</option>
              <option value="medical">Medical Emergency</option>
              <option value="police">Police</option>
              <option value="rescue">Search & Rescue</option>
              <option value="evacuation">Evacuation</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="deployed">Deployed</option>
              <option value="training">Training</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeams.map((team) => {
          const IconComponent = getTypeIcon(team.type);

          return (
            <Card key={team.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent className={`w-6 h-6 ${getTypeColor(team.type)}`} />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{team.type} Team</p>
                  </div>
                </div>
                <Badge className={getStatusColor(team.status)}>
                  {team.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  Leader: {team.leader}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {team.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {team.contact}
                </div>
                <div className="text-sm text-gray-600">
                  Members: {team.members.length > 0 ? team.members.length : 'TBD'}
                </div>
              </div>

              {/* ↓↓↓ Only "View" button retained */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTeam(team)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                {team.status === 'available' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsDeployOpen(true);
                    }}
                  >
                    Deploy
                  </Button>
                )}
                {team.status === 'deployed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecallTeam(team.id)}
                  >
                    Recall
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Team Details Dialog */}
      {selectedTeam && !isDeployOpen && (
        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTeam.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Type</label>
                  <p className="text-gray-900 mt-1 capitalize">{selectedTeam.type}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(selectedTeam.status)} block w-fit mt-1`}>
                    {selectedTeam.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Team Leader</label>
                  <p className="text-gray-900 mt-1">{selectedTeam.leader}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Contact</label>
                  <p className="text-gray-900 mt-1">{selectedTeam.contact}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Location</label>
                <p className="text-gray-900 mt-1">{selectedTeam.location}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Team Members</label>
                <div className="mt-1">
                  {selectedTeam.members.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-900">
                      {selectedTeam.members.map((member, index) => (
                        <li key={index}>{member}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No members assigned</p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Equipment</label>
                <div className="mt-1">
                  {selectedTeam.equipment.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-900">
                      {selectedTeam.equipment.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No equipment assigned</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedTeam(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Deployment Dialog */}
      {isDeployOpen && selectedTeam && (
        <Dialog open={isDeployOpen} onOpenChange={setIsDeployOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Deploy Team</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Deploy <strong>{selectedTeam.name}</strong> to a location:</p>
              <Input
                placeholder="Deployment location"
                value={deploymentLocation}
                onChange={(e) => setDeploymentLocation(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeployOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleDeployTeam(selectedTeam.id)}>
                  Confirm Deployment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
