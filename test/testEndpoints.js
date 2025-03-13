const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test GET /users
axios.get(`${BASE_URL}/users`)
  .then(response => {
    console.log('GET /users:', response.data);
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });

// Test POST /login
axios.post(`${BASE_URL}/login`, {
  email: 'user@example.com',
  password: 'password'
})
  .then(response => {
    console.log('POST /login:', response.data);
  })
  .catch(error => {
    console.error('Error logging in:', error);
  });

// Test POST /users
axios.post(`${BASE_URL}/users`, {
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'newpassword',
  role: 'student'
})
  .then(response => {
    console.log('POST /users:', response.data);
  })
  .catch(error => {
    console.error('Error creating user:', error);
  });
