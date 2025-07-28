import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  TrendingUp,
  Calendar,
  Plus,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  DollarSign,
  Activity
} from 'lucide-react';
import { events } from '@/data/events';

interface EnhancedOverviewProps {
  onCreateEvent: () => void;
}

// Sample data for charts
const revenueData = [
  { month: 'Jan', revenue: 12000, bookings: 145 },
  { month: 'Feb', revenue: 15000, bookings: 180 },
  { month: 'Mar', revenue: 18000, bookings: 220 },
  { month: 'Apr', revenue: 22000, bookings: 265 },
  { month: 'May', revenue: 25000, bookings: 310 },
  { month: 'Jun', revenue: 28000, bookings: 340 },
  { month: 'Jul', revenue: 30000, bookings: 360 },
  { month: 'Aug', revenue: 32000, bookings: 385 },
  { month: 'Sep', revenue: 35000, bookings: 410 },
  { month: 'Oct', revenue: 37000, bookings: 430 },
  { month: 'Nov', revenue: 40000, bookings: 460 },
  { month: 'Dec', revenue: 42000, bookings: 490 }
];

const categoryData = [
  { name: 'Music', value: 35, color: '#8884d8' },
  { name: 'Tech', value: 25, color: '#82ca9d' },
  { name: 'Sports', value: 20, color: '#ffc658' },
  { name: 'Art', value: 15, color: '#ff7300' },
  { name: 'Food', value: 5, color: '#0088fe' }
];

const weeklyData = [
  { day: 'Mon', visitors: 2400, bookings: 40 },
  { day: 'Tue', visitors: 1398, bookings: 30 },
  { day: 'Wed', visitors: 9800, bookings: 90 },
  { day: 'Thu', visitors: 3908, bookings: 50 },
  { day: 'Fri', visitors: 4800, bookings: 70 },
  { day: 'Sat', visitors: 3800, bookings: 60 },
  { day: 'Sun', visitors: 4300, bookings: 65 }
];

const EnhancedOverview: React.FC<EnhancedOverviewProps> = ({ onCreateEvent }) => {
  const totalBookings = 1247;
  const totalRevenue = 86420;
  const upcomingEvents = events.length;
  const totalUsers = 2840;

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-600 dark:text-green-400">+12.5%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Bookings</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalBookings}</p>
                <div className="flex items-center text-xs">
                  <Activity className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-blue-600 dark:text-blue-400">+8.2%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Events</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{upcomingEvents}</p>
                <div className="flex items-center text-xs">
                  <Calendar className="h-3 w-3 text-purple-500 mr-1" />
                  <span className="text-purple-600 dark:text-purple-400">+5 new</span>
                  <span className="text-gray-500 ml-1">this week</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{totalUsers}</p>
                <div className="flex items-center text-xs">
                  <Users className="h-3 w-3 text-orange-500 mr-1" />
                  <span className="text-orange-600 dark:text-orange-400">+15.3%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg dark:text-white">
              <TrendingUp className="mr-2 h-5 w-5" />
              Revenue & Bookings Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                />
                <YAxis className="text-xs fill-gray-600 dark:fill-gray-400" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg dark:text-white">
              <Star className="mr-2 h-5 w-5" />
              Events by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Analytics */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-lg dark:text-white">
            <Activity className="mr-2 h-5 w-5" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                className="text-xs fill-gray-600 dark:fill-gray-400"
              />
              <YAxis className="text-xs fill-gray-600 dark:fill-gray-400" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="visitors"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={onCreateEvent}
              className="w-full justify-start"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-lg dark:text-white">
              <Activity className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  icon: CheckCircle,
                  color: 'text-green-600 dark:text-green-400',
                  bgColor: 'bg-green-100 dark:bg-green-900/20',
                  title: 'New booking confirmed',
                  subtitle: 'Summer Music Fest - 2 minutes ago',
                  badge: 'Success'
                },
                {
                  icon: Calendar,
                  color: 'text-blue-600 dark:text-blue-400',
                  bgColor: 'bg-blue-100 dark:bg-blue-900/20',
                  title: 'Event created',
                  subtitle: 'Tech Conference 2024 - 15 minutes ago',
                  badge: 'New'
                },
                {
                  icon: AlertCircle,
                  color: 'text-yellow-600 dark:text-yellow-400',
                  bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
                  title: 'Payment pending',
                  subtitle: 'Art Workshop - 1 hour ago',
                  badge: 'Pending'
                },
                {
                  icon: Star,
                  color: 'text-purple-600 dark:text-purple-400',
                  bgColor: 'bg-purple-100 dark:bg-purple-900/20',
                  title: '5-star review received',
                  subtitle: 'Comedy Night - 2 hours ago',
                  badge: 'Review'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${activity.bgColor}`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium dark:text-white">{activity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.subtitle}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.badge}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedOverview;