import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const carAPI = {
  // Get all cars
  getAllCars: () => api.get('/cars'),
  
  // Add more API calls later
  // createCar: (carData) => api.post('/cars', carData),
  // updateCar: (id, carData) => api.put(`/cars/${id}`, carData),
  // deleteCar: (id) => api.delete(`/cars/${id}`),
};

export default api;