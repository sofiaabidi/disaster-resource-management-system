import { Alert, Resource, Incident, Team, EvacuationPlan, WeatherData, Message, User } from '../types';
import api from '../services/api';

// These are fallback mock data - actual data will come from API
export const mockAlerts: Alert[] = [];
export const mockResources: Resource[] = [];
export const mockIncidents: Incident[] = [];
export const mockTeams: Team[] = [];
export const mockEvacuationPlans: EvacuationPlan[] = [];
export const mockMessages: Message[] = [];
export const mockUsers: User[] = [];

export const mockWeatherData: WeatherData = {
  location: 'Delhi',
  temperature: 28,
  humidity: 65,
  windSpeed: 15,
  visibility: 8,
  condition: 'Partly Cloudy',
  alerts: ['Heat Wave Warning'],
  forecast: [
    { date: '2024-12-16', high: 32, low: 22, condition: 'Sunny', precipitation: 0 },
    { date: '2024-12-17', high: 30, low: 20, condition: 'Cloudy', precipitation: 10 },
    { date: '2024-12-18', high: 28, low: 18, condition: 'Rainy', precipitation: 80 }
  ]
};

// Analytics data
export const mockAnalytics = {
  totalIncidents: 156,
  resolvedIncidents: 142,
  activeIncidents: 14,
  averageResponseTime: '18 minutes',
  resourceUtilization: 78,
  monthlyIncidents: [
    { month: 'Jan', incidents: 12 },
    { month: 'Feb', incidents: 8 },
    { month: 'Mar', incidents: 15 },
    { month: 'Apr', incidents: 22 },
    { month: 'May', incidents: 18 },
    { month: 'Jun', incidents: 25 }
  ],
  incidentsByType: [
    { type: 'Natural Disaster', count: 45 },
    { type: 'Fire', count: 32 },
    { type: 'Medical Emergency', count: 28 },
    { type: 'Accident', count: 25 },
    { type: 'Other', count: 26 }
  ]
};

// Data fetching functions
export const fetchAlerts = async (): Promise<Alert[]> => {
  try {
    return await api.alerts.getAll();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return mockAlerts;
  }
};

export const fetchResources = async (): Promise<Resource[]> => {
  try {
    return await api.resources.getAll();
  } catch (error) {
    console.error('Error fetching resources:', error);
    return mockResources;
  }
};

export const fetchIncidents = async (): Promise<Incident[]> => {
  try {
    return await api.incidents.getAll();
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return mockIncidents;
  }
};

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    return await api.teams.getAll();
  } catch (error) {
    console.error('Error fetching teams:', error);
    return mockTeams;
  }
};

export const fetchEvacuationPlans = async (): Promise<EvacuationPlan[]> => {
  try {
    return await api.evacuationPlans.getAll();
  } catch (error) {
    console.error('Error fetching evacuation plans:', error);
    return mockEvacuationPlans;
  }
};

export const fetchMessages = async (): Promise<Message[]> => {
  try {
    return await api.messages.getAll();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return mockMessages;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    return await api.users.getAll();
  } catch (error) {
    console.error('Error fetching users:', error);
    return mockUsers;
  }
};

export const fetchWeather = async (location: string): Promise<WeatherData> => {
  try {
    return await api.weather.getByLocation(location);
  } catch (error) {
    console.error('Error fetching weather:', error);
    return mockWeatherData;
  }
};

export const fetchAnalytics = async () => {
  try {
    return await api.analytics.getAll();
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return mockAnalytics;
  }
};