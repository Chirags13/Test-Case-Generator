import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateTestCases = async (data) => {
  try {
    const response = await api.post('/generate-test-cases', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || 'Failed to generate test cases');
    } else if (error.request) {
      throw new Error('No response from server. Please ensure the backend is running.');
    } else {
      throw new Error('Error setting up request: ' + error.message);
    }
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend health check failed');
  }
};

export default api;
