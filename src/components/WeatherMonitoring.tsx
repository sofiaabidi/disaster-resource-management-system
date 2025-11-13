import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Eye,
  Thermometer,
  Droplets,
  AlertTriangle,
  RefreshCw,
  Search,
  MapPin,
  Clock
} from 'lucide-react';
import api from '../services/api';
import { WeatherData } from '../types';

export function WeatherMonitoring() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('Delhi');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locations = [
    'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad',
    'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow'
  ];

  useEffect(() => {
    loadWeatherData(selectedLocation);
  }, [selectedLocation]);

  const loadWeatherData = async (location: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.weather.getByLocation(location);
      setWeatherData(data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to load weather data. Using default data.');
      // Fallback to default data with AQI, UV, and sun times
      setWeatherData({
        location: location,
        temperature: 28,
        humidity: 65,
        windSpeed: 15,
        visibility: 8,
        condition: 'Partly Cloudy',
        alerts: [],
        forecast: [],
        aqi: {
          overall: 120,
          pm25: 55,
          pm10: 105,
          level: 'Moderate'
        },
        uvIndex: {
          value: 7,
          level: 'High'
        },
        sunTimes: {
          sunrise: '06:30 AM',
          sunset: '06:15 PM'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const handleRefresh = () => {
    loadWeatherData(selectedLocation);
  };

  const handleSearch = () => {
    if (searchLocation.trim()) {
      setSelectedLocation(searchLocation);
      setSearchLocation('');
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return Sun;
      case 'rainy':
      case 'rain':
        return CloudRain;
      case 'cloudy':
      case 'partly cloudy':
        return Cloud;
      default:
        return Cloud;
    }
  };

  const getAlertSeverity = (alert: string) => {
    if (alert.toLowerCase().includes('warning') || alert.toLowerCase().includes('severe')) {
      return 'high';
    } else if (alert.toLowerCase().includes('watch') || alert.toLowerCase().includes('advisory')) {
      return 'medium';
    }
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading && !weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">Failed to Load Weather Data</h3>
          <p className="text-gray-600 mb-4">{error || 'Unable to fetch weather information'}</p>
          <Button onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weatherData.condition);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Weather Monitoring</h1>
          <p className="text-gray-600">Real-time weather data and alerts for disaster preparedness</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-800">{error}</p>
          </div>
        </Card>
      )}

      {/* Location Selector */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? "default" : "outline"}
                size="sm"
                onClick={() => handleLocationChange(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Current Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Weather Card */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {weatherData.location}
              </h2>
              <p className="text-gray-600 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center">
                <WeatherIcon className="w-16 h-16 text-blue-500 mr-4" />
                <div>
                  <div className="text-4xl text-gray-900">{weatherData.temperature}°C</div>
                  <div className="text-gray-600">{weatherData.condition}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl text-gray-900">{weatherData.humidity}%</div>
              <div className="text-sm text-gray-600">Humidity</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Wind className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl text-gray-900">{weatherData.windSpeed} km/h</div>
              <div className="text-sm text-gray-600">Wind Speed</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Eye className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl text-gray-900">{weatherData.visibility} km</div>
              <div className="text-sm text-gray-600">Visibility</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Thermometer className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-2xl text-gray-900">{weatherData.temperature + 2}°C</div>
              <div className="text-sm text-gray-600">Feels Like</div>
            </div>
          </div>
        </Card>

        {/* Weather Alerts */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Active Alerts
          </h3>
          <div className="space-y-3">
            {weatherData.alerts.length > 0 ? (
              weatherData.alerts.map((alert, index) => {
                const severity = getAlertSeverity(alert);
                return (
                  <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(severity)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={getSeverityColor(severity)}>
                        {severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs">Active</span>
                    </div>
                    <p className="text-sm">{alert}</p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <p className="text-sm text-gray-600">No active weather alerts</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Forecast */}
      {weatherData.forecast.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Weather Forecast</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weatherData.forecast.map((day, index) => {
              const DayIcon = getWeatherIcon(day.condition);
              return (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <DayIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-900 mb-1">{day.condition}</div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900">{day.high}°</span>
                      <span className="text-gray-600">{day.low}°</span>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                      {day.precipitation}% rain
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Additional Weather Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Air Quality */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Air Quality Index</h3>
          <div className="space-y-4">
            {weatherData.aqi ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>PM2.5</span>
                    <span>{weatherData.aqi.pm25} µg/m³</span>
                  </div>
                  <Progress value={Math.min(weatherData.aqi.pm25 * 2, 100)} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">
                    {weatherData.aqi.pm25 < 50 ? 'Good' : weatherData.aqi.pm25 < 100 ? 'Moderate' : 'Unhealthy'}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>PM10</span>
                    <span>{weatherData.aqi.pm10} µg/m³</span>
                  </div>
                  <Progress value={Math.min(weatherData.aqi.pm10, 100)} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">
                    {weatherData.aqi.pm10 < 50 ? 'Good' : weatherData.aqi.pm10 < 100 ? 'Moderate' : 'Unhealthy'}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall AQI</span>
                    <span>{weatherData.aqi.overall}</span>
                  </div>
                  <Progress value={Math.min((weatherData.aqi.overall / 300) * 100, 100)} className="h-2" />
                  <div className="text-xs text-gray-600 mt-1">{weatherData.aqi.level}</div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">AQI data not available</div>
            )}
          </div>
        </Card>

        {/* UV Index & Solar Radiation */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">UV Index & Solar Data</h3>
          <div className="space-y-4">
            {weatherData.uvIndex ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl text-gray-900">{weatherData.uvIndex.value}</div>
                    <div className="text-sm text-gray-600">UV Index</div>
                  </div>
                  <Badge className={
                    weatherData.uvIndex.level === 'Very High' || weatherData.uvIndex.level === 'Extreme'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : weatherData.uvIndex.level === 'High'
                      ? 'bg-orange-100 text-orange-700 border-orange-200'
                      : weatherData.uvIndex.level === 'Moderate'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      : 'bg-green-100 text-green-700 border-green-200'
                  }>
                    {weatherData.uvIndex.level.toUpperCase()}
                  </Badge>
                </div>
                {weatherData.sunTimes && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Sunrise</div>
                      <div className="text-gray-900">{weatherData.sunTimes.sunrise}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Sunset</div>
                      <div className="text-gray-900">{weatherData.sunTimes.sunset}</div>
                    </div>
                  </div>
                )}
                {weatherData.uvIndex.value >= 8 && (
                  <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                    ⚠️ High UV levels - protective measures recommended
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">UV Index data not available</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}