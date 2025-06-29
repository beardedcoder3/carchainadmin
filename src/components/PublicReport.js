// Professional PublicReport.js with enhanced design and corporate aesthetics
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Car, Calendar, User, MapPin, Star, Shield, FileText, Phone, Mail, CheckCircle } from 'lucide-react';
import logo from '../logo.png'; // Import the logo

const PublicReport = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicReport();
  }, [reportId]);

  const fetchPublicReport = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching public report with ID:', reportId);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports/public/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully fetched public report');
        setReport(data);
      } else if (response.status === 404) {
        throw new Error('Report not found');
      } else {
        console.error('❌ Response status:', response.status);
        throw new Error(`Error ${response.status}: Unable to load report`);
      }
    } catch (error) {
      console.error('❌ Error fetching public report:', error);
      setError(error.message || 'Report not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Report</h2>
            <p className="text-gray-600 text-center">Please wait while we retrieve your inspection report</p>
            <div className="mt-4 text-sm text-gray-400 font-mono">ID: {reportId}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 font-mono">Report ID: {reportId}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const getStatusColor = (value) => {
    const goodValues = ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth', 'Pass'];
    const fairValues = ['Fair', 'Worn', 'Low', 'Weak', 'Minor', 'Average'];
    
    if (goodValues.some(v => value?.toLowerCase().includes(v.toLowerCase()))) {
      return 'bg-green-50 text-green-800 border-green-200';
    } else if (fairValues.some(v => value?.toLowerCase().includes(v.toLowerCase()))) {
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    } else {
      return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .print-break { page-break-before: always; }
        }
        
        @page {
          margin: 0.5in;
          size: A4;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Print Button */}
        <div className="no-print fixed top-6 right-6 z-50">
          <button
            onClick={handlePrint}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Main Container */}
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
          
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Top Bar */}
            <div className="bg-red-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={logo} alt="Car2Chain" className="h-10 w-auto filter brightness-0 invert" />
                  <div>
                    <h1 className="text-2xl font-bold text-white">Vehicle Inspection Report</h1>
                    <p className="text-red-100 text-sm">Professional Assessment & Certification</p>
                  </div>
                </div>
                <div className="text-right text-white">
                  <p className="text-sm text-red-100">Report ID</p>
                  <p className="font-mono text-sm">{report._id}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Summary */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Vehicle Image */}
                <div className="lg:col-span-1">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    {report.vehicleImage ? (
                      <img 
                        src={report.vehicleImage} 
                        alt="Vehicle" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Car className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-sm">No Image Available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="lg:col-span-1">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-1">
                        {report.year} {report.make}
                      </h2>
                      <h3 className="text-xl text-gray-700 mb-4">
                        {report.model} {report.variant && `• ${report.variant}`}
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Car className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Registration Number</p>
                          <p className="font-semibold text-gray-900">{report.registrationNo}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Customer Name</p>
                          <p className="font-semibold text-gray-900">{report.customerName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Inspection Location</p>
                          <p className="font-semibold text-gray-900">{report.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Inspection Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(report.inspectionDate).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="lg:col-span-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#f3f4f6"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="60"
                          cy="60"
                          r="50"
                          stroke="#dc2626"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(report.overallRating / 10) * 314.16} 314.16`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-600">{report.overallRating}</div>
                          <div className="text-sm text-gray-500">/10</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-lg font-semibold text-gray-900">Overall Rating</p>
                      <p className="text-sm text-gray-600">Inspector: {report.inspector}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-8 py-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-red-600" />
                Technical Specifications
              </h3>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Chassis Number', value: report.chassisNo },
                  { label: 'Engine Number', value: report.engineNo },
                  { label: 'Variant', value: report.variant || 'Standard' },
                  { label: 'Engine Capacity', value: report.engineCapacity || 'N/A' },
                  { label: 'Mileage', value: report.mileage ? `${report.mileage} km` : 'N/A' },
                  { label: 'Fuel Type', value: report.fuelType || 'N/A' },
                ].map((spec, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">{spec.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Ratings */}
          {report.inspectionResults && Object.keys(report.inspectionResults).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-8 py-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-red-600" />
                  Category Performance Ratings
                </h3>
                <p className="text-sm text-gray-600 mt-1">Individual component assessment scores</p>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Object.entries(report.inspectionResults).map(([category, items]) => {
                    // Calculate category rating based on items
                    const itemValues = Object.values(items);
                    const goodCount = itemValues.filter(value => 
                      ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth', 'Pass'].some(v => 
                        value?.toLowerCase().includes(v.toLowerCase())
                      )
                    ).length;
                    const fairCount = itemValues.filter(value => 
                      ['Fair', 'Worn', 'Low', 'Weak', 'Minor', 'Average'].some(v => 
                        value?.toLowerCase().includes(v.toLowerCase())
                      )
                    ).length;
                    const poorCount = itemValues.length - goodCount - fairCount;
                    
                    // Calculate rating (1-10 scale)
                    const rating = Math.round(
                      ((goodCount * 10) + (fairCount * 6) + (poorCount * 3)) / itemValues.length
                    );
                    
                    const ratingColor = rating >= 8 ? 'bg-green-500' : rating >= 6 ? 'bg-yellow-500' : 'bg-red-500';
                    const ratingBgColor = rating >= 8 ? 'bg-green-50' : rating >= 6 ? 'bg-yellow-50' : 'bg-red-50';
                    const ratingTextColor = rating >= 8 ? 'text-green-800' : rating >= 6 ? 'text-yellow-800' : 'text-red-800';
                    
                    return (
                      <div key={category} className={`p-6 rounded-lg border-2 ${rating >= 8 ? 'border-green-200' : rating >= 6 ? 'border-yellow-200' : 'border-red-200'} ${ratingBgColor}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${ratingTextColor}`}>
                            {rating}/10
                          </span>
                        </div>
                        
                        {/* Rating Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Performance Score</span>
                            <span className="font-medium">{rating * 10}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className={`h-full ${ratingColor} transition-all duration-1000 ease-out rounded-full`}
                              style={{ width: `${rating * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {/* Rating Summary */}
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="text-center">
                            <div className="w-full bg-green-200 rounded h-2 mb-1">
                              <div 
                                className="bg-green-500 h-full rounded" 
                                style={{ width: `${(goodCount / itemValues.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-green-700 font-medium">{goodCount} Good</span>
                          </div>
                          <div className="text-center">
                            <div className="w-full bg-yellow-200 rounded h-2 mb-1">
                              <div 
                                className="bg-yellow-500 h-full rounded" 
                                style={{ width: `${(fairCount / itemValues.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-yellow-700 font-medium">{fairCount} Fair</span>
                          </div>
                          <div className="text-center">
                            <div className="w-full bg-red-200 rounded h-2 mb-1">
                              <div 
                                className="bg-red-500 h-full rounded" 
                                style={{ width: `${(poorCount / itemValues.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-red-700 font-medium">{poorCount} Poor</span>
                          </div>
                        </div>
                        
                        {/* Items Count */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">{itemValues.length}</span> components inspected
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Overall Performance Summary */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-red-600" />
                    Performance Summary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(() => {
                      const allItems = Object.values(report.inspectionResults).flatMap(items => Object.values(items));
                      const totalGood = allItems.filter(value => 
                        ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth', 'Pass'].some(v => 
                          value?.toLowerCase().includes(v.toLowerCase())
                        )
                      ).length;
                      const totalFair = allItems.filter(value => 
                        ['Fair', 'Worn', 'Low', 'Weak', 'Minor', 'Average'].some(v => 
                          value?.toLowerCase().includes(v.toLowerCase())
                        )
                      ).length;
                      const totalPoor = allItems.length - totalGood - totalFair;
                      
                      return [
                        { label: 'Good Condition', count: totalGood, color: 'text-green-600', bg: 'bg-green-100' },
                        { label: 'Fair Condition', count: totalFair, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                        { label: 'Needs Attention', count: totalPoor, color: 'text-red-600', bg: 'bg-red-100' }
                      ].map((stat, index) => (
                        <div key={index} className={`${stat.bg} p-4 rounded-lg text-center`}>
                          <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.count}</div>
                          <div className="text-sm font-medium text-gray-700">{stat.label}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {Math.round((stat.count / allItems.length) * 100)}% of total
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inspection Results */}
          {report.inspectionResults && Object.keys(report.inspectionResults).length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-8 py-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-red-600" />
                  Inspection Results
                </h3>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Object.entries(report.inspectionResults).map(([category, items]) => (
                    <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h4 className="font-semibold text-gray-900 uppercase text-sm tracking-wide">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {Object.entries(items).map(([item, value]) => (
                          <div key={item} className="px-6 py-4 flex justify-between items-center">
                            <span className="text-gray-700 font-medium">{item}</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(value)}`}>
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

          {/* Comments Section */}
          {report.comments && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-8 py-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-red-600" />
                  Inspector Comments
                </h3>
              </div>
              <div className="p-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{report.comments}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden">
            <div className="p-8 text-center text-white">
              <div className="flex items-center justify-center mb-6">
                <img src={logo} alt="Car2Chain" className="h-8 w-auto filter brightness-0 invert mr-3" />
                <h4 className="text-xl font-semibold">Car2Chain Inspection Services</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                  <p className="font-medium text-gray-300 mb-1">Report Generated</p>
                  <p className="text-white">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-300 mb-1">Certified Inspector</p>
                  <p className="text-white">{report.inspector}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-300 mb-1">Verification</p>
                  <p className="text-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                    Verified Report
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-xs">
                  This report is generated by certified professionals and contains confidential information.
                  For inquiries, please contact support with the report ID above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicReport;