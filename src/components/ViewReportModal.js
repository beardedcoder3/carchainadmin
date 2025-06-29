import React from 'react';
import { Download, X, Star, Calendar, MapPin, User, Car, FileText, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const ViewReportModal = ({ report, onClose, onDownload }) => {
  if (!report) return null;

  const calculateCategoryRating = (categoryResults) => {
    if (!categoryResults || Object.keys(categoryResults).length === 0) return 0;
    
    const items = Object.values(categoryResults);
    const scores = items.map(value => {
      if (['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal'].includes(value)) return 10;
      if (['Fair', 'Worn', 'Low', 'Weak', 'Minor'].includes(value)) return 7;
      if (['Poor', 'Dirty', 'Hard', 'Needs Replacement', 'Major'].includes(value)) return 4;
      if (['Not Working', 'Broken', 'Failed', 'Missing'].includes(value)) return 1;
      return 5;
    });
    
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10);
  };

  const getStatusClass = (value) => {
    if (['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal'].includes(value)) {
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
    if (['Fair', 'Worn', 'Low', 'Weak', 'Minor'].includes(value)) {
      return 'text-amber-700 bg-amber-50 border-amber-200';
    }
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getStatusIcon = (value) => {
    if (['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal'].includes(value)) {
      return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    }
    if (['Fair', 'Worn', 'Low', 'Weak', 'Minor'].includes(value)) {
      return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getRatingColor = (rating) => {
    if (rating >= 80) return 'bg-emerald-500';
    if (rating >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getOverallRatingColor = (rating) => {
    if (rating >= 8) return 'text-emerald-600';
    if (rating >= 6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { 
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700', 
        border: 'border-emerald-200',
        icon: CheckCircle,
        label: 'Completed' 
      },
      pending: { 
        bg: 'bg-amber-50', 
        text: 'text-amber-700', 
        border: 'border-amber-200',
        icon: AlertTriangle,
        label: 'Pending' 
      },
      'in-progress': { 
        bg: 'bg-blue-50', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        icon: FileText,
        label: 'In Progress' 
      },
      failed: { 
        bg: 'bg-red-50', 
        text: 'text-red-700', 
        border: 'border-red-200',
        icon: XCircle,
        label: 'Failed' 
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-white rounded-full mr-3"></div>
                <h1 className="text-3xl font-bold">Inspection Report</h1>
              </div>
              <p className="text-blue-100 text-lg">
                {report.year} {report.make} {report.model} • {report.registrationNo}
              </p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center text-blue-100">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(report.inspectionDate).toLocaleDateString()}
                </div>
                <div className="flex items-center text-blue-100">
                  <User className="w-4 h-4 mr-2" />
                  {report.inspector}
                </div>
                <div className="flex items-center text-blue-100">
                  <MapPin className="w-4 h-4 mr-2" />
                  {report.location}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onDownload}
                className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Vehicle Overview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                {/* Vehicle Image */}
                <div className="w-48 h-32 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {report.vehicleImage ? (
                    <img 
                      src={report.vehicleImage} 
                      alt="Vehicle" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Car className="w-16 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Vehicle Details */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {report.year} {report.make} {report.model}
                  </h2>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Variant:</span>
                      <span className="font-medium text-gray-900">{report.variant || 'Standard'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Registration:</span>
                      <span className="font-medium text-gray-900">{report.registrationNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Chassis No:</span>
                      <span className="font-medium text-gray-900">{report.chassisNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Engine No:</span>
                      <span className="font-medium text-gray-900">{report.engineNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mileage:</span>
                      <span className="font-medium text-gray-900">{report.mileage ? `${report.mileage} km` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fuel Type:</span>
                      <span className="font-medium text-gray-900">{report.fuelType || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rating Display */}
              <div className="text-center">
                <div className="w-28 h-28 rounded-full border-4 border-blue-500 flex items-center justify-center bg-white shadow-lg mb-3">
                  <span className={`text-3xl font-bold ${getOverallRatingColor(report.overallRating)}`}>
                    {report.overallRating}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-600">Overall Rating</p>
                <div className="flex items-center justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.round(report.overallRating / 2) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Inspection Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Customer Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-gray-900">{report.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-900">{report.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Registered City:</span>
                  <span className="font-medium text-gray-900">{report.registeredCity || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Car className="w-5 h-5 mr-2 text-blue-600" />
                Vehicle Specifications
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Engine:</span>
                  <span className="font-medium text-gray-900">{report.engineCapacity || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transmission:</span>
                  <span className="font-medium text-gray-900">{report.transmissionType || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Color:</span>
                  <span className="font-medium text-gray-900">{report.color || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Inspection Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium text-gray-900">{new Date(report.inspectionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status:</span>
                  {getStatusBadge(report.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Inspector:</span>
                  <span className="font-medium text-gray-900">{report.inspector}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Summary */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
              Inspection Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(report.inspectionResults || {}).map(([category, results]) => {
                const rating = calculateCategoryRating(results);
                return (
                  <div key={category} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <span className="text-lg font-bold text-gray-700">{rating}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${getRatingColor(rating)}`}
                        style={{ width: `${rating}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      {Object.keys(results).length} items inspected
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspection Results */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
              Detailed Inspection Results
            </h3>
            <div className="space-y-6">
              {Object.entries(report.inspectionResults || {}).map(([category, results]) => (
                <div key={category} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 capitalize flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(results).map(([item, value]) => (
                        <div key={item} className={`flex justify-between items-center p-4 rounded-lg border ${getStatusClass(value)}`}>
                          <span className="text-gray-700 font-medium">{item}</span>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(value)}
                            <span className="font-semibold">
                              {value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          {report.comments && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                Additional Comments
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">{report.comments}</p>
              </div>
            </div>
          )}

          {/* Footer Information */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p className="font-medium">Generated on {new Date(report.createdAt || Date.now()).toLocaleDateString()}</p>
              <p className="mt-1">Car2Chain Professional Inspection Portal • Inspector: {report.inspector}</p>
              <p className="mt-1 text-xs">Report ID: {report._id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReportModal;