import { Alert, Resource, Incident, Team, EvacuationPlan, WeatherData, Message, User } from '../types';

// API Service for Backend Communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic API call function with better error handling
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        // Check if response is ok
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                // Clone the response so we can read it without consuming the body
                const responseClone = response.clone();
                const errorData = await responseClone.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
            } catch (e) {
                // If we can't parse error JSON, try to get text
                try {
                    const responseClone = response.clone();
                    const text = await responseClone.text();
                    if (text) {
                        errorMessage = text;
                    }
                } catch {
                    // If we can't read at all, use default message
                }
            }
            throw new Error(errorMessage);
        }

        // Parse the response as JSON (our API always returns JSON)
        const data = await response.json();
        return data as T;
    } catch (error) {
        // Network errors or other issues
        if (error instanceof Error) {
            console.error('API Error:', error.message);
            throw error;
        }
        throw new Error('An unexpected error occurred');
    }
}

// Type for creating alerts (without id, createdAt, updatedAt)
type CreateAlertData = Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>;

// Type for creating incidents (without id, createdAt, updatedAt)
type CreateIncidentData = Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>;

// Type for creating evacuation plans (without id, lastUpdated)
type CreateEvacuationPlanData = Omit<EvacuationPlan, 'id' | 'lastUpdated'>;

// Type for creating resources (without id)
type CreateResourceData = Omit<Resource, 'id'>;

// Type for creating teams (without id)
type CreateTeamData = Omit<Team, 'id'>;

// Type for creating messages (without id)
type CreateMessageData = Omit<Message, 'id'>;

// ============= ALERTS API =============
export const alertsAPI = {
    getAll: async () => {
        return apiCall<Alert[]>('/alerts');
    },

    getById: async (id: string) => {
        return apiCall<Alert>(`/alerts/${id}`);
    },

    create: async (data: CreateAlertData) => {
        return apiCall<Alert>('/alerts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id: string, data: Partial<Alert>) => {
        return apiCall<{ message: string }>(`/alerts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return apiCall<{ message: string }>(`/alerts/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============= RESOURCES API =============
export const resourcesAPI = {
    getAll: async () => {
        return apiCall<Resource[]>('/resources');
    },

    create: async (data: CreateResourceData) => {
        return apiCall<Resource>('/resources', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: Partial<Resource>) => {
        return apiCall<{ message: string }>(`/resources/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return apiCall<{ message: string }>(`/resources/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============= INCIDENTS API =============
export const incidentsAPI = {
    getAll: async () => {
        return apiCall<Incident[]>('/incidents');
    },

    create: async (data: CreateIncidentData) => {
        return apiCall<Incident>('/incidents', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: Partial<Incident>) => {
        return apiCall<{ message: string }>(`/incidents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return apiCall<{ message: string }>(`/incidents/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============= TEAMS API =============
export const teamsAPI = {
    getAll: async () => {
        return apiCall<Team[]>('/teams');
    },

    create: async (data: CreateTeamData) => {
        return apiCall<Team>('/teams', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: Partial<Team>) => {
        return apiCall<{ message: string }>(`/teams/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return apiCall<{ message: string }>(`/teams/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============= EVACUATION PLANS API =============
export const evacuationPlansAPI = {
    getAll: async () => {
        return apiCall<EvacuationPlan[]>('/evacuation-plans');
    },

    create: async (data: CreateEvacuationPlanData) => {
        return apiCall<EvacuationPlan>('/evacuation-plans', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: Partial<EvacuationPlan>) => {
        return apiCall<{ message: string }>(`/evacuation-plans/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return apiCall<{ message: string }>(`/evacuation-plans/${id}`, {
            method: 'DELETE',
        });
    },
};

// ============= MESSAGES API =============
export const messagesAPI = {
    getAll: async () => {
        return apiCall<Message[]>('/messages');
    },

    create: async (data: CreateMessageData) => {
        return apiCall<Message>('/messages', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============= WEATHER API =============
export const weatherAPI = {
    getByLocation: async (location: string) => {
        return apiCall<WeatherData>(`/weather/${encodeURIComponent(location)}`);
    },

    update: async (data: WeatherData) => {
        return apiCall<WeatherData>('/weather', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

// ============= ANALYTICS API =============
export const analyticsAPI = {
    getAll: async () => {
        return apiCall<any>('/analytics');
    },
};

// ============= USERS API =============
export const usersAPI = {
    getAll: async () => {
        return apiCall<User[]>('/users');
    },
};

export default {
    alerts: alertsAPI,
    resources: resourcesAPI,
    incidents: incidentsAPI,
    teams: teamsAPI,
    evacuationPlans: evacuationPlansAPI,
    messages: messagesAPI,
    weather: weatherAPI,
    analytics: analyticsAPI,
    users: usersAPI,
};