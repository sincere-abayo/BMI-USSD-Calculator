const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { USSDService } = require('./services/ussdService');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize USSD service
const ussdService = new USSDService();

// USSD endpoint
app.post('/ussd', async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    
    console.log('USSD Request:', {
      sessionId,
      serviceCode,
      phoneNumber,
      text
    });

    const response = await ussdService.handleUSSD(sessionId, phoneNumber, text);
    
    res.set('Content-Type', 'text/plain');
    res.send(response);
  } catch (error) {
    console.error('USSD Error:', error);
    res.status(500).send('END An error occurred. Please try again.');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BMI USSD Service is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 BMI USSD Server running on port ${PORT}`);
  console.log(`📞 USSD Endpoint: https://bmi-ussd-calculator.onrender.com/ussd`);
  console.log(`🏥 Health Check: https://bmi-ussd-calculator.onrender.com/health`);
  console.log(`💡 Server is ready to handle USSD requests!`);
}); 