const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Your routes
app.get('/api/test', (req, res) => {
  res.send('Backend is connected!');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});