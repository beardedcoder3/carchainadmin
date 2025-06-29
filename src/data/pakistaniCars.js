export const pakistaniCarsData = {
  Toyota: {
    Corolla: ['GLi', 'XLi', 'Altis', 'Altis Grande', 'SE Saloon', 'Custom'],
    Vitz: ['F', 'U', 'Jewela', 'Custom'],
    Prius: ['Alpha', 'S', 'G', 'Custom'],
    Camry: ['Up-Spec', 'Standard', 'Custom'],
    Prado: ['TX', 'TZ', 'VX', 'Custom'],
    Hiace: ['Standard', 'Grand Cabin', 'Custom'],
    Aqua: ['S', 'G', 'L', 'Custom']
  },
  Honda: {
    City: ['Aspire', 'i-VTEC', 'CVT', 'Manual', 'Custom'],
    Civic: ['VTi', 'VTi Oriel', 'RS', 'Type R', 'Custom'],
    Accord: ['Executive', 'VTi-L', 'Custom'],
    BRV: ['i-VTEC', 'CVT', 'Custom'],
    Vezel: ['Hybrid Z', 'Hybrid X', 'Hybrid RS', 'Custom'],
    CRV: ['i-VTEC', 'Custom']
  },
  Suzuki: {
    Mehran: ['VX', 'VXR', 'Custom'],
    Cultus: ['VXR', 'VXL', 'AGS', 'Custom'],
    WagonR: ['VXR', 'VXL', 'AGS', 'Custom'],
    Swift: ['DLX', 'GLX', 'Custom'],
    Jimny: ['Standard', 'Custom'],
    Alto: ['VX', 'VXR', 'VXL', 'Custom'],
    Bolan: ['Standard', 'Custom']
  },
  Hyundai: {
    Elantra: ['GLS', 'Limited', 'Custom'],
    Tucson: ['GLS', 'Ultimate', 'Custom'],
    Sonata: ['GLS', 'Limited', 'Custom']
  },
  KIA: {
    Picanto: ['Standard', 'Automatic', 'Custom'],
    Sportage: ['LX', 'EX', 'Custom'],
    Stonic: ['EX', 'Custom']
  },
  Nissan: {
    Sunny: ['EX Saloon', 'Custom'],
    Patrol: ['SE', 'LE', 'Custom'],
    Dayz: ['Highway Star', 'Custom']
  },
  Mitsubishi: {
    Pajero: ['Exceed', 'GLS', 'Custom'],
    Lancer: ['GLX', 'GLS', 'Custom']
  },
  Daihatsu: {
    Mira: ['L', 'X', 'Custom'],
    Move: ['L', 'X', 'Custom'],
    Cuore: ['CL', 'CX', 'Custom']
  },
  'FAW': {
    'V2': ['Standard', 'Custom'],
    'X-PV': ['Standard', 'Custom']
  },
  'DFSK': {
    'Glory 580': ['Comfort', 'Glory', 'Custom'],
    'Glory 330': ['Standard', 'Custom']
  },
  'MG': {
    'HS': ['Core', 'Exclusive', 'Custom'],
    'ZS': ['Alpha', 'Custom']
  },
  'Changan': {
    'Alsvin': ['Comfort', 'Lumiere', 'Custom'],
    'Karvaan': ['Standard', 'Custom']
  },
  'Proton': {
    'Saga': ['Standard', 'Executive', 'Custom'],
    'X70': ['Standard', 'Executive', 'Premium', 'Custom']
  }
};

export const inspectionOptions = {
  engine: {
    'Engine Oil': ['Ok', 'Leakage', 'Need Change', 'Low Level'],
    'Engine Oil Level': ['Ok', 'Low', 'Overfilled'],
    'Engine Oil Condition': ['Good', 'Fair', 'Poor', 'Dirty'],
    'Coolant Level': ['Ok', 'Low', 'Empty'],
    'Coolant Condition': ['Good', 'Rusty', 'Dirty'],
    'Air Filter': ['Clean', 'Dirty', 'Needs Replacement'],
    'Engine Sound': ['Normal', 'Rough Idle', 'Knocking', 'Unusual Noise'],
    'Engine Performance': ['Excellent', 'Good', 'Fair', 'Poor'],
    'Exhaust Smoke': ['None', 'White Smoke', 'Black Smoke', 'Blue Smoke'],
    'Engine Mounts': ['Ok', 'Worn', 'Broken'],
    'Timing Belt/Chain': ['Ok', 'Needs Inspection', 'Needs Replacement'],
    'Spark Plugs': ['Ok', 'Worn', 'Needs Replacement'],
    'Fuel System': ['Ok', 'Minor Issues', 'Major Issues']
  },
  transmission: {
    'Transmission Type': ['Manual', 'Automatic', 'CVT'],
    'Gear Shifting': ['Smooth', 'Hard', 'Slipping'],
    'Clutch Operation': ['Good', 'Slipping', 'Hard', 'Needs Adjustment'],
    'Transmission Fluid': ['Ok', 'Low', 'Dirty', 'Burnt'],
    'CV Joints': ['Ok', 'Worn', 'Clicking Noise'],
    'Drive Shaft': ['Ok', 'Worn', 'Damaged']
  },
  brakes: {
    'Front Brake Pads': ['Good', 'Worn', 'Needs Replacement'],
    'Rear Brake Pads': ['Good', 'Worn', 'Needs Replacement'],
    'Brake Discs': ['Good', 'Scored', 'Warped', 'Needs Replacement'],
    'Brake Fluid': ['Ok', 'Low', 'Dirty', 'Contaminated'],
    'Handbrake': ['Ok', 'Loose', 'Needs Adjustment'],
    'ABS System': ['Working', 'Warning Light', 'Not Working'],
    'Brake Lines': ['Ok', 'Leaking', 'Corroded']
  },
  suspension: {
    'Front Suspension': ['Ok', 'Worn', 'Leaking', 'Needs Replacement'],
    'Rear Suspension': ['Ok', 'Worn', 'Leaking', 'Needs Replacement'],
    'Shock Absorbers': ['Good', 'Worn', 'Leaking'],
    'Springs': ['Ok', 'Sagging', 'Broken'],
    'Ball Joints': ['Ok', 'Worn', 'Play in Joint'],
    'Tie Rod Ends': ['Ok', 'Worn', 'Loose']
  },
  steering: {
    'Power Steering': ['Working', 'Hard', 'Leaking', 'Not Working'],
    'Steering Wheel': ['Centered', 'Off-Center', 'Vibration'],
    'Steering Response': ['Good', 'Sluggish', 'Over-Sensitive'],
    'Power Steering Fluid': ['Ok', 'Low', 'Dirty']
  },
  electrical: {
    'Battery': ['Good', 'Weak', 'Needs Replacement'],
    'Alternator': ['Working', 'Weak Output', 'Not Charging'],
    'Starter Motor': ['Working', 'Slow', 'Not Working'],
    'Lights - Headlights': ['Working', 'Dim', 'Not Working'],
    'Lights - Taillights': ['Working', 'Dim', 'Not Working'],
    'Lights - Indicators': ['Working', 'Fast Blinking', 'Not Working'],
    'Horn': ['Working', 'Weak', 'Not Working'],
    'Wipers': ['Working', 'Slow', 'Not Working'],
    'Air Conditioning': ['Working', 'Weak', 'Not Working', 'Needs Gas'],
    'Heater': ['Working', 'Not Working'],
    'Radio/Infotainment': ['Working', 'Issues', 'Not Working']
  },
  interior: {
    'Seats Condition': ['Good', 'Worn', 'Torn', 'Stained'],
    'Dashboard': ['Good', 'Cracked', 'Faded'],
    'Steering Wheel': ['Good', 'Worn', 'Cracked'],
    'Gear Lever': ['Good', 'Worn', 'Loose'],
    'Handbrake Lever': ['Good', 'Worn', 'Loose'],
    'Door Panels': ['Good', 'Worn', 'Damaged'],
    'Roof Lining': ['Good', 'Sagging', 'Stained'],
    'Floor Mats': ['Good', 'Worn', 'Missing'],
    'Windows': ['Ok', 'Scratched', 'Cracked'],
    'Mirrors': ['Ok', 'Cracked', 'Missing']
  },
  exterior: {
    'Paint Condition': ['Excellent', 'Good', 'Fair', 'Poor'],
    'Body Panels': ['Original', 'Repaired', 'Replaced', 'Damaged'],
    'Rust': ['None', 'Surface Rust', 'Heavy Rust'],
    'Dents': ['None', 'Minor', 'Major'],
    'Scratches': ['None', 'Minor', 'Deep'],
    'Bumpers': ['Good', 'Scratched', 'Cracked', 'Missing'],
    'Grille': ['Good', 'Damaged', 'Missing'],
    'Chrome/Trim': ['Good', 'Faded', 'Missing']
  },
  tyres: {
    'Front Tyre Condition': ['Good', 'Worn', 'Needs Replacement'],
    'Rear Tyre Condition': ['Good', 'Worn', 'Needs Replacement'],
    'Spare Tyre': ['Good', 'Worn', 'Missing'],
    'Tyre Pressure': ['Ok', 'Low', 'High'],
    'Wheel Alignment': ['Ok', 'Needs Alignment'],
    'Wheel Balancing': ['Ok', 'Needs Balancing'],
    'Alloy Wheels': ['Good', 'Scratched', 'Dented', 'Not Present']
  }
};

export const cities = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Bahawalpur',
  'Sargodha', 'Sukkur', 'Larkana', 'Jhang', 'Sahiwal', 'Okara', 'Wah Cantonment',
  'Dera Ghazi Khan', 'Mirpur Khas', 'Nawabshah', 'Mingora', 'Chiniot',
  'Kamoke', 'Mandi Bahauddin', 'Jhelum', 'Sadiqabad', 'Khanewal', 'Hafizabad',
  'Kohat', 'Muzaffargarh', 'Khanpur', 'Gojra', 'Bahawalnagar', 'Muridke',
  'Pakpattan', 'Abottabad', 'Talagang', 'Jaranwala', 'Other'
];

export const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric'];
export const transmissionTypes = ['Manual', 'Automatic', 'CVT'];
export const inspectionStatuses = ['Pending', 'In Progress', 'Completed', 'Failed'];