import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Calendar, 
  User, 
  TrendingUp,
  Activity,
  BarChart3,
  ChevronRight,
  MapPin,
  Star,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalReports: 0,
    completedToday: 0,
    pendingReports: 0,
    failedInspections: 0,
    averageRating: 0,
    thisMonthReports: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Get the auth token
    const token = localStorage.getItem('carchain_auth_token');
    
    console.log('🔄 Fetching reports from backend...');
const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Received reports:', data.length);
    
    setReports(data);
    calculateStats(data);
  } catch (error) {
    console.error('❌ Error fetching reports:', error);
    setError(error.message);
    
    // Fallback to sample data for development
    const sampleData = getSampleReports();
    setReports(sampleData);
    calculateStats(sampleData);
  } finally {
    setLoading(false);
  }
};

  const getSampleReports = () => [
    {
      _id: '1',
      customerName: 'Daniyal Masood',
      make: 'Toyota',
      model: 'Corolla',
      variant: 'GLi',
      year: 2020,
      registrationNo: 'KT-5400',
      chassisNo: 'KUN25R-9605754',
      engineNo: '2KD-U486604',
      location: 'Karachi',
      inspectionDate: new Date().toISOString(),
      status: 'completed',
      inspector: 'Ahmed Ali',
      overallRating: 7.7,
      createdAt: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
      inspectionResults: {
        engine: { 'Engine Oil': 'Good', 'Engine Sound': 'Normal', 'Air Filter': 'Clean' },
        transmission: { 'Gear Shifting': 'Smooth', 'Clutch Operation': 'Good' },
        brakes: { 'Front Brake Pads': 'Good', 'Brake Fluid': 'Ok' }
      }
    },
    {
      _id: '2',
      customerName: 'Sarah Ahmed',
      make: 'Honda',
      model: 'Civic',
      variant: 'VTi',
      year: 2019,
      registrationNo: 'ABC-123',
      chassisNo: 'HONDA123456789',
      engineNo: 'H123456',
      location: 'Lahore',
      inspectionDate: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      status: 'pending',
      inspector: 'Ali Hassan',
      overallRating: 8.2,
      createdAt: new Date(Date.now() - 900000).toISOString(),
      inspectionResults: {
        engine: { 'Engine Oil': 'Excellent', 'Engine Sound': 'Normal' },
        brakes: { 'Front Brake Pads': 'Good', 'Brake Fluid': 'Good' }
      }
    },
    {
      _id: '3',
      customerName: 'Muhammad Khan',
      make: 'Suzuki',
      model: 'Mehran',
      year: 2018,
      registrationNo: 'XYZ-789',
      location: 'Islamabad',
      inspectionDate: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'pending',
      inspector: 'Fatima Sheikh',
      overallRating: 6.5,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: '4',
      customerName: 'Aisha Malik',
      make: 'Toyota',
      model: 'Vitz',
      year: 2017,
      registrationNo: 'DEF-456',
      location: 'Karachi',
      inspectionDate: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      status: 'failed',
      inspector: 'Ahmed Ali',
      overallRating: 4.2,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      _id: '5',
      customerName: 'Hassan Ali',
      make: 'Honda',
      model: 'City',
      year: 2021,
      registrationNo: 'GHI-123',
      location: 'Lahore',
      inspectionDate: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      status: 'completed',
      inspector: 'Ali Hassan',
      overallRating: 8.9,
      createdAt: new Date(Date.now() - 10800000).toISOString()
    },
    {
      _id: '6',
      customerName: 'Zara Khan',
      make: 'Suzuki',
      model: 'Alto',
      year: 2020,
      registrationNo: 'JKL-456',
      location: 'Faisalabad',
      inspectionDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      status: 'completed',
      inspector: 'Ahmed Ali',
      overallRating: 7.3,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const calculateStats = (reportsData) => {
    const now = new Date();
    const today = now.toDateString();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Calculate statistics
    const completedToday = reportsData.filter(r => 
      r.status === 'completed' && 
      new Date(r.inspectionDate).toDateString() === today
    ).length;

    const pendingReports = reportsData.filter(r => r.status === 'pending').length;
    const failedInspections = reportsData.filter(r => r.status === 'failed').length;

    // This month's reports
    const thisMonthReports = reportsData.filter(r => {
      const reportDate = new Date(r.createdAt);
      return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
    }).length;

    // Average rating
    const ratingsSum = reportsData.reduce((sum, r) => sum + (r.overallRating || 0), 0);
    const averageRating = reportsData.length > 0 ? (ratingsSum / reportsData.length).toFixed(1) : 0;

    setDashboardStats({
      totalReports: reportsData.length,
      completedToday,
      pendingReports,
      failedInspections,
      averageRating: parseFloat(averageRating),
      thisMonthReports
    });
  };

  const getRecentActivity = () => {
    return reports
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 15) // Show more activities
      .map(report => {
        const timeAgo = getTimeAgo(new Date(report.createdAt));
        let statusColor = 'bg-blue-500';
        let action = 'inspection started';

        switch (report.status) {
          case 'completed':
            statusColor = 'bg-green-500';
            action = 'inspection completed';
            break;
          case 'pending':
            statusColor = 'bg-yellow-500';
            action = 'pending review';
            break;
          case 'failed':
            statusColor = 'bg-red-500';
            action = 'failed inspection';
            break;
          case 'in-progress':
            statusColor = 'bg-blue-500';
            action = 'inspection in progress';
            break;
        }

        return {
          id: report._id,
          text: `${report.make} ${report.model} ${report.registrationNo}`,
          action: action,
          time: timeAgo,
          color: statusColor,
          inspector: report.inspector,
          location: report.location,
          customer: report.customerName,
          rating: report.overallRating
        };
      });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  const getTopCarBrands = () => {
    const brandCounts = {};
    reports.forEach(report => {
      const brand = report.make;
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
    });

    const total = reports.length;
    const sortedBrands = Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([brand, count]) => ({
        brand,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }));

    // Add colors for different brands
    const brandColors = {
      'Toyota': '#dc2626', // red
      'Honda': '#2563eb', // blue
      'Suzuki': '#16a34a', // green
      'Hyundai': '#9333ea', // purple
      'Nissan': '#ea580c', // orange
    };

    return sortedBrands.map(brand => ({
      ...brand,
      color: brandColors[brand.brand] || '#64748b'
    }));
  };

  const getMonthlyData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentDate = new Date();
    const data = [];
    
    // Generate data for last 6 months including current month
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthIndex = targetDate.getMonth();
      const year = targetDate.getFullYear();
      const monthName = months[monthIndex];
      
      // Calculate actual reports for this month
      const monthReports = reports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate.getMonth() === monthIndex && reportDate.getFullYear() === year;
      }).length;
      
      data.push({
        month: monthName,
        value: monthReports,
        isCurrentMonth: monthIndex === currentDate.getMonth() && year === currentDate.getFullYear()
      });
    }
    
    return data;
  };

  const monthlyData = getMonthlyData();
  const maxValue = Math.max(...monthlyData.map(d => d.value), 1); // Ensure minimum of 1
  const recentActivity = getRecentActivity();
  const topBrands = getTopCarBrands();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Vehicle inspection management overview</p>
            </div>
            <div className="flex items-center text-sm text-slate-500">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-800 font-medium">Database connection issue</p>
                <p className="text-yellow-700 text-sm">Showing sample data. Error: {error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Main Statistics Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Total Reports</h2>
              <p className="text-slate-600 mt-1">Complete inspection overview</p>
            </div>
            <div className="p-4 bg-red-100 rounded-full">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="text-4xl font-bold text-red-600 mb-6">
            {dashboardStats.totalReports}
          </div>
          
          <div className="grid grid-cols-4 gap-6 pt-6 border-t border-slate-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dashboardStats.completedToday}</div>
              <div className="text-sm text-slate-600 mt-1">Completed Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{dashboardStats.pendingReports}</div>
              <div className="text-sm text-slate-600 mt-1">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{dashboardStats.failedInspections}</div>
              <div className="text-sm text-slate-600 mt-1">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dashboardStats.averageRating}</div>
              <div className="text-sm text-slate-600 mt-1">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-3 text-red-600" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link 
              to="/reports"
              state={{ openAddForm: true }}
              className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 group border border-red-200 hover:border-red-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-red-600 rounded-lg text-white group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-slate-900">Create New Report</h3>
                  <p className="text-sm text-slate-600">Start a new vehicle inspection</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-red-600" />
              Recent Activity
            </h2>
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
              <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className={`w-3 h-3 rounded-full mt-2 ${activity.color}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {activity.text} - {activity.action}
                      </p>
                      <div className="flex items-center text-xs text-slate-500 mt-1 space-x-3">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {activity.inspector}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {activity.location}
                        </span>
                        {activity.rating && (
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                            {activity.rating}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Car Brands */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-red-600" />
              Top Car Brands
            </h2>
            <div className="space-y-4">
              {topBrands.length > 0 ? topBrands.map((brand, index) => (
                <div key={brand.brand} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold text-slate-500">#{index + 1}</div>
                    <span className="text-slate-700 font-medium">{brand.brand}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500" 
                        style={{
                          width: `${brand.percentage}%`,
                          backgroundColor: brand.color
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-slate-600 min-w-0 flex items-center">
                      <span className="font-semibold">{brand.count}</span>
                      <span className="text-slate-400 ml-1">({brand.percentage}%)</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>No brand data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Inspections Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-red-600" />
              Monthly Inspections Trend
            </h2>
            <div className="space-y-4">
              <div className="flex items-end space-x-6 h-64">
                {monthlyData.map((data, index) => (
                  <div key={data.month} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full transition-all duration-500 rounded-t-lg flex items-end justify-center pb-2 ${
                        data.isCurrentMonth 
                          ? 'bg-red-600 text-white' 
                          : 'bg-slate-300 hover:bg-slate-400 text-slate-700'
                      }`}
                      style={{
                        height: `${Math.max((data.value / maxValue) * 200, 20)}px`
                      }}
                    >
                      <span className="text-sm font-semibold">{data.value}</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-600">{data.month}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Total this month: <span className="font-semibold text-slate-900">{dashboardStats.thisMonthReports}</span>
                </div>
                <div className="text-sm text-slate-600">
                  Peak month: <span className="font-semibold text-slate-900">{Math.max(...monthlyData.map(d => d.value))}</span> inspections
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;