// PublicReport.js - Create this new component
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';

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
      
      // Fetch report data - NO authentication required for public access
     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/reports/${reportId}`);
      
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      } else {
        throw new Error('Report not found');
      }
    } catch (error) {
      console.error('❌ Error fetching public report:', error);
      setError('Report not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryRating = (categoryItems) => {
    if (!categoryItems || Object.keys(categoryItems).length === 0) return 0;
    
    const values = Object.values(categoryItems);
    const scores = values.map(value => {
      const lowerValue = value.toLowerCase();
      if (['excellent', 'good', 'working', 'clean', 'normal', 'smooth'].includes(lowerValue)) return 10;
      if (['ok', 'fair', 'worn', 'low', 'weak', 'minor'].includes(lowerValue)) return 6;
      return 3;
    });
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 10) / 10;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading inspection report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md">
          <div className="text-red-500 text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Report Not Found</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <p className="text-sm text-slate-500">The report may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .container { box-shadow: none; margin: 0; padding: 20px; }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50">
        {/* Print Button - Hidden when printing */}
        <div className="no-print fixed top-6 right-6 z-10">
          <button
            onClick={handlePrint}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition-all duration-200 flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Report Content */}
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 text-center">
              <div className="mb-4">
                <h1 className="text-4xl font-bold tracking-wide">CAR2CHAIN</h1>
                <p className="text-red-100 text-sm uppercase tracking-widest mt-2">Professional Vehicle Inspection Services</p>
              </div>
              <h2 className="text-2xl font-semibold">Official Inspection Report</h2>
            </div>

            {/* Vehicle Info Header */}
            <div className="p-8 bg-slate-50 border-b border-slate-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                
                {/* Vehicle Image */}
                <div className="lg:col-span-1">
                  <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                    {report.vehicleImage ? (
                      <img 
                        src={report.vehicleImage} 
                        alt="Vehicle" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🚗</div>
                          <p className="text-sm">No Image Available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="lg:col-span-1">
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    {report.year} {report.make} {report.model}
                  </h3>
                  <div className="space-y-2 text-slate-700">
                    <p><span className="font-semibold">Registration:</span> {report.registrationNo}</p>
                    <p><span className="font-semibold">Customer:</span> {report.customerName}</p>
                    <p><span className="font-semibold">Location:</span> {report.location}</p>
                    <p><span className="font-semibold">Inspection Date:</span> {new Date(report.inspectionDate).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Inspector:</span> {report.inspector}</p>
                  </div>
                </div>

                {/* Overall Rating */}
                <div className="lg:col-span-1 text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-white border-8 border-red-600 rounded-full shadow-lg">
                    <div>
                      <div className="text-4xl font-bold text-red-600">{report.overallRating}</div>
                      <div className="text-sm font-medium text-slate-600">/10</div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mt-4">Overall Rating</h4>
                </div>
              </div>
            </div>

            {/* Vehicle Technical Details */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Chassis Number</p>
                  <p className="text-lg font-medium text-slate-900">{report.chassisNo}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Engine Number</p>
                  <p className="text-lg font-medium text-slate-900">{report.engineNo}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Variant</p>
                  <p className="text-lg font-medium text-slate-900">{report.variant || 'Standard'}</p>
                </div>
              </div>
            </div>

            {/* Inspection Results */}
            {report.inspectionResults && Object.keys(report.inspectionResults).length > 0 && (
              <div className="p-8 bg-slate-50">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                  Detailed Inspection Results
                </h3>
                <div className="space-y-6">
                  {Object.entries(report.inspectionResults).map(([category, items]) => (
                    <div key={category} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                      <div className="bg-slate-900 text-white px-6 py-4">
                        <h4 className="font-bold text-lg uppercase tracking-wide">{category}</h4>
                      </div>
                      <div className="divide-y divide-slate-200">
                        {Object.entries(items).map(([item, value]) => (
                          <div key={item} className="px-6 py-4 flex justify-between items-center">
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
            )}

            {/* Comments */}
            {report.comments && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                  Additional Comments
                </h3>
                <div className="bg-slate-50 p-6 rounded-lg">
                  <p className="text-slate-700 leading-relaxed">{report.comments}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bg-slate-900 text-white p-8 text-center">
              <div className="text-sm">
                <p className="font-semibold mb-2">Car2Chain Professional Inspection Services</p>
                <p className="text-slate-300">Report Generated: {new Date().toLocaleDateString()}</p>
                <p className="text-slate-400 text-xs mt-2">Inspector: {report.inspector} • Report ID: {report._id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicReport;