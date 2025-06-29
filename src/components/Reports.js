import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, Download, Edit3, Eye, Trash2, Plus, ArrowLeft, FileText, Car, Calendar, User, MapPin, Star } from 'lucide-react';
import AddReportForm from './AddReportForm';
import EditReportModal from './EditReportModal';
import logo from './logo.png'; // Import the logo

const Reports = () => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState('list');
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    make: ''
  });

  // Helper functions
  const hasActiveFilters = () => {
    return searchFilters.search || 
           searchFilters.status || 
           searchFilters.make || 
           searchFilters.dateFrom || 
           searchFilters.dateTo;
  };

  const getEmptyStateContent = () => {
    if (hasActiveFilters()) {
      return {
        title: "No reports found",
        message: "No reports match your current filters. Try adjusting your search criteria.",
        buttonText: "Clear Filters",
        buttonAction: () => setSearchFilters({ search: '', status: '', dateFrom: '', dateTo: '', make: '' })
      };
    } else {
      return {
        title: "No reports yet",
        message: "Get started by creating your first inspection report.",
        buttonText: "Add Report Now",
        buttonAction: () => setCurrentView('add')
      };
    }
  };

  // Check if we should open the add form (from Dashboard navigation)
  useEffect(() => {
    if (location.state?.openAddForm) {
      setCurrentView('add');
    }
  }, [location.state]);

  useEffect(() => {
    console.log('📊 Reports state updated:', reports);
  }, [reports]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchFilters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching reports from API...');
      
      // Get the token from localStorage
      const token = localStorage.getItem('carchain_auth_token');
      console.log('🔑 Auth token found:', token ? 'YES' : 'NO');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add auth header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports`, {

        headers: headers
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully fetched', data.length, 'reports');
        setReports(data);
      } else if (response.status === 401) {
        console.log('🔐 Authentication required - redirecting to login');
        // Redirect to login or show login modal
        alert('Please log in to access reports');
        // You might want to redirect to login page here
        setReports(getSampleReports()); // Fallback to sample data
      } else {
        console.log('⚠️ API call failed with status:', response.status);
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching reports:', error);
      console.log('📋 Falling back to sample data');
      setReports(getSampleReports());
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
      year: '2020',
      registrationNo: 'KT-5400',
      chassisNo: 'KUN25R-9605754',
      engineNo: '2KD-U486604',
      location: 'Karachi',
      inspectionDate: '2024-08-17',
      status: 'completed',
      inspector: 'Ahmed Ali',
      overallRating: 7.7,
      vehicleImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop',
      inspectionResults: {
        engine: { 'Engine Oil': 'Good', 'Engine Sound': 'Normal', 'Air Filter': 'Clean' },
        transmission: { 'Gear Shifting': 'Smooth', 'Clutch Operation': 'Good' },
        brakes: { 'Front Brake Pads': 'Good', 'Brake Fluid': 'Ok' },
        electrical: { 'Battery': 'Good', 'Lights - Headlights': 'Working' }
      },
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      customerName: 'Sarah Ahmed',
      make: 'Honda',
      model: 'Civic',
      variant: 'VTi',
      year: '2019',
      registrationNo: 'ABC-123',
      chassisNo: 'HONDA123456789',
      engineNo: 'H123456',
      location: 'Lahore',
      inspectionDate: '2024-08-15',
      status: 'pending',
      inspector: 'Ali Hassan',
      overallRating: 8.2,
      vehicleImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop',
      inspectionResults: {
        engine: { 'Engine Oil': 'Excellent', 'Engine Sound': 'Normal' },
        brakes: { 'Front Brake Pads': 'Good', 'Brake Fluid': 'Good' }
      },
      createdAt: new Date().toISOString()
    }
  ];

  const filterReports = () => {
    let filtered = [...reports];

    if (searchFilters.search) {
      const searchTerm = searchFilters.search.toLowerCase();
      filtered = filtered.filter(report => 
        report.customerName.toLowerCase().includes(searchTerm) ||
        report.registrationNo.toLowerCase().includes(searchTerm) ||
        report.chassisNo.toLowerCase().includes(searchTerm) ||
        report.engineNo.toLowerCase().includes(searchTerm) ||
        `${report.make} ${report.model}`.toLowerCase().includes(searchTerm)
      );
    }

    if (searchFilters.status) {
      filtered = filtered.filter(report => report.status === searchFilters.status);
    }

    if (searchFilters.make) {
      filtered = filtered.filter(report => report.make.toLowerCase() === searchFilters.make.toLowerCase());
    }

    if (searchFilters.dateFrom) {
      filtered = filtered.filter(report => new Date(report.inspectionDate) >= new Date(searchFilters.dateFrom));
    }
    if (searchFilters.dateTo) {
      filtered = filtered.filter(report => new Date(report.inspectionDate) <= new Date(searchFilters.dateTo));
    }

    setFilteredReports(filtered);
  };

  const handleShareableReport = async (report) => {
  try {
    console.log('🔗 Creating shareable report link for:', report._id);
    
    // First, save the report data to your backend with a shareable token
    const shareToken = generateShareToken();
    
    const shareData = {
      reportId: report._id,
      reportData: report,
      shareToken: shareToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };
    
    const token = localStorage.getItem('carchain_auth_token');
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(shareData),
    });
    
    if (response.ok) {
      const result = await response.json();
      const shareableUrl = `${window.location.origin}/public-report/${result.shareToken}`;
      
      // Copy to clipboard and show success message
      await navigator.clipboard.writeText(shareableUrl);
      
      // Show custom alert or modal with the link
      showShareModal(shareableUrl, report);
      
      console.log('✅ Shareable link created:', shareableUrl);
    } else {
      throw new Error('Failed to create shareable link');
    }
    
  } catch (error) {
    console.error('❌ Error creating shareable link:', error);
    alert('Error creating shareable link. Please try again.');
  }
};

// Generate a unique share token
const generateShareToken = () => {
  return 'share_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
};

// Show modal with shareable link
const showShareModal = (shareableUrl, report) => {
  // You can replace this with a proper modal component
  const message = `
Shareable Report Link Created!

Vehicle: ${report.year} ${report.make} ${report.model}
Registration: ${report.registrationNo}

Link: ${shareableUrl}

The link has been copied to your clipboard and is valid for 30 days.
Anyone with this link can view the inspection report.
  `;
  
  alert(message);
  
  // Optional: Open the link in a new tab to test
  // window.open(shareableUrl, '_blank');
};


  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setCurrentView('view');
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setCurrentView('edit');
  };

  const handleDeleteReport = async (reportId) => {
    try {
      console.log('🗑️ Deleting report:', reportId);
      
      // Check if this is a sample report (sample reports have string IDs like '1', '2')
      if (reportId === '1' || reportId === '2' || typeof reportId === 'string' && reportId.length < 10) {
        // Handle sample data deletion locally
        setReports(prev => prev.filter(report => report._id !== reportId));
        alert('Report deleted successfully');
        return;
      }
      
      const token = localStorage.getItem('carchain_auth_token');
      
const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        console.log('✅ Report deleted successfully');
        await fetchReports();
        alert('Report deleted successfully');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Error deleting report. Please try again.');
    }
  };

// Replace your current handleDownloadReport function with this:
const handleDownloadReport = (report) => {
  // Create a direct URL to the public report page
  const publicUrl = `${window.location.origin}/public-report/${report._id}`;
  window.open(publicUrl, '_blank');
  console.log('📄 Opened public report:', publicUrl);
};

  const generatePDFReport = (report) => {
    // Calculate category ratings based on inspection results
    const calculateCategoryRating = (categoryItems) => {
      if (!categoryItems || Object.keys(categoryItems).length === 0) return 0;
      
      const values = Object.values(categoryItems);
      const scores = values.map(value => {
        const lowerValue = value.toLowerCase();
        if (['excellent', 'good', 'working', 'clean', 'normal', 'smooth'].includes(lowerValue)) return 10;
        if (['ok', 'fair', 'worn', 'low', 'weak', 'minor'].includes(lowerValue)) return 6;
        return 3; // Poor, Bad, etc.
      });
      
      return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 10) / 10;
    };

    // Calculate ratings for each category
    const categoryRatings = {};
    if (report.inspectionResults) {
      Object.keys(report.inspectionResults).forEach(category => {
        categoryRatings[category] = calculateCategoryRating(report.inspectionResults[category]);
      });
    }

    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Car Inspection Report - ${report.registrationNo}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; line-height: 1.6; color: #1a202c; background: #f7fafc; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 30px; margin-bottom: 40px; }
          .logo-container { display: flex; justify-content: center; align-items: center; margin-bottom: 15px; }
          .logo { max-height: 60px; max-width: 200px; width: auto; height: auto; }
          .tagline { color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .title { font-size: 24px; font-weight: 600; margin-top: 20px; color: #1a202c; }
          .vehicle-header { display: flex; align-items: center; margin: 40px 0; padding: 30px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; }
          .vehicle-image { width: 200px; height: 130px; border-radius: 8px; margin-right: 40px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .vehicle-image img { width: 100%; height: 100%; object-fit: cover; }
          .rating-section { flex: 1; text-align: center; }
          .vehicle-title { font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #1a202c; }
          .rating-circle { width: 120px; height: 120px; border: 6px solid #dc2626; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; background: white; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); }
          .rating-text { font-size: 28px; font-weight: bold; color: #dc2626; }
          .rating-label { font-weight: 600; margin-top: 15px; color: #475569; }
          .details-section { margin: 40px 0; }
          .section-title { font-size: 20px; font-weight: 700; margin-bottom: 20px; color: #1a202c; padding-bottom: 10px; border-bottom: 2px solid #dc2626; }
          .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
          .detail-card { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; }
          .detail-label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
          .detail-value { font-size: 16px; font-weight: 500; color: #1a202c; }
          
          /* Rating Bars Section */
          .ratings-section { margin: 40px 0; }
          .ratings-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .ratings-header { background: #1e293b; color: white; padding: 20px 24px; }
          .ratings-title { font-size: 18px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }
          .ratings-grid { padding: 24px; display: grid; grid-template-columns: 1fr; gap: 20px; }
          .rating-row { display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
          .rating-row:last-child { border-bottom: none; }
          .rating-label { min-width: 120px; font-size: 16px; font-weight: 600; color: #374151; text-transform: capitalize; }
          .rating-bar-wrapper { flex: 1; margin: 0 20px; position: relative; }
          .rating-bar-bg { width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
          .rating-bar-fill { height: 100%; border-radius: 4px; position: relative; transition: width 0.5s ease; }
          .rating-bar-fill.excellent { background: linear-gradient(90deg, #059669, #10b981); }
          .rating-bar-fill.good { background: linear-gradient(90deg, #d97706, #f59e0b); }
          .rating-bar-fill.poor { background: linear-gradient(90deg, #dc2626, #ef4444); }
          .rating-score { min-width: 60px; text-align: right; font-size: 16px; font-weight: 700; }
          .rating-score.excellent { color: #059669; }
          .rating-score.good { color: #d97706; }
          .rating-score.poor { color: #dc2626; }
          
          .inspection-section { margin: 40px 0; }
          .category-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
          .category-header { background: #1e293b; color: white; padding: 16px 24px; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .inspection-items { padding: 0; }
          .inspection-item { display: flex; justify-content: between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #f1f5f9; }
          .inspection-item:last-child { border-bottom: none; }
          .item-name { flex: 1; font-weight: 500; color: #374151; }
          .item-status { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
          .status-good { background: #dcfce7; color: #166534; }
          .status-fair { background: #fef3c7; color: #92400e; }
          .status-poor { background: #fee2e2; color: #991b1b; }
          .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0; color: #64748b; }
          .footer-date { font-weight: 600; margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="${logo}" alt="Car2Chain Logo" class="logo" />
            </div>
            <div class="tagline">Deals in New and Used Cars</div>
            <div class="title">Vehicle Inspection Report</div>
          </div>

          <div class="vehicle-header">
            <div class="vehicle-image">
              ${report.vehicleImage 
                ? `<img src="${report.vehicleImage}" alt="Vehicle" />` 
                : `<div style="background: #e2e8f0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8;"><svg width="60" height="40" viewBox="0 0 60 40" fill="currentColor"><path d="M10 25h5l3-10h24l3 10h5c2.5 0 5 2.5 5 5v5c0 1.5-1 2.5-2.5 2.5h-2.5v2.5c0 2.5-2.5 5-5 5s-5-2.5-5-5v-2.5h-20v2.5c0 2.5-2.5 5-5 5s-5-2.5-5-5v-2.5h-2.5c-1.5 0-2.5-1-2.5-2.5v-5c0-2.5 2.5-5 5-5z"/></svg></div>`
              }
            </div>
            <div class="rating-section">
              <div class="vehicle-title">${report.year} ${report.make} ${report.model}</div>
              <div class="rating-circle">
                <div class="rating-text">${report.overallRating}/10</div>
              </div>
              <div class="rating-label">Overall Rating</div>
            </div>
          </div>

          <div class="details-section">
            <div class="section-title">Vehicle Details</div>
            <div class="details-grid">
              <div class="detail-card">
                <div class="detail-label">Customer/Dealer Name</div>
                <div class="detail-value">${report.customerName}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Registration Number</div>
                <div class="detail-value">${report.registrationNo}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Chassis Number</div>
                <div class="detail-value">${report.chassisNo}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Engine Number</div>
                <div class="detail-value">${report.engineNo}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Location</div>
                <div class="detail-value">${report.location}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Inspection Date</div>
                <div class="detail-value">${new Date(report.inspectionDate).toLocaleDateString()}</div>
              </div>
              <div class="detail-card">
                <div class="detail-label">Inspector</div>
                <div class="detail-value">${report.inspector}</div>
              </div>
            </div>
          </div>

          ${Object.keys(categoryRatings).length > 0 ? `
          <div class="ratings-section">
            <div class="section-title">Category Ratings</div>
            <div class="ratings-container">
              <div class="ratings-header">
                <h3 class="ratings-title">Performance by Category</h3>
              </div>
              <div class="ratings-grid">
                ${Object.entries(categoryRatings).map(([category, rating]) => {
                  const percentage = (rating / 10) * 100;
                  const ratingClass = rating >= 8 ? 'excellent' : rating >= 6 ? 'good' : 'poor';
                  
                  return `
                    <div class="rating-row">
                      <div class="rating-label">${category}</div>
                      <div class="rating-bar-wrapper">
                        <div class="rating-bar-bg">
                          <div class="rating-bar-fill ${ratingClass}" style="width: ${percentage}%;"></div>
                        </div>
                      </div>
                      <div class="rating-score ${ratingClass}">${rating}/10</div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
          ` : ''}

          <div class="inspection-section">
            <div class="section-title">Inspection Results</div>
            ${Object.keys(report.inspectionResults || {}).map(category => `
              <div class="category-card">
                <div class="category-header">${category}</div>
                <div class="inspection-items">
                  ${Object.entries(report.inspectionResults[category] || {}).map(([item, value]) => {
                    const statusClass = ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth'].includes(value) 
                      ? 'status-good' 
                      : ['Fair', 'Worn', 'Low', 'Weak', 'Minor'].includes(value) 
                      ? 'status-fair' 
                      : 'status-poor';
                    
                    return `
                      <div class="inspection-item">
                        <div class="item-name">${item}</div>
                        <div class="item-status ${statusClass}">${value}</div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <div class="footer-date">Generated on ${new Date().toLocaleDateString()}</div>
            <div>Car2Chain Inspection Portal • Inspector: ${report.inspector}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    newWindow.document.write(reportContent);
    newWindow.document.close();
  };


  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed', dot: 'bg-emerald-500' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending', dot: 'bg-amber-500' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress', dot: 'bg-blue-500' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed', dot: 'bg-red-500' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></div>
        {config.label}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-emerald-600';
    if (rating >= 6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getRatingBg = (rating) => {
    if (rating >= 8) return 'bg-emerald-50 border-emerald-200';
    if (rating >= 6) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const handleReportFormSuccess = () => {
    console.log('✅ Report created successfully');
    setCurrentView('list'); // This should take you back to the reports list
    fetchReports(); // Refresh the reports list
    alert('Report created successfully!');
  };

  const renderReportsList = () => (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Inspection Reports</h1>
              <p className="text-slate-600 mt-2">Manage and track all vehicle inspection reports</p>
            </div>
            <button
              onClick={() => setCurrentView('add')}
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Report
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Search and Filter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Filter className="w-5 h-5 text-slate-500 mr-3" />
              <h3 className="text-lg font-semibold text-slate-900">Search & Filter Reports</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchFilters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white"
                />
              </div>
              
              <select 
                value={searchFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              
              <select 
                value={searchFilters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white"
              >
                <option value="">All Makes</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Hyundai">Hyundai</option>
              </select>
              
              <input
                type="date"
                value={searchFilters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white"
              />
              
              <input
                type="date"
                value={searchFilters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white"
              />
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-slate-600 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                {reports.length === 0 
                  ? "No reports available" 
                  : `Showing ${filteredReports.length} of ${reports.length} reports`
                }
              </div>
              {hasActiveFilters() && (
                <button
                  onClick={() => setSearchFilters({ search: '', status: '', dateFrom: '', dateTo: '', make: '' })}
                  className="text-red-600 hover:text-red-800 font-medium text-sm hover:bg-red-50 px-3 py-1 rounded-md transition-all duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-white rounded-xl p-8 text-center max-w-md border border-slate-200 shadow-sm">
              <div className="mb-6">
                <svg 
                  className="w-16 h-16 mx-auto text-slate-400 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {getEmptyStateContent().title}
              </h3>
              
              <p className="text-slate-600 mb-6">
                {getEmptyStateContent().message}
              </p>
              
              <button
                onClick={getEmptyStateContent().buttonAction}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold"
              >
                {getEmptyStateContent().buttonText}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div key={report._id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Vehicle Image */}
                <div className="relative h-48 bg-slate-100">
                  {report.vehicleImage ? (
                    <img 
                      src={report.vehicleImage} 
                      alt="Vehicle" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Car className="w-16 h-16" />
                    </div>
                  )}
                  
                  {/* Rating Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full border-2 ${getRatingBg(report.overallRating)} backdrop-blur-sm`}>
                    <div className="flex items-center">
                      <Star className={`w-4 h-4 mr-1 ${getRatingColor(report.overallRating)}`} fill="currentColor" />
                      <span className={`font-bold text-sm ${getRatingColor(report.overallRating)}`}>
                        {report.overallRating}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Vehicle Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {report.year} {report.make} {report.model}
                    </h3>
                    <p className="text-slate-600 text-sm font-medium">{report.registrationNo}</p>
                  </div>

                  {/* Customer & Location */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <User className="w-4 h-4 mr-2 text-slate-400" />
                      {report.customerName}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {report.location}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                      {new Date(report.inspectionDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center mb-4">
                    {getStatusBadge(report.status)}
                    <span className="text-xs text-slate-500">by {report.inspector}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewReport(report)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                   <button
  onClick={() => handleShareableReport(report)}
  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-all duration-200 text-sm font-medium"
>
  <Download className="w-4 h-4 mr-1" />
  Share PDF
</button>
                    <button
                      onClick={() => handleEditReport(report)}
                      className="inline-flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 text-sm font-medium"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      className="inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderViewReport = () => (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {selectedReport?.year} {selectedReport?.make} {selectedReport?.model}
              </h1>
              <p className="text-slate-600 mt-2">Registration: {selectedReport?.registrationNo}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleDownloadReport(selectedReport)}
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => handleEditReport(selectedReport)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                Edit Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('list')}
          className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Reports
        </button>

        {/* Vehicle Hero Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Vehicle Image */}
            <div className="relative h-80 lg:h-96">
              {selectedReport?.vehicleImage ? (
                <img 
                  src={selectedReport.vehicleImage} 
                  alt="Vehicle" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <Car className="w-24 h-24 text-slate-400" />
                </div>
              )}
            </div>
            
            {/* Rating & Status */}
            <div className="p-8 flex flex-col justify-center">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 mb-6 ${getRatingBg(selectedReport?.overallRating)} ${getRatingColor(selectedReport?.overallRating)} border-current`}>
                  <div>
                    <div className="text-3xl font-bold">{selectedReport?.overallRating}</div>
                    <div className="text-sm font-medium">/10</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Overall Rating</h3>
                <div className="mb-4">{getStatusBadge(selectedReport?.status)}</div>
                <p className="text-slate-600">Inspected by <span className="font-semibold">{selectedReport?.inspector}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Car className="w-6 h-6 mr-3 text-red-600" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Customer</label>
                <p className="text-lg font-semibold text-slate-900">{selectedReport?.customerName}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Make/Model</label>
                <p className="text-lg font-semibold text-slate-900">{selectedReport?.make} {selectedReport?.model}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Year</label>
                <p className="text-lg font-semibold text-slate-900">{selectedReport?.year}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Chassis Number</label>
                <p className="text-lg font-semibold text-slate-900">{selectedReport?.chassisNo}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Engine Number</label>
                <p className="text-lg font-semibold text-slate-900">{selectedReport?.engineNo}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">Location</label>
                <p className="text-lg font-semibold text-slate-900">{selectedReport?.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-red-600" />
              Inspection Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <Calendar className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide block mb-2">Inspection Date</label>
                <p className="text-lg font-semibold text-slate-900">{new Date(selectedReport?.inspectionDate).toLocaleDateString()}</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <User className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide block mb-2">Inspector</label>
                <p className="text-lg font-semibold text-slate-900">{selectedReport?.inspector}</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <FileText className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide block mb-2">Status</label>
                <div className="flex justify-center">{getStatusBadge(selectedReport?.status)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection Results */}
        {selectedReport?.inspectionResults && Object.keys(selectedReport.inspectionResults).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-red-600" />
                Inspection Results
              </h3>
              <div className="space-y-6">
                {Object.entries(selectedReport.inspectionResults).map(([category, items]) => (
                  <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-900 text-white px-6 py-4">
                      <h4 className="font-bold text-lg uppercase tracking-wide">{category}</h4>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {Object.entries(items).map(([item, value]) => (
                        <div key={item} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors duration-200">
                          <span className="font-medium text-slate-900">{item}</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth'].includes(value) 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : ['Fair', 'Worn', 'Low', 'Weak', 'Minor'].includes(value) 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        {selectedReport?.comments && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mt-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Additional Comments</h3>
              <div className="bg-slate-50 p-6 rounded-lg">
                <p className="text-slate-700 leading-relaxed">{selectedReport.comments}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'add':
        return (
          <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200 shadow-sm">
              <div className="px-8 py-6">
                <button
                  onClick={() => setCurrentView('list')}
                  className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 mb-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Reports
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Add New Report</h1>
                <p className="text-slate-600 mt-2">Create a new vehicle inspection report</p>
              </div>
            </div>
            <div className="px-8 py-6">
              <AddReportForm onSuccess={handleReportFormSuccess} />
            </div>
          </div>
        );
      case 'view':
        return (
          <div>
            {renderViewReport()}
          </div>
        );
      case 'edit':
        return (
          <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200 shadow-sm">
              <div className="px-8 py-6">
                <button
                  onClick={() => setCurrentView('list')}
                  className="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200 mb-4"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Reports
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Edit Report</h1>
                <p className="text-slate-600 mt-2">Modify the inspection report details</p>
              </div>
            </div>
            <div className="px-8 py-6">
              {selectedReport && (
                <EditReportModal 
                  report={selectedReport} 
                  onSuccess={handleReportFormSuccess}
                />
              )}
            </div>
          </div>
        );
      default:
        return renderReportsList();
    }
  };

  return renderContent();
};

export default Reports;