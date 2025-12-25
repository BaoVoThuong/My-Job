const axios = require('axios');

async function testApplicationsAPI() {
  try {
    console.log('Testing new API endpoint: /api/employer/applications/7');
    
    // Test without authentication first to see the endpoint structure
    const response = await axios.get('http://localhost:5000/api/employer/applications/7', {
      headers: {
        'Authorization': 'Bearer test-token' // You'll need a real token
      }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
    console.log('Headers:', error.config?.headers);
  }
}

testApplicationsAPI();