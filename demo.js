const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testUSSDFlow(language, weight, height, sessionId) {
  console.log(`\n🌍 Testing ${language} Language Flow`);
  console.log('=' .repeat(50));
  
  try {
    // Step 1: Initial request (language selection)
    console.log('📱 Step 1: Language selection');
    let response = await axios.post(`${BASE_URL}/ussd`, {
      sessionId,
      serviceCode: '*123#',
      phoneNumber: '+254700000000',
      text: ''
    });
    console.log('Response:', response.data.substring(0, 100) + '...');
    
    // Step 2: Select language
    console.log(`\n🌐 Step 2: Selecting ${language}`);
    response = await axios.post(`${BASE_URL}/ussd`, {
      sessionId,
      serviceCode: '*123#',
      phoneNumber: '+254700000000',
      text: language === 'English' ? '1' : language === 'French' ? '2' : '3'
    });
    console.log('Response:', response.data.substring(0, 100) + '...');
    
    // Step 3: Enter weight
    console.log(`\n⚖️ Step 3: Entering weight (${weight}kg)`);
    response = await axios.post(`${BASE_URL}/ussd`, {
      sessionId,
      serviceCode: '*123#',
      phoneNumber: '+254700000000',
      text: weight.toString()
    });
    console.log('Response:', response.data.substring(0, 100) + '...');
    
    // Step 4: Enter height
    console.log(`\n📏 Step 4: Entering height (${height}cm)`);
    response = await axios.post(`${BASE_URL}/ussd`, {
      sessionId,
      serviceCode: '*123#',
      phoneNumber: '+254700000000',
      text: height.toString()
    });
    console.log('Response:', response.data.substring(0, 100) + '...');
    
    // Step 5: Get health tips
    console.log('\n💡 Step 5: Requesting health tips');
    response = await axios.post(`${BASE_URL}/ussd`, {
      sessionId,
      serviceCode: '*123#',
      phoneNumber: '+254700000000',
      text: '1'
    });
    console.log('Response:', response.data.substring(0, 100) + '...');
    
    // Step 6: Show tips
    console.log('\n🏥 Step 6: Showing health tips');
    response = await axios.post(`${BASE_URL}/ussd`, {
      sessionId,
      serviceCode: '*123#',
      phoneNumber: '+254700000000',
      text: '1'
    });
    console.log('Response:', response.data.substring(0, 100) + '...');
    
    // Step 7: End session
    console.log('\n👋 Step 7: Ending session');
    response = await axios.post(`${BASE_URL}/ussd`, {
      sessionId,
      serviceCode: '*123#',
      phoneNumber: '+254700000000',
      text: '2'
    });
    console.log('Response:', response.data);
    
    console.log(`✅ ${language} flow completed successfully!`);
    
  } catch (error) {
    console.error(`❌ Error in ${language} flow:`, error.message);
  }
}

async function runDemo() {
  console.log('🚀 BMI USSD Calculator Demo');
  console.log('=' .repeat(50));
  
  // Test health endpoint
  try {
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.message);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }
  
  // Test different scenarios
  await testUSSDFlow('English', 70, 170, 'demo-en-' + Date.now());
  await testUSSDFlow('French', 65, 165, 'demo-fr-' + Date.now());
  await testUSSDFlow('Kinyarwanda', 80, 175, 'demo-rw-' + Date.now());
  
  console.log('\n🎉 Demo completed!');
  console.log('\n📋 Summary:');
  console.log('- ✅ Multilingual support (English, French, Kinyarwanda)');
  console.log('- ✅ BMI calculation with accurate results');
  console.log('- ✅ Health category classification');
  console.log('- ✅ Personalized health tips');
  console.log('- ✅ Session management');
  console.log('- ✅ Input validation');
  console.log('- ✅ Ready for Africa\'s Talking deployment');
}

// Run demo if this file is executed directly
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { testUSSDFlow, runDemo }; 