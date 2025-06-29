import React, { useState, useEffect, useRef } from 'react';
import { Save, X, Camera, Upload, CheckCircle, AlertTriangle, User, Car, MapPin, Calendar, Settings, FileText } from 'lucide-react';

const EditReportModal = ({ report, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [realTimeRating, setRealTimeRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Complete Pakistani cars data - same as AddReportForm
  const pakistaniCarsData = {
    'Toyota': {
      'Corolla': ['GLi Manual', 'GLi CVT', 'XLi', 'Altis', 'Grande', 'Altis Grande', 'Hybrid'],
      'Camry': ['2.5L', 'Hybrid', 'Grande'],
      'Prius': ['Standard', 'Alpha', 'S'],
      'Yaris': ['ATIV GLi Manual', 'ATIV GLi CVT', 'GLi', 'GLi-AT'],
      'Fortuner': ['2.7L Manual', '2.7L Auto', '2.8L Diesel', '4x4'],
      'Hilux': ['Single Cab', 'Double Cab', 'Revo', 'Vigo'],
      'Land Cruiser': ['VX', 'GX', 'Prado'],
      'Rush': ['G', 'S'],
      'Hiace': ['Standard', 'Super GL', 'Grand Cabin'],
      'Coaster': ['Standard', 'Deluxe']
    },
    'Honda': {
      'City': ['Aspire', 'IVTEC', 'Aspire Prosmatec', 'CVT'],
      'Civic': ['VTi', 'VTi Oriel', 'RS', 'Type R', 'Turbo'],
      'Accord': ['2.0L', '2.4L', 'Executive', 'Hybrid'],
      'BR-V': ['i-VTEC', 'S', 'L'],
      'HR-V': ['1.8L i-VTEC'],
      'CR-V': ['2.0L', '2.4L', 'AWD'],
      'Vezel': ['Hybrid', 'X', 'Z'],
      'Freed': ['G', 'Hybrid']
    },
    'Suzuki': {
      'Cultus': ['VXR', 'VXL', 'AGS Auto'],
      'Swift': ['DLX', 'GLX', 'GLX CVT', 'Sport'],
      'Wagon R': ['VXR', 'VXL', 'AGS Auto'],
      'Alto': ['VX', 'VXR', 'VXL'],
      'Vitara': ['GLX', 'GLX+'],
      'Jimny': ['Manual', 'Automatic'],
      'Every': ['PA', 'PC', 'GA'],
      'Bolan': ['Standard', 'VX'],
      'Ravi': ['Standard', 'VX'],
      'Mehran': ['VX', 'VXR'] // Classic model
    },
    'Hyundai': {
      'Elantra': ['GLS', 'GLS Sport'],
      'Tucson': ['GLS', 'Ultimate', 'AWD'],
      'Sonata': ['2.0L', '2.4L', 'Hybrid'],
      'Santa Fe': ['GLS', 'Limited', 'AWD'],
      'Grand Starex': ['Standard', 'Royal']
    },
    'KIA': {
      'Picanto': ['Manual', 'Automatic'],
      'Sportage': ['Alpha', 'AWD'],
      'Stonic': ['EX', 'EX+'],
      'Cerato': ['Base', 'EX'],
      'Grand Carnival': ['Standard', 'EX']
    },
    'DFSK': {
      'Glory 580': ['Comfort', 'Style', 'Glory'],
      'Glory 560': ['Base', 'Premium'],
      'Glory 330': ['Standard', 'Plus']
    },
    'MG': {
      'HS': ['Core', 'Exclusive'],
      'ZS': ['Alpha', 'Beta', 'EV'],
      '5': ['Core', 'Exclusive']
    },
    'Changan': {
      'Alsvin': ['Comfort', 'Lumiere', 'Promax'],
      'Karvaan': ['Standard', 'Plus'],
      'CS35 Plus': ['Comfort', 'Lumiere'],
      'Oshan X7': ['Future', 'Hero']
    },
    'FAW': {
      'V2': ['Base', 'Premium'],
      'X-PV': ['Standard', 'Plus'],
      'Carrier': ['Standard', 'Plus']
    },
    'United': {
      'Bravo': ['Base', 'VX'],
      'Alpha': ['Base', 'VX'],
      'Crown': ['Base', 'VX']
    },
    'Nissan': {
      'Dayz': ['S', 'X', 'Highway Star'],
      'Clipper': ['DX', 'GX'],
      'Patrol': ['Super Safari', '4.0L']
    },
    'Mitsubishi': {
      'Mirage': ['GLX', 'GLS'],
      'Pajero': ['GLX', 'GLS', 'Exceed'],
      'Outlander': ['2.0L', '2.4L'],
      'Lancer': ['GLX', 'GLS']
    },
    'Daihatsu': {
      'Mira': ['L', 'X', 'Gino'],
      'Move': ['L', 'X', 'Custom'],
      'Hijet': ['Cargo', 'Truck'],
      'Tanto': ['L', 'X', 'Custom'],
      'Cast': ['Style', 'Sport', 'Activa']
    },
    'Prince': {
      'DFSK K01': ['Standard'],
      'DFSK K05': ['Standard'],
      'DFSK K07': ['Standard']
    },
    'Isuzu': {
      'D-Max': ['Standard', 'V-Cross'],
      'MU-X': ['4x2', '4x4']
    },
    'Peugeot': {
      '2008': ['Active', 'Allure'],
      '3008': ['Active', 'Allure']
    },
    'Proton': {
      'Saga': ['Standard', 'Premium'],
      'X70': ['Standard', 'Premium', 'Executive']
    },
    'Haval': {
      'H6': ['Active', 'Premium'],
      'Jolion': ['Active', 'Premium']
    },
    'Chery': {
      'QQ': ['Standard'],
      'Tiggo': ['2.0L', '1.6L']
    },
    'JAC': {
      'X200': ['Standard'],
      'T6': ['Standard']
    },
    'Foton': {
      'Tunland': ['Standard', '4x4']
    },
    'JW Forland': {
      'Forland': ['Standard']
    },
    'Master': {
      'Changan Karvaan': ['Standard']
    },
    'Zotye': {
      'Z100': ['Standard']
    },
    'BYD': {
      'F0': ['Standard']
    },
    'Great Wall': {
      'Voleex C10': ['Standard'],
      'Wingle': ['Standard', '4x4']
    },
    'JMC': {
      'Vigus': ['Standard', '4x4']
    },
    'Sazgar': {
      'BAIC BJ40': ['Standard', 'Plus']
    },
    'BMW': {
      '3 Series': ['318i', '320i', '330i'],
      '5 Series': ['520i', '530i'],
      'X3': ['xDrive20i', 'xDrive30i'],
      'X5': ['xDrive40i', 'xDrive50i']
    },
    'Mercedes-Benz': {
      'C-Class': ['C180', 'C200', 'C300'],
      'E-Class': ['E200', 'E250', 'E350'],
      'S-Class': ['S400', 'S500'],
      'GLC': ['200', '300']
    },
    'Audi': {
      'A4': ['35 TFSI', '40 TFSI'],
      'A6': ['45 TFSI', '55 TFSI'],
      'Q5': ['40 TFSI', '45 TFSI'],
      'Q7': ['45 TFSI', '55 TFSI']
    },
    'Lexus': {
      'ES': ['250', '350'],
      'LX': ['570', '600'],
      'RX': ['350', '450h']
    },
    'Land Rover': {
      'Discovery': ['HSE', 'Sport'],
      'Range Rover': ['Vogue', 'Sport', 'Evoque']
    },
    'Jeep': {
      'Wrangler': ['Sport', 'Sahara', 'Rubicon'],
      'Grand Cherokee': ['Laredo', 'Limited']
    }
  };

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Sargodha'];
  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric'];
  const transmissionTypes = ['Manual', 'Automatic', 'CVT'];

  // Complete inspection options with all categories - same as AddReportForm
  const inspectionOptions = {
    engine: {
      'Engine Oil': ['Good', 'Ok', 'Fair', 'Poor', 'Needs Replacement'],
      'Engine Oil Level': ['Ok', 'Low', 'Overfilled', 'Empty'],
      'Engine Sound': ['Normal', 'Rough Idle', 'Knocking', 'Not Working'],
      'Air Filter': ['Clean', 'Dirty', 'Needs Replacement'],
      'Coolant Level': ['Ok', 'Low', 'Empty', 'Contaminated'],
      'Engine Mounts': ['Good', 'Worn', 'Broken'],
      'Belts and Hoses': ['Good', 'Cracked', 'Frayed', 'Needs Replacement'],
      'Engine Temperature': ['Normal', 'Running Hot', 'Overheating'],
      'Exhaust Smoke': ['Normal', 'White Smoke', 'Black Smoke', 'Blue Smoke'],
      'Engine Performance': ['Excellent', 'Good', 'Fair', 'Poor']
    },
    transmission: {
      'Gear Shifting': ['Smooth', 'Hard', 'Sluggish', 'Not Working'],
      'Clutch Operation': ['Good', 'Weak', 'Slipping', 'Not Working'],
      'Transmission Fluid': ['Ok', 'Low', 'Dirty', 'Burnt'],
      'Transmission Noise': ['Normal', 'Whining', 'Grinding', 'Clunking'],
      'Reverse Gear': ['Working', 'Hard to Engage', 'Not Working'],
      'CV Joints': ['Good', 'Clicking', 'Worn', 'Damaged'],
      'Differential': ['Normal', 'Noisy', 'Leaking', 'Damaged']
    },
    brakes: {
      'Front Brake Pads': ['Good', 'Worn', 'Needs Replacement'],
      'Rear Brake Pads': ['Good', 'Worn', 'Needs Replacement'],
      'Brake Fluid': ['Ok', 'Low', 'Dirty', 'Empty'],
      'Brake Pedal Feel': ['Firm', 'Soft', 'Spongy', 'No Pressure'],
      'Brake Rotors': ['Good', 'Scored', 'Warped', 'Cracked'],
      'Handbrake': ['Working', 'Loose', 'Tight', 'Not Working'],
      'Brake Lines': ['Good', 'Corroded', 'Leaking', 'Damaged'],
      'ABS System': ['Working', 'Warning Light', 'Not Working', 'N/A']
    },
    suspension: {
      'Front Suspension': ['Good', 'Worn', 'Bouncy', 'Damaged'],
      'Rear Suspension': ['Good', 'Worn', 'Sagging', 'Damaged'],
      'Shock Absorbers': ['Good', 'Weak', 'Leaking', 'Broken'],
      'Springs': ['Good', 'Sagging', 'Broken'],
      'Ball Joints': ['Good', 'Loose', 'Worn', 'Damaged'],
      'Tie Rod Ends': ['Good', 'Loose', 'Worn', 'Damaged'],
      'Bushings': ['Good', 'Cracked', 'Missing', 'Damaged']
    },
    steering: {
      'Steering Feel': ['Responsive', 'Heavy', 'Light', 'Vibrating'],
      'Steering Alignment': ['Centered', 'Pulls Left', 'Pulls Right', 'Wandering'],
      'Power Steering': ['Working', 'Heavy', 'Noisy', 'Not Working'],
      'Steering Fluid': ['Ok', 'Low', 'Dirty', 'Empty'],
      'Steering Wheel': ['Good', 'Worn', 'Loose', 'Damaged'],
      'Steering Column': ['Good', 'Loose', 'Damaged'],
      'Rack and Pinion': ['Good', 'Leaking', 'Worn', 'Damaged']
    },
    electrical: {
      'Battery': ['Good', 'Weak', 'Dead'],
      'Alternator': ['Charging', 'Weak', 'Not Charging'],
      'Starter': ['Working', 'Weak', 'Not Working'],
      'Lights - Headlights': ['Working', 'Dim', 'Not Working'],
      'Lights - Taillights': ['Working', 'Dim', 'Not Working'],
      'Lights - Turn Signals': ['Working', 'Fast Blinking', 'Not Working'],
      'Dashboard Lights': ['Working', 'Some Out', 'Not Working'],
      'Horn': ['Working', 'Weak', 'Not Working'],
      'Wipers': ['Working', 'Streaking', 'Not Working'],
      'Air Conditioning': ['Cold', 'Warm', 'Not Working'],
      'Radio/Audio': ['Working', 'Poor Reception', 'Not Working'],
      'Power Windows': ['All Working', 'Some Not Working', 'None Working'],
      'Central Locking': ['Working', 'Intermittent', 'Not Working']
    },
    interior: {
      'Seats': ['Excellent', 'Good', 'Worn', 'Torn'],
      'Dashboard': ['Good', 'Cracked', 'Faded', 'Damaged'],
      'Door Panels': ['Good', 'Worn', 'Loose', 'Damaged'],
      'Carpet/Floor Mats': ['Clean', 'Stained', 'Worn', 'Missing'],
      'Roof Lining': ['Good', 'Sagging', 'Stained', 'Damaged'],
      'Instruments': ['All Working', 'Some Not Working', 'None Working'],
      'Seat Belts': ['Working', 'Frayed', 'Stuck', 'Missing'],
      'Interior Lights': ['Working', 'Some Out', 'Not Working'],
      'Climate Control': ['Working', 'Intermittent', 'Not Working']
    },
    exterior: {
      'Paint Condition': ['Excellent', 'Good', 'Faded', 'Scratched'],
      'Body Panels': ['Straight', 'Minor Dents', 'Major Dents', 'Rust'],
      'Bumpers': ['Good', 'Scratched', 'Cracked', 'Missing'],
      'Doors': ['Align Properly', 'Loose', 'Hard to Close', 'Damaged'],
      'Windows': ['Clear', 'Scratched', 'Cracked', 'Broken'],
      'Mirrors': ['Good', 'Cracked', 'Loose', 'Missing'],
      'Trim/Molding': ['Good', 'Loose', 'Faded', 'Missing'],
      'Exhaust System': ['Good', 'Noisy', 'Smoking', 'Damaged'],
      'Undercarriage': ['Clean', 'Minor Rust', 'Heavy Rust', 'Damaged']
    },
    tyres: {
      'Front Left Tyre': ['Good', 'Worn', 'Bald', 'Damaged'],
      'Front Right Tyre': ['Good', 'Worn', 'Bald', 'Damaged'],
      'Rear Left Tyre': ['Good', 'Worn', 'Bald', 'Damaged'],
      'Rear Right Tyre': ['Good', 'Worn', 'Bald', 'Damaged'],
      'Spare Tyre': ['Good', 'Worn', 'Flat', 'Missing'],
      'Tyre Pressure': ['Ok', 'Low', 'High', 'Check Required'],
      'Wheel Alignment': ['Good', 'Uneven Wear', 'Needs Alignment'],
      'Wheel Balance': ['Good', 'Vibration', 'Needs Balancing'],
      'Rims/Wheels': ['Good', 'Scratched', 'Bent', 'Cracked']
    }
  };

  useEffect(() => {
    if (report) {
      setFormData({ ...report });
      setRealTimeRating(report.overallRating || 0);
      setCategoryRatings(report.categoryRatings || {});
      
      if (report.vehicleImage) {
        setImagePreview(report.vehicleImage);
      }
      
      // Set up cascading dropdowns
      if (report.make && pakistaniCarsData[report.make]) {
        setAvailableModels(Object.keys(pakistaniCarsData[report.make]));
        
        if (report.model && pakistaniCarsData[report.make][report.model]) {
          setAvailableVariants(pakistaniCarsData[report.make][report.model]);
        }
      }
    }
  }, [report]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setImagePreview(base64String);
        setImageFile(file);
        setFormData(prev => ({
          ...prev,
          vehicleImage: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormData(prev => ({
      ...prev,
      vehicleImage: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'make') {
      if (value && pakistaniCarsData[value]) {
        setAvailableModels(Object.keys(pakistaniCarsData[value]));
        setFormData(prev => ({ ...prev, model: '', variant: '' }));
        setAvailableVariants([]);
      } else {
        setAvailableModels([]);
        setAvailableVariants([]);
      }
    }

    if (field === 'model' && formData.make) {
      if (value && pakistaniCarsData[formData.make][value]) {
        setAvailableVariants(pakistaniCarsData[formData.make][value]);
        setFormData(prev => ({ ...prev, variant: '' }));
      } else {
        setAvailableVariants([]);
      }
    }
  };

  const handleInspectionChange = (category, item, value) => {
    const updatedResults = {
      ...formData.inspectionResults,
      [category]: {
        ...formData.inspectionResults[category],
        [item]: value
      }
    };

    setFormData(prev => ({
      ...prev,
      inspectionResults: updatedResults
    }));

    calculateRealTimeRatings(updatedResults);
  };

  const calculateItemScore = (value) => {
    const scoreMap = {
      'Excellent': 10, 'Good': 10, 'Ok': 10, 'Working': 10, 'Clean': 10, 'Normal': 10,
      'New': 10, 'Perfect': 10, 'Smooth': 10, 'Centered': 10, 'Responsive': 10, 'Firm': 10,
      'All Working': 10, 'Charging': 10, 'Cold': 10, 'Clear': 10, 'Straight': 10,
      'Fair': 7, 'Worn': 7, 'Low': 7, 'Weak': 7, 'Minor': 7, 'Sluggish': 7,
      'Hard': 6, 'Loose': 6, 'Scratched': 6, 'Faded': 6, 'Sagging': 6, 'Dim': 6,
      'Heavy': 6, 'Light': 6, 'Soft': 6, 'Scored': 6, 'Stained': 6,
      'Poor': 4, 'Dirty': 4, 'Major': 4, 'Needs Replacement': 3, 'Cracked': 3,
      'Leaking': 3, 'Corroded': 3, 'Warped': 3, 'Heavy Rust': 2, 'Frayed': 3,
      'Not Working': 1, 'Broken': 1, 'Failed': 1, 'Missing': 1, 'Empty': 1,
      'Burnt': 1, 'Contaminated': 1, 'Dead': 1, 'Bald': 1, 'Damaged': 2,
      'Overheating': 1, 'Slipping': 2, 'Grinding': 2, 'Clunking': 2
    };
    
    return scoreMap[value] || 5;
  };

  const calculateRealTimeRatings = (inspectionResults) => {
    const categoryScores = {};
    let totalScore = 0;
    let totalItems = 0;

    Object.keys(inspectionOptions).forEach(category => {
      const categoryResults = inspectionResults[category] || {};
      const categoryItems = Object.values(categoryResults);
      
      if (categoryItems.length > 0) {
        const categoryTotal = categoryItems.reduce((sum, value) => sum + calculateItemScore(value), 0);
        const categoryAverage = categoryTotal / categoryItems.length;
        categoryScores[category] = Math.round(categoryAverage * 10) / 10;
        
        totalScore += categoryTotal;
        totalItems += categoryItems.length;
      } else {
        categoryScores[category] = 0;
      }
    });

    const overallRating = totalItems > 0 ? Math.round((totalScore / totalItems) * 10) / 10 : 0;
    
    setCategoryRatings(categoryScores);
    setRealTimeRating(overallRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedData = {
        ...formData,
        overallRating: realTimeRating,
        categoryRatings: categoryRatings,
        updatedAt: new Date().toISOString()
      };

      console.log('📝 Updating report with data:', updatedData);

      // Get the auth token
      const token = localStorage.getItem('carchain_auth_token');

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reports/${report._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Report updated successfully:', result);
        alert('Report updated successfully!');
        onSuccess(); // This will refresh the data from backend
      } else {
        const errorText = await response.text();
        console.error('❌ Update failed:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Error updating report:', error);
      alert(`Error updating report: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = (value) => {
    if (['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth', 'Centered', 'Responsive', 'Firm', 'All Working', 'Charging', 'Cold', 'Clear', 'Straight'].includes(value)) {
      return 'border-emerald-300 bg-emerald-50';
    }
    if (['Fair', 'Worn', 'Low', 'Weak', 'Minor', 'Hard', 'Loose', 'Scratched', 'Faded', 'Sagging', 'Dim', 'Heavy', 'Light', 'Soft', 'Scored', 'Stained'].includes(value)) {
      return 'border-amber-300 bg-amber-50';
    }
    return 'border-red-300 bg-red-50';
  };

  if (!report) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 px-8 py-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Edit Inspection Report</h1>
              <p className="text-blue-100 mt-2">
                {formData.year} {formData.make} {formData.model} - {formData.registrationNo}
              </p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm">
                <span className="text-3xl font-bold text-white">{realTimeRating}</span>
              </div>
              <p className="text-sm font-medium text-blue-100 mt-2">Current Rating</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Vehicle Image Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Camera className="w-6 h-6 mr-3 text-blue-600" />
              Vehicle Image
            </h3>
            
            {!imagePreview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group bg-white/50"
              >
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-700 mb-2 font-medium">Click to upload vehicle image</p>
                <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
              </div>
            ) : (
              <div className="relative bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={imagePreview} 
                    alt="Vehicle Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-3 text-center">✓ Image uploaded successfully</p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Car Details Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
              Vehicle Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Customer/Dealer Name <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.customerName || ''}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Engine Capacity
                </label>
                <input
                  type="text"
                  value={formData.engineCapacity || ''}
                  onChange={(e) => handleInputChange('engineCapacity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="e.g., 1300cc"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mileage (km)
                </label>
                <input
                  type="number"
                  value={formData.mileage || ''}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Enter mileage"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  value={formData.fuelType || ''}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Inspection Date <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>
                <input
                  type="date"
                  value={formData.inspectionDate ? new Date(formData.inspectionDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Registration No <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={formData.registrationNo || ''}
                  onChange={(e) => handleInputChange('registrationNo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="e.g., KT-5400"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chassis No <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.chassisNo || ''}
                  onChange={(e) => handleInputChange('chassisNo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Enter chassis number"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Engine No <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.engineNo || ''}
                  onChange={(e) => handleInputChange('engineNo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Enter engine number"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>
                <select
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">Select Location</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Registered City
                </label>
                <select
                  value={formData.registeredCity || ''}
                  onChange={(e) => handleInputChange('registeredCity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                >
                  <option value="">Select Registered City</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Transmission Type
                  </div>
                </label>
                <select
                  value={formData.transmissionType || ''}
                  onChange={(e) => handleInputChange('transmissionType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                >
                  <option value="">Select Transmission Type</option>
                  {transmissionTypes.map(transmission => (
                    <option key={transmission} value={transmission}>{transmission}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color || ''}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Enter color"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Specifications */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Car className="w-6 h-6 mr-3 text-gray-600" />
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Make <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.make || ''}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">Select Make</option>
                  {Object.keys(pakistaniCarsData).map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Model <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.model || ''}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  required
                >
                  <option value="">Select Model</option>
                  {availableModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Variant
                </label>
                <select
                  value={formData.variant || ''}
                  onChange={(e) => handleInputChange('variant', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                >
                  <option value="">Select Variant</option>
                  {availableVariants.map(variant => (
                    <option key={variant} value={variant}>{variant}</option>
                  ))}
                </select>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  min="1980"
                  max={new Date().getFullYear() + 1}
                  value={formData.year || ''}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Enter year"
                  required
                />
              </div>
            </div>
          </div>

          {/* Inspector and Status Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-gray-600" />
              Inspector & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Inspector <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.inspector || ''}
                  onChange={(e) => handleInputChange('inspector', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Enter inspector name"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-time Rating Display */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-emerald-600" />
                  Current Overall Rating
                </h3>
                <p className="text-gray-600 mt-1">Updates as you modify the inspection results</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-white shadow-lg">
                  <span className="text-3xl font-bold text-emerald-600">{realTimeRating}</span>
                </div>
                <p className="text-sm font-medium text-gray-600 mt-2">/ 10</p>
              </div>
            </div>
            
            {Object.keys(categoryRatings).length > 0 && (
              <div className="mt-6 pt-6 border-t border-emerald-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Category Ratings:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(categoryRatings).map(([category, rating]) => (
                    <div key={category} className="text-center bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
                      <div className="text-xl font-bold text-gray-900">{rating}</div>
                      <div className="text-xs text-gray-600 capitalize font-medium mt-1">{category}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inspection Results Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
              Inspection Results
            </h2>
            {Object.entries(inspectionOptions).map(([category, items]) => (
              <div key={category} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                    <h3 className="text-xl font-semibold text-gray-900 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                  </div>
                  {categoryRatings[category] && (
                    <div className="text-lg font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                      {categoryRatings[category]}/10
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(items).map(([item, options]) => {
                    const currentValue = formData.inspectionResults?.[category]?.[item];
                    return (
                      <div key={item} className="relative group">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                          {item}
                        </label>
                        <select
                          value={currentValue || ''}
                          onChange={(e) => handleInspectionChange(category, item, e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white shadow-sm ${
                            currentValue ? getStatusClass(currentValue) : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select condition</option>
                          {options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        {currentValue && (
                          <div className="absolute -top-1 -right-1">
                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                              ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Smooth', 'Centered', 'Responsive', 'Firm', 'All Working', 'Charging', 'Cold', 'Clear', 'Straight'].includes(currentValue) ? 'bg-emerald-500' :
                              ['Fair', 'Worn', 'Low', 'Weak', 'Minor', 'Hard', 'Loose', 'Scratched', 'Faded', 'Sagging', 'Dim', 'Heavy', 'Light', 'Soft', 'Scored', 'Stained'].includes(currentValue) ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Comments Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 mr-3 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900">Additional Comments</h3>
            </div>
            <textarea
              value={formData.comments || ''}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 transition-all duration-200 resize-none shadow-sm"
              placeholder="Enter any additional observations or comments about the inspection..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium hover:scale-105 transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  <span>Update Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReportModal;