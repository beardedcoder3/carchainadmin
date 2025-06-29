import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CheckCircle, AlertTriangle, User, Car, FileText, Calendar, MapPin, Settings, ChevronRight, ChevronLeft, Star } from 'lucide-react';

const AddReportForm = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const [showAlert, setShowAlert] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    customerName: '',
    engineCapacity: '',
    mileage: '',
    fuelType: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    chassisNo: '',
    engineNo: '',
    registrationNo: '',
    location: '',
    registeredCity: '',
    transmissionType: '',
    color: '',
    make: '',
    model: '',
    variant: '',
    year: '',
    customMake: '',
    customModel: '',
    customVariant: '',
    inspector: 'Ahmed Ali',
    vehicleImage: null,
    inspectionResults: {},
    comments: ''
  });

  const [availableModels, setAvailableModels] = useState([]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [realTimeRating, setRealTimeRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState({});

  // Sample data for dropdowns
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

  // Complete inspection options with all categories
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

  // Custom Alert Function
  const showCustomAlert = (message, type = 'error') => {
    setShowAlert({ show: true, message, type });
    setTimeout(() => {
      setShowAlert({ show: false, message: '', type: '' });
    }, 4000);
  };

  // FIXED IMAGE HANDLING - This is the key solution
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showCustomAlert('Please select a valid image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showCustomAlert('Image size should be less than 5MB');
        return;
      }

      console.log('🖼️ Processing image file:', file.name, 'Size:', (file.size / 1024).toFixed(2) + 'KB');

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        console.log('✅ Image converted to base64, length:', base64String.length);
        console.log('🔍 Base64 starts with:', base64String.substring(0, 50));
        
        // Update both preview and form data
        setImagePreview(base64String);
        setImageFile(file);
        setFormData(prev => ({
          ...prev,
          vehicleImage: base64String // Store the complete base64 string including data:image/...
        }));
        
        console.log('📝 Image stored in form data');
      };
      
      reader.onerror = (error) => {
        console.error('❌ Error reading file:', error);
        showCustomAlert('Error reading the image file. Please try again.');
      };
      
      reader.readAsDataURL(file); // This creates data:image/jpeg;base64,... format
    }
  };

  const removeImage = () => {
    console.log('🗑️ Removing image');
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

    // Handle cascading dropdowns for car make/model/variant
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

    // Calculate real-time ratings
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

  const validateForm = () => {
    const requiredFields = [
      { field: 'customerName', label: 'Customer/Dealer Name' },
      { field: 'registrationNo', label: 'Registration Number' },
      { field: 'chassisNo', label: 'Chassis Number' },
      { field: 'engineNo', label: 'Engine Number' },
      { field: 'location', label: 'Location' },
      { field: 'make', label: 'Vehicle Make' },
      { field: 'model', label: 'Vehicle Model' },
      { field: 'year', label: 'Year' },
      { field: 'inspectionDate', label: 'Inspection Date' },
      { field: 'inspector', label: 'Inspector Name' }
    ];
    
    for (let {field, label} of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        showCustomAlert(`Please fill in the ${label} field`);
        return false;
      }
    }

    if (formData.chassisNo.length < 5) {
      showCustomAlert('Chassis Number should be at least 5 characters long');
      return false;
    }

    if (formData.engineNo.length < 5) {
      showCustomAlert('Engine Number should be at least 5 characters long');
      return false;
    }

    if (formData.registrationNo.length < 3) {
      showCustomAlert('Registration Number should be at least 3 characters long');
      return false;
    }

    const totalInspectionItems = Object.values(formData.inspectionResults).reduce(
      (total, category) => total + Object.keys(category).length, 0
    );
    
    if (totalInspectionItems < 3) {
      showCustomAlert('Please complete at least 3 inspection items before submitting');
      return false;
    }

    return true;
  };

  const renderDropdown = (field, options, placeholder, allowCustom = false, required = false, icon = null) => (
    <div className="group">
      <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
        <div className="flex items-center">
          {icon && <span className="mr-2 text-slate-500">{icon}</span>}
          {placeholder} {required && <span className="text-red-500 ml-1">*</span>}
        </div>
      </label>
      <select
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
        required={required}
      >
        <option value="">Select {placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
        {allowCustom && <option value="custom">Custom (Enter Below)</option>}
      </select>
      
      {allowCustom && formData[field] === 'custom' && (
        <input
          type="text"
          placeholder={`Enter custom ${placeholder.toLowerCase()}`}
          value={formData[`custom${field.charAt(0).toUpperCase() + field.slice(1)}`] || ''}
          onChange={(e) => handleInputChange(`custom${field.charAt(0).toUpperCase() + field.slice(1)}`, e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mt-3 transition-all duration-200 bg-slate-50 hover:bg-white text-slate-900"
          required={required}
        />
      )}
    </div>
  );

  const renderCarDetailsForm = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Vehicle Information</h2>
        <p className="text-slate-600 max-w-md mx-auto">Enter the vehicle details and basic information for the inspection report</p>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <Camera className="w-6 h-6 mr-3 text-red-600" />
          Vehicle Image
          {formData.vehicleImage && (
            <span className="ml-2 text-sm text-emerald-600 font-medium">✓ Image uploaded</span>
          )}
        </h3>
        
        {!imagePreview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all duration-300 group"
          >
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-red-500" />
            </div>
            <p className="text-slate-700 mb-2 font-medium">Click to upload vehicle image</p>
            <p className="text-sm text-slate-500">JPG, PNG up to 5MB • Recommended: 800x600px</p>
          </div>
        ) : (
          <div className="relative bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="relative rounded-lg overflow-hidden bg-slate-100" style={{ aspectRatio: '16/9', maxHeight: '300px' }}>
              <img 
                src={imagePreview} 
                alt="Vehicle Preview" 
                className="w-full h-full object-cover"
                onError={() => {
                  console.error('❌ Image preview failed to load');
                  showCustomAlert('Error displaying image preview');
                }}
                onLoad={() => {
                  console.log('✅ Image preview loaded successfully');
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mt-3 text-center">
              ✓ Image uploaded successfully • Size: {imageFile ? (imageFile.size / 1024).toFixed(2) + 'KB' : 'N/A'}
            </p>
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

      {/* Vehicle Details */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-3 text-slate-600" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Name */}
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-500" />
                Customer/Dealer Name <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="Enter customer/dealer name"
              required
            />
          </div>

          {/* Registration No */}
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-2 text-slate-500" />
                Registration No <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.registrationNo}
              onChange={(e) => handleInputChange('registrationNo', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="e.g., KT-5400"
              required
            />
          </div>

          {/* Chassis No */}
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              Chassis No <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.chassisNo}
              onChange={(e) => handleInputChange('chassisNo', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="e.g., KUN25R-9605754"
              required
            />
          </div>

          {/* Engine No */}
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              Engine No <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.engineNo}
              onChange={(e) => handleInputChange('engineNo', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="e.g., 2KD-U486604"
              required
            />
          </div>

          {/* Location */}
          <div>
            {renderDropdown('location', cities, 'Location', false, true, <MapPin className="w-4 h-4" />)}
          </div>

          {/* Registered City */}
          <div>
            {renderDropdown('registeredCity', cities, 'Registered City', false, false, <MapPin className="w-4 h-4" />)}
          </div>

          {/* Additional fields */}
          <div>
            {renderDropdown('transmissionType', transmissionTypes, 'Transmission Type', false, false, <Settings className="w-4 h-4" />)}
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              Color
            </label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => handleInputChange('color', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="Enter color"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              Engine Capacity
            </label>
            <input
              type="text"
              value={formData.engineCapacity}
              onChange={(e) => handleInputChange('engineCapacity', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="e.g., 1800cc"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              Mileage (km)
            </label>
            <input
              type="number"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="Enter mileage in km"
            />
          </div>

          <div>
            {renderDropdown('fuelType', fuelTypes, 'Fuel Type')}
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                Inspection Date <span className="text-red-500 ml-1">*</span>
              </div>
            </label>
            <input
              type="date"
              value={formData.inspectionDate}
              onChange={(e) => handleInputChange('inspectionDate', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              required
            />
          </div>
        </div>
      </div>

      {/* Vehicle Information Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <Car className="w-6 h-6 mr-3 text-slate-600" />
          Vehicle Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            {renderDropdown('make', Object.keys(pakistaniCarsData), 'Make', true, true)}
          </div>
          <div>
            {renderDropdown('model', availableModels, 'Model', true, true)}
          </div>
          <div>
            {renderDropdown('variant', availableVariants, 'Variant', true)}
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              Year <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="number"
              min="1980"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="Enter year"
              required
            />
          </div>
        </div>
      </div>

      {/* Inspector Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center">
          <User className="w-6 h-6 mr-3 text-slate-600" />
          Inspector Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
              Inspector Name <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.inspector}
              onChange={(e) => handleInputChange('inspector', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
              placeholder="Enter inspector name"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderInspectionForm = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Inspection Details</h2>
        <p className="text-slate-600 max-w-md mx-auto">Complete the detailed inspection for each vehicle component</p>
      </div>

      {/* Real-time Rating Display */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <Star className="w-6 h-6 mr-3 text-red-600" />
              Current Overall Rating
            </h3>
            <p className="text-slate-600 mt-1">Updates automatically as you complete the inspection</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center bg-red-50 shadow-lg">
              <span className="text-3xl font-bold text-red-600">{realTimeRating}</span>
            </div>
            <p className="text-sm font-medium text-slate-600 mt-2">/ 10 Points</p>
          </div>
        </div>
        
        {Object.keys(categoryRatings).length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Category Breakdown:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryRatings).map(([category, rating]) => (
                <div key={category} className="text-center bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="text-xl font-bold text-slate-900">{rating}</div>
                  <div className="text-xs text-slate-600 capitalize font-medium mt-1">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {Object.entries(inspectionOptions).map(([category, items]) => (
        <div key={category} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold uppercase tracking-wide">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              {categoryRatings[category] && (
                <div className="text-lg font-bold bg-red-600 px-4 py-2 rounded-full">
                  {categoryRatings[category]}/10
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(items).map(([item, options]) => {
                const currentValue = formData.inspectionResults[category]?.[item];
                return (
                  <div key={item} className="relative group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-red-600">
                      {item}
                    </label>
                    <select
                      value={currentValue || ''}
                      onChange={(e) => handleInspectionChange(category, item, e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 bg-slate-50 hover:bg-white text-slate-900 ${
                        currentValue ? 
                          ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Responsive', 'Firm', 'All Working', 'Charging', 'Cold', 'Clear', 'Straight', 'Smooth'].includes(currentValue) ? 'border-emerald-300 bg-emerald-50' :
                          ['Fair', 'Worn', 'Low', 'Weak', 'Minor', 'Hard', 'Loose', 'Scratched', 'Faded', 'Sagging', 'Dim', 'Heavy', 'Light', 'Soft', 'Scored', 'Stained'].includes(currentValue) ? 'border-amber-300 bg-amber-50' :
                          'border-red-300 bg-red-50'
                        : 'border-slate-300 hover:border-slate-400'
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
                          ['Good', 'Ok', 'Working', 'Excellent', 'Clean', 'Normal', 'Responsive', 'Firm', 'All Working', 'Charging', 'Cold', 'Clear', 'Straight', 'Smooth'].includes(currentValue) ? 'bg-emerald-500' :
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
        </div>
      ))}

      {/* Comments Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 mr-3 text-slate-600" />
          <h3 className="text-xl font-semibold text-slate-900">Additional Comments</h3>
        </div>
        <textarea
          value={formData.comments || ''}
          onChange={(e) => handleInputChange('comments', e.target.value)}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32 transition-all duration-200 resize-none bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900"
          placeholder="Enter any additional observations or comments about the inspection..."
        />
      </div>
    </div>
  );

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);

  try {
    const reportData = {
      ...formData,
      overallRating: realTimeRating,
      categoryRatings: categoryRatings,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    console.log('📤 Submitting report data with image:', {
      ...reportData,
      vehicleImage: reportData.vehicleImage ? `[BASE64 IMAGE - Length: ${reportData.vehicleImage.length}]` : null
    });

    // Get the auth token
    const token = localStorage.getItem('carchain_auth_token');

   const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reportData),
    });

    console.log('📡 Response status:', response.status);

   if (response.ok) {
  const result = await response.json();
  console.log('✅ Report saved to backend:', result);
  
  showCustomAlert('Report submitted successfully!', 'success');
  
  // Reset form
  setFormData({
    customerName: '', engineCapacity: '', mileage: '', fuelType: '',
    inspectionDate: new Date().toISOString().split('T')[0], chassisNo: '', engineNo: '', 
    registrationNo: '', location: '', registeredCity: '', transmissionType: '', 
    color: '', make: '', model: '', variant: '', year: '', customMake: '',
    customModel: '', customVariant: '', inspector: 'Ahmed Ali', vehicleImage: null,
    inspectionResults: {}, comments: ''
  });
  setCurrentStep(1);
  setRealTimeRating(0);
  setCategoryRatings({});
  setImagePreview(null);
  setImageFile(null);
  
  // Call onSuccess callback to go back to reports list
  if (onSuccess) {
    console.log('🔄 Calling onSuccess callback to go back to reports');
    onSuccess();
  }
} else {
      const errorData = await response.text();
      console.error('❌ Backend error response:', errorData);
      throw new Error(`Backend error: ${response.status} - ${errorData}`);
    }

  } catch (error) {
    console.error('❌ Error submitting report:', error);
    showCustomAlert(`There was an error submitting the report: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};
  const steps = [
    { id: 1, name: 'Vehicle Details', icon: Car },
    { id: 2, name: 'Inspection', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Custom Alert */}
      {showAlert.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`rounded-lg border p-4 shadow-lg max-w-md ${
            showAlert.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : showAlert.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {showAlert.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                ) : showAlert.type === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{showAlert.message}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowAlert({ show: false, message: '', type: '' })}
                  className="inline-flex rounded-md p-1.5 hover:bg-white/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Progress Header */}
          <div className="bg-slate-900 px-8 py-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Add New Inspection Report</h1>
                <p className="text-slate-300 mt-2">Create a comprehensive vehicle inspection report</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Step {currentStep} of 2</div>
                <div className="text-2xl font-bold">{Math.round((currentStep / 2) * 100)}%</div>
              </div>
            </div>
            
            {/* Step Indicators */}
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.id)}
                      className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-red-600 text-white scale-105 shadow-lg' 
                          : isCompleted
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{step.name}</span>
                      {isCompleted && <CheckCircle className="w-4 h-4" />}
                    </button>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-slate-500 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="min-h-[600px]">
              {currentStep === 1 ? renderCarDetailsForm() : renderInspectionForm()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
                className="inline-flex items-center px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
              
              <div className="flex items-center space-x-4">
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="inline-flex items-center px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold hover:scale-105 transform shadow-lg"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 font-semibold hover:scale-105 transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>Submit Report</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReportForm;