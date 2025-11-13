// Types for the disaster management system
export interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'natural' | 'man-made' | 'health' | 'security';
  location: string;
  description: string;
  status: 'active' | 'resolved' | 'monitoring';
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'personnel' | 'equipment' | 'supplies' | 'vehicle';
  quantity: number;
  available: number;
  location: string;
  status: 'available' | 'deployed' | 'maintenance';
  assignedTo?: string;
}

export interface Incident {
  id: string;
  title: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  reportedBy: string;
  status: 'reported' | 'investigating' | 'responding' | 'resolved';
  assignedTeam?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  type: 'fire' | 'medical' | 'police' | 'rescue' | 'evacuation';
  leader: string;
  members: string[];
  status: 'available' | 'deployed' | 'training';
  location: string;
  equipment: string[];
  contact: string;
}

export interface EvacuationPlan {
  id: string;
  name: string;
  area: string;
  capacity: number;
  shelters: Shelter[];
  routes: Route[];
  status: 'active' | 'inactive' | 'under-review';
  lastUpdated: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  contact: string;
  status: 'operational' | 'full' | 'maintenance';
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  estimatedTime: string;
  status: 'clear' | 'blocked' | 'congested';
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: string;
  alerts: string[];
  forecast: WeatherForecast[];
  aqi?: {
    overall: number;
    pm25: number;
    pm10: number;
    level: string;
  };
  uvIndex?: {
    value: number;
    level: string;
  };
  sunTimes?: {
    sunrise: string;
    sunset: string;
  };
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

export interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  contact: string;
  lastActive: string;
}