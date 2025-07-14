const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const SESSION_ID = 'test-session-' + Date.now();
const PHONE_NUMBER = '+254700000000';
const SERVICE_CODE = '*123#';

// Test scenarios
const testScenarios = [
  {
    name: 'English Language Flow',
    steps: [
      { text: '', expected: 'Welcome to BMI Calculator' },
      { text: '1', expected: 'Please enter your weight' },
      { text: '70', expected: 'Please enter your height' },
      { text: '170', expected: 'Your BMI Result' },
      { text: '1', expected: 'Would you like to receive health tips' },
      { text: '1', expected: 'Health Tips' },
      { text: '2', expected: 'Thank you for using BMI Calculator' }
    ]
  },
  {
    name: 'French Language Flow',
    steps: [
      { text: '', expected: 'Welcome to BMI Calculator' },
      { text: '2', expected: 'Veuillez entrer votre poids' },
      { text: '65', expected: 'Veuillez entrer votre taille' },
      { text: '165', expected: 'Votre Résultat IMC' },
      { text: '1', expected: 'Voulez-vous recevoir des conseils' },
      { text: '2', expected: 'Merci d\'avoir utilisé' }
    ]
  },
  {
    name: 'Swahili Language Flow',
    steps: [
      { text: '', expected: 'Welcome to BMI Calculator' },
      { text: '3', expected: 'Tafadhali weka uzito wako' },
      { text: '80', expected: 'Tafadhali weka urefu wako' },
      { text: '175', expected: 'Matokeo yako ya BMI' },
      { text: '1', expected: 'Je, ungependa kupokea vidokezo' },
      { text: '1', expected: 'Vidokezo vya Afya' },
      { text: '1', expected: 'Tafadhali weka uzito wako' }
    ]
  }
];

async function testUSSDStep(text, sessionId = SESSION_ID) {
  try {
    const response = await axios.post(`${BASE_URL}/ussd`, {
      sessionId,
      serviceCode: SERVICE_CODE,
      phoneNumber: PHONE_NUMBER,
      text
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error making USSD request:', error.message);
    return null;
  }
}

async function runTestScenario(scenario) {
  console.log(`\n🧪 Running Test: ${scenario.name}`);
  console.log('=' .repeat(50));

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    const stepNumber = i + 1;
    
    console.log(`\nStep ${stepNumber}: Input "${step.text}"`);
    
    const response = await testUSSDStep(step.text);
    
    if (response) {
      console.log(`Response: ${response.substring(0, 100)}...`);
      
      if (response.includes(step.expected)) {
        console.log(`✅ Step ${stepNumber} PASSED`);
      } else {
        console.log(`❌ Step ${stepNumber} FAILED - Expected: ${step.expected}`);
      }
    } else {
      console.log(`❌ Step ${stepNumber} FAILED - No response`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function runAllTests() {
  console.log('🚀 Starting USSD BMI Calculator Tests');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Session ID: ${SESSION_ID}`);
  
  // Test health endpoint first
  try {
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health check passed: ${healthResponse.data.message}`);
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}`);
    console.log('Make sure the server is running on port 3000');
    return;
  }

  // Run all test scenarios
  for (const scenario of testScenarios) {
    await runTestScenario(scenario);
  }

  console.log('\n🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testUSSDStep, runTestScenario, runAllTests }; 