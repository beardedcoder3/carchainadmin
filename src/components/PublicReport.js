// Professional PublicReport.js with logo and better design
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Car, Calendar, User, MapPin, Star, Shield, FileText, Phone, Mail } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-slate-200">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-600 mx-auto mb-8"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-t-4 border-red-200 mx-auto animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Loading Inspection Report</h2>
          <p className="text-slate-600 text-lg mb-2">Retrieving vehicle inspection data...</p>
          <p className="text-slate-400 text-sm font-mono bg-slate-50 px-4 py-2 rounded-lg inline-block">
            Report ID: {reportId}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-2xl shadow-2xl border border-slate-200 max-w-2xl">
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Report Not Found</h1>
          <p className="text-xl text-slate-600 mb-6">{error}</p>
          <div className="bg-slate-50 p-6 rounded-xl mb-8">
            <p className="text-sm text-slate-500 mb-2">The inspection report you're looking for may have been:</p>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Removed or archived</li>
              <li>• Accessed with an invalid link</li>
              <li>• Temporarily unavailable</li>
            </ul>
          </div>
          <div className="bg-slate-100 p-4 rounded-lg">
            <p className="text-xs text-slate-400 font-mono">Report ID: {reportId}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">Need assistance? Contact Car2Chain support</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <>
      {/* Enhanced Print Styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; color: #000 !important; }
          .print-container { box-shadow: none !important; margin: 0 !important; }
          .bg-gradient-to-r { background: #dc2626 !important; }
          .bg-gradient-to-br { background: #f8fafc !important; }
          .shadow-2xl, .shadow-xl, .shadow-lg { box-shadow: none !important; }
        }
        
        @page {
          margin: 0.75in;
          size: A4;
        }

        .gradient-border {
          background: linear-gradient(135deg, #dc2626, #ef4444, #f87171);
          padding: 3px;
          border-radius: 16px;
        }
        
        .gradient-border-inner {
          background: white;
          border-radius: 13px;
          height: 100%;
        }
      `}</style>

      {/* Professional Layout */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        
        {/* Floating Action Buttons */}
        <div className="no-print fixed top-8 right-8 z-50 space-y-4">
          <button
            onClick={handlePrint}
            className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center space-x-3 text-lg border-2 border-red-700"
          >
            <Download className="w-6 h-6 group-hover:animate-pulse" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Main Report Container */}
        <div className="print-container max-w-6xl mx-auto py-8 px-4">
          
          {/* Professional Header */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative z-10 p-12 text-center">
                {/* Logo Section */}
                <div className="mb-8">
                  <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <img 
                      src={logo} 
                      alt="Car2Chain Logo" 
                      className="h-20 w-auto mx-auto filter brightness-0 invert"
                    />
                  </div>
                </div>
                
                {/* Report Title */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 inline-block border border-white/20">
                  <h1 className="text-4xl font-bold mb-2">Vehicle Inspection Report</h1>
                </div>
              </div>
            </div>

            {/* Vehicle Summary Section */}
            <div className="p-12 bg-gradient-to-br from-slate-50 to-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Vehicle Image */}
                <div className="lg:col-span-4">
                  <div className="gradient-border">
                    <div className="gradient-border-inner p-4">
                      <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                        {report.vehicleImage ? (
                          <img 
                            src={report.vehicleImage} 
                            alt="Vehicle" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100">
                            <div className="text-center">
                              <Car className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                              <p className="text-lg font-medium text-slate-400">Vehicle Image</p>
                              <p className="text-sm text-slate-300">Not Available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="lg:col-span-5">
                  <div className="mb-8">
                    <h2 className="text-5xl font-bold text-slate-900 mb-3 leading-tight">
                      {report.year} {report.make}
                    </h2>
                    <h3 className="text-3xl font-semibold text-slate-700 mb-6">
                      {report.model} {report.variant && `• ${report.variant}`}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                        <Car className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Registration</p>
                        <p className="text-xl font-bold text-slate-900 font-mono">{report.registrationNo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Customer</p>
                        <p className="text-xl font-bold text-slate-900">{report.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Location</p>
                        <p className="text-xl font-bold text-slate-900">{report.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Inspection Date</p>
                        <p className="text-xl font-bold text-slate-900">{new Date(report.inspectionDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="lg:col-span-3 text-center">
                  <div className="relative">
                    {/* Animated Rating Circle */}
                    <div className="relative inline-block">
                      <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
                        {/* Background Circle */}
                        <circle
                          cx="100"
                          cy="100"
                          r="85"
                          stroke="#f1f5f9"
                          strokeWidth="12"
                          fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                          cx="100"
                          cy="100"
                          r="85"
                          stroke="#dc2626"
                          strokeWidth="12"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(report.overallRating / 10) * 534.07} 534.07`}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      
                      {/* Rating Content */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-black text-red-600 mb-2">{report.overallRating}</div>
                          <div className="text-xl font-bold text-slate-400">/10</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rating Label */}
                    <div className="mt-6">
                      <div className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-full shadow-lg">
                        <Star className="w-5 h-5 mr-2 fill-current" />
                        <span className="font-bold text-lg">Overall Rating</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-3">
                        Inspected by <span className="font-semibold text-slate-700">{report.inspector}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-8">
            <div className="bg-slate-900 text-white p-8">
              <h3 className="text-3xl font-bold flex items-center">
                <FileText className="w-8 h-8 mr-4 text-red-400" />
                Vehicle Specifications
              </h3>
            </div>
            
            <div className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { label: 'Chassis Number', value: report.chassisNo, icon: '🔧' },
                  { label: 'Engine Number', value: report.engineNo, icon: '⚙️' },
                  { label: 'Variant', value: report.variant || 'Standard', icon: '🚗' },
                  { label: 'Engine Capacity', value: report.engineCapacity || 'N/A', icon: '🔋' },
                  { label: 'Mileage', value: report.mileage ? `${report.mileage} km` : 'N/A', icon: '📊' },
                  { label: 'Fuel Type', value: report.fuelType || 'N/A', icon: '⛽' },
                ].map((spec, index) => (
                  <div key={index} className="group">
                    <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border-2 border-slate-100 hover:border-red-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">{spec.icon}</span>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{spec.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Inspection Results */}
          {report.inspectionResults && Object.keys(report.inspectionResults).length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-8">
              <div className="bg-slate-900 text-white p-8">
                <h3 className="text-3xl font-bold flex items-center">
                  <Shield className="w-8 h-8 mr-4 text-red-400" />
                  Detailed Inspection Results
                </h3>
              </div>
              
              <div className="p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {Object.entries(report.inspectionResults).map(([category, items]) => (
                    <div key={category} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="bg-slate-800 text-white px-8 py-6">
                        <h4 className="font-bold text-xl uppercase tracking-wide capitalize">{category}</h4>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {Object.entries(items).map(([item, value]) => (
                          <div key={item} className="px-8 py-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <span className="font-semibold text-lg text-slate-800">{item}</span>
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${
                              ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth'].includes(value) 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : ['Fair', 'Worn', 'Low', 'Weak', 'Minor'].includes(value) 
                                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                : 'bg-red-50 text-red-800 border-red-200'
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

          {/* Comments Section */}
          {report.comments && (
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden mb-8">
              <div className="bg-slate-900 text-white p-8">
                <h3 className="text-3xl font-bold flex items-center">
                  <FileText className="w-8 h-8 mr-4 text-red-400" />
                  Additional Comments
                </h3>
              </div>
              <div className="p-12">
                <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border-2 border-slate-100">
                  <p className="text-lg text-slate-700 leading-relaxed">{report.comments}</p>
                </div>
              </div>
            </div>
          )}

          {/* Professional Footer */}
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
            <div className="p-12 text-center text-white">
              <div className="mb-8">
                <img 
                  src={logo} 
                  alt="Car2Chain Logo" 
                  className="h-16 w-auto mx-auto mb-6 filter brightness-0 invert"
                />
                <h4 className="text-3xl font-bold mb-4">Car2Chain Inspection Services</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-red-400" />
                  <p className="text-lg font-semibold">Report Generated</p>
                  <p className="text-slate-300">{new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div className="text-center">
                  <User className="w-8 h-8 mx-auto mb-3 text-red-400" />
                  <p className="text-lg font-semibold">Certified Inspector</p>
                  <p className="text-slate-300">{report.inspector}</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 mx-auto mb-3 text-red-400" />
                  <p className="text-lg font-semibold">Report ID</p>
                  <p className="text-slate-300 font-mono text-sm">{report._id}</p>
                </div>
              </div>
              
              <div className="border-t border-slate-700 pt-8">
                <p className="text-slate-400 text-sm leading-relaxed">
                  This is an official vehicle inspection report. 
                  For verification or inquiries, please contact our support team with the report ID mentioned above.
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