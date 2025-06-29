import React, { useState, useEffect } from 'react';
import { carAPI } from '../services/api';

const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getAllCars();
      setCars(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cars: ' + err.message);
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading cars...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Cars Database</h2>
      <div className="grid gap-4">
        {cars.length === 0 ? (
          <p className="text-gray-500">No cars found in database.</p>
        ) : (
          cars.map((car) => (
            <div key={car._id} className="bg-white rounded-lg shadow-md p-4 border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <p className="text-gray-600">VIN: {car.vin}</p>
                  <p className="text-gray-600">License: {car.licensePlate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Mileage: {car.mileage?.toLocaleString()}</p>
                  <p className="text-gray-600">Color: {car.color}</p>
                  <p className="text-gray-600">Fuel: {car.fuelType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Owner: {car.ownerName}</p>
                  <p className="text-gray-600">Phone: {car.ownerPhone}</p>
                  <p className="text-gray-600">Email: {car.ownerEmail}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    car.inspectionStatus === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : car.inspectionStatus === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {car.inspectionStatus}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CarsList;