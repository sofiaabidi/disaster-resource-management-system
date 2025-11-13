import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Filter,
  Calendar,
  PieChart,
  LineChart,
  Activity,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  FileBarChart
} from 'lucide-react';
import { mockAnalytics } from '../data/mockData';

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('incidents');

  const periods = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const exportReport = (format: string) => {
    // In a real app, this would generate and download the report
    console.log(`Exporting report in ${format} format...`);
  };

  const getIncidentTrend = () => {
    const currentMonth = mockAnalytics.monthlyIncidents[5]?.incidents || 0;
    const previousMonth = mockAnalytics.monthlyIncidents[4]?.incidents || 0;
    const change = currentMonth - previousMonth;
    const percentage = previousMonth > 0 ? Math.abs((change / previousMonth) * 100) : 0;
    
    return {
      change,
      percentage: percentage.toFixed(1),
      isPositive: change > 0
    };
  };

  const trend = getIncidentTrend();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Disaster management insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
              <p className="text-2xl text-gray-900">{mockAnalytics.totalIncidents}</p>
              <div className="flex items-center mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                )}
                <span className={`text-sm ${trend.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                  {trend.percentage}% vs last month
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileBarChart className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved Incidents</p>
              <p className="text-2xl text-gray-900">{mockAnalytics.resolvedIncidents}</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  {((mockAnalytics.resolvedIncidents / mockAnalytics.totalIncidents) * 100).toFixed(1)}% resolution rate
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Incidents</p>
              <p className="text-2xl text-gray-900">{mockAnalytics.activeIncidents}</p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                <span className="text-sm text-orange-600">Require attention</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Response Time</p>
              <p className="text-2xl text-gray-900">{mockAnalytics.averageResponseTime}</p>
              <div className="flex items-center mt-2">
                <Clock className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600">Target: 15 minutes</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">Incident Trends</h3>
            <Button variant="outline" size="sm">
              <LineChart className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
          <div className="space-y-4">
            {mockAnalytics.monthlyIncidents.map((month, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{month.month}</span>
                  <span className="text-gray-900">{month.incidents} incidents</span>
                </div>
                <Progress value={(month.incidents / 30) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        {/* Incident Types */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900">Incident Types</h3>
            <Button variant="outline" size="sm">
              <PieChart className="w-4 h-4 mr-2" />
              View Chart
            </Button>
          </div>
          <div className="space-y-4">
            {mockAnalytics.incidentsByType.map((type, index) => {
              const total = mockAnalytics.incidentsByType.reduce((acc, t) => acc + t.count, 0);
              const percentage = (type.count / total) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{type.type}</span>
                    <span className="text-gray-900">{type.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Resource Utilization */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-900">Resource Utilization</h3>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-700">
              {mockAnalytics.resourceUtilization}% Efficiency
            </Badge>
            <Button variant="outline" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Optimize
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">42</div>
            <div className="text-sm text-gray-600">Active Teams</div>
            <Progress value={84} className="h-2 mt-2" />
            <div className="text-xs text-gray-500 mt-1">84% Deployed</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">156</div>
            <div className="text-sm text-gray-600">Equipment Units</div>
            <Progress value={72} className="h-2 mt-2" />
            <div className="text-xs text-gray-500 mt-1">72% In Use</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">8</div>
            <div className="text-sm text-gray-600">Vehicles</div>
            <Progress value={88} className="h-2 mt-2" />
            <div className="text-xs text-gray-500 mt-1">88% Active</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">95%</div>
            <div className="text-sm text-gray-600">Readiness Level</div>
            <Progress value={95} className="h-2 mt-2" />
            <div className="text-xs text-gray-500 mt-1">Excellent</div>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Response Times */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Response Time Analysis</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Critical Incidents</span>
                <span>12 min avg</span>
              </div>
              <Progress value={80} className="h-2" />
              <div className="text-xs text-green-600 mt-1">Within target (15 min)</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>High Priority</span>
                <span>18 min avg</span>
              </div>
              <Progress value={72} className="h-2" />
              <div className="text-xs text-yellow-600 mt-1">Near target (25 min)</div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Medium Priority</span>
                <span>35 min avg</span>
              </div>
              <Progress value={70} className="h-2" />
              <div className="text-xs text-green-600 mt-1">Within target (45 min)</div>
            </div>
          </div>
        </Card>

        {/* Team Performance */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Team Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-900">NDRF Battalion 1</div>
                <div className="text-sm text-gray-600">15 incidents resolved</div>
              </div>
              <Badge className="bg-green-100 text-green-700">Excellent</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-900">Fire Response Alpha</div>
                <div className="text-sm text-gray-600">12 incidents resolved</div>
              </div>
              <Badge className="bg-green-100 text-green-700">Good</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-900">Medical Team Beta</div>
                <div className="text-sm text-gray-600">8 incidents resolved</div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">Average</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-900">Police Unit Gamma</div>
                <div className="text-sm text-gray-600">6 incidents resolved</div>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Fair</Badge>
            </div>
          </div>
        </Card>

        {/* Geographic Distribution */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4">Geographic Distribution</h3>
          <div className="space-y-4">
            {[
              { state: 'Maharashtra', incidents: 45, percentage: 28.8 },
              { state: 'Gujarat', incidents: 32, percentage: 20.5 },
              { state: 'Tamil Nadu', incidents: 28, percentage: 17.9 },
              { state: 'Delhi', incidents: 25, percentage: 16.0 },
              { state: 'Others', incidents: 26, percentage: 16.7 }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.state}</span>
                  <span className="text-gray-900">{item.incidents} ({item.percentage}%)</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-900">Export Reports</h3>
          <div className="text-sm text-gray-600">
            Last generated: {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => exportReport('pdf')}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF Report
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => exportReport('excel')}
          >
            <Download className="w-4 h-4 mr-2" />
            Excel Spreadsheet
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => exportReport('csv')}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV Data
          </Button>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm text-gray-900 mb-2">Report Includes:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Incident summary and trends</li>
            <li>• Resource utilization metrics</li>
            <li>• Response time analysis</li>
            <li>• Team performance data</li>
            <li>• Geographic distribution</li>
            <li>• Recommendations and insights</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}