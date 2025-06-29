// 1. UPDATED PublicReport.js - Completely standalone, no admin layout
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Car, Calendar, User, MapPin, Star } from 'lucide-react';

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
      
      // Fetch from the public endpoint - NO authentication needed
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports/public/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Explicitly NO Authorization header
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading inspection report...</p>
          <p className="text-gray-400 text-sm mt-2">Report ID: {reportId}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-gray-200 max-w-lg mx-4">
          <div className="text-red-500 text-8xl mb-6">🚗</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <p className="text-gray-600 mb-6 text-lg">{error}</p>
          <p className="text-sm text-gray-500 mb-8">The report may have been removed or the link is invalid.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-400">Report ID: {reportId}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <>
      {/* Print Styles - Hide print button when printing */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .print-container { box-shadow: none !important; margin: 0 !important; }
        }
        
        @page {
          margin: 1in;
          size: A4;
        }
      `}</style>

      {/* Full screen standalone layout - NO admin sidebar */}
      <div className="min-h-screen bg-gray-50">
        
        {/* Floating Print Button - Hidden when printing */}
        <div className="no-print fixed top-8 right-8 z-50">
          <button
            onClick={handlePrint}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl shadow-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 text-lg"
          >
            <Download className="w-6 h-6" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Report Content */}
        <div className="print-container max-w-5xl mx-auto py-12 px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            
            {/* Header Section */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-12 text-center">
              <div className="mb-6">
                <h1 className="text-5xl font-bold tracking-wider mb-4">CAR2CHAIN</h1>
                <p className="text-red-100 text-lg uppercase tracking-widest">Professional Vehicle Inspection Services</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 inline-block">
                <h2 className="text-3xl font-bold">Official Inspection Report</h2>
              </div>
            </div>

            {/* Vehicle Summary Section */}
            <div className="p-12 bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                
                {/* Vehicle Image */}
                <div className="lg:col-span-1">
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg border-4 border-white">
                    {report.vehicleImage ? (
                      <img 
                        src={report.vehicleImage} 
                        alt="Vehicle" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Car className="w-20 h-20 mx-auto mb-4" />
                          <p className="text-lg font-medium">No Image Available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="lg:col-span-1">
                  <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {report.year} {report.make} {report.model}
                  </h3>
                  <div className="space-y-4 text-lg">
                    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <Car className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-bold mr-3 text-gray-700">Registration:</span> 
                      <span className="text-gray-900 font-mono">{report.registrationNo}</span>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <User className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-bold mr-3 text-gray-700">Customer:</span> 
                      <span className="text-gray-900">{report.customerName}</span>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-bold mr-3 text-gray-700">Location:</span> 
                      <span className="text-gray-900">{report.location}</span>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-bold mr-3 text-gray-700">Inspection Date:</span> 
                      <span className="text-gray-900">{new Date(report.inspectionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      <User className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="font-bold mr-3 text-gray-700">Inspector:</span> 
                      <span className="text-gray-900">{report.inspector}</span>
                    </div>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="lg:col-span-1 text-center">
                  <div className="relative inline-block">
                    <div className="w-48 h-48 bg-white border-8 border-red-600 rounded-full shadow-2xl flex items-center justify-center mx-auto">
                      <div>
                        <div className="text-6xl font-black text-red-600">{report.overallRating}</div>
                        <div className="text-xl font-bold text-gray-600">/10</div>
                      </div>
                    </div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full">
                      <Star className="w-5 h-5 inline mr-2" />
                      <span className="font-bold">Overall Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 border-b-4 border-red-600 pb-4">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-red-500">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Chassis Number</p>
                  <p className="text-xl font-mono text-gray-900">{report.chassisNo}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-red-500">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Engine Number</p>
                  <p className="text-xl font-mono text-gray-900">{report.engineNo}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-red-500">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Variant</p>
                  <p className="text-xl font-medium text-gray-900">{report.variant || 'Standard'}</p>
                </div>
                {report.engineCapacity && (
                  <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-red-500">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Engine Capacity</p>
                    <p className="text-xl font-medium text-gray-900">{report.engineCapacity}</p>
                  </div>
                )}
                {report.mileage && (
                  <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-red-500">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Mileage</p>
                    <p className="text-xl font-medium text-gray-900">{report.mileage} km</p>
                  </div>
                )}
                {report.fuelType && (
                  <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-red-500">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Fuel Type</p>
                    <p className="text-xl font-medium text-gray-900">{report.fuelType}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Inspection Results */}
            {report.inspectionResults && Object.keys(report.inspectionResults).length > 0 && (
              <div className="p-12 bg-gray-50">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 border-b-4 border-red-600 pb-4">
                  Detailed Inspection Results
                </h3>
                <div className="space-y-8">
                  {Object.entries(report.inspectionResults).map(([category, items]) => (
                    <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
                      <div className="bg-gray-900 text-white px-8 py-6">
                        <h4 className="font-bold text-2xl uppercase tracking-wide">{category}</h4>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {Object.entries(items).map(([item, value]) => (
                          <div key={item} className="px-8 py-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                            <span className="font-semibold text-lg text-gray-900">{item}</span>
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                              ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth'].includes(value) 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                : ['Fair', 'Worn', 'Low', 'Weak', 'Minor'].includes(value) 
                                ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                                : 'bg-red-100 text-red-800 border border-red-300'
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
            )}

            {/* Comments */}
            {report.comments && (
              <div className="p-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 border-b-4 border-red-600 pb-4">
                  Additional Comments
                </h3>
                <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                  <p className="text-lg text-gray-700 leading-relaxed">{report.comments}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bg-gray-900 text-white p-12 text-center">
              <div className="text-lg">
                <p className="font-bold mb-4 text-2xl">Car2Chain Professional Inspection Services</p>
                <p className="text-gray-300 mb-2">Report Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-gray-400 text-sm">Inspector: {report.inspector} • Report ID: {report._id}</p>
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <p className="text-gray-400 text-xs">
                    This is an official inspection report. For verification, contact Car2Chain support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicReport;