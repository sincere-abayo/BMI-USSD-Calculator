# Quick Start Guide - BMI USSD Calculator

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will start on port 3000 with a clean startup message.

### 3. Test the Application

#### Health Check

```bash
curl http://localhost:3000/health
```

#### Test USSD Flow

```bash
# Start a new session
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text="

# Select English language
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text=1"

# Enter weight (70kg)
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text=70"

# Enter height (170cm)
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text=170"
```

#### Run Complete Demo

```bash
node demo.js
```

## 🌍 Supported Languages

1. **English** - Select option 1
2. **French** - Select option 2
3. **Kinyarwanda** - Select option 3

## 📊 BMI Categories

- **Underweight**: BMI < 18.5
- **Normal Weight**: BMI 18.5 - 24.9
- **Overweight**: BMI 25.0 - 29.9
- **Obese**: BMI ≥ 30.0

## 🏥 Health Tips

Each BMI category provides personalized health advice:

- **Underweight**: Tips for healthy weight gain
- **Normal**: Tips for maintaining health
- **Overweight**: Tips for gradual weight loss
- **Obese**: Tips for medical consultation and lifestyle changes

## 🔧 Configuration

Edit `config.env` to customize:

- Port number
- Redis connection (optional)
- Africa's Talking credentials (for production)

## 📱 Africa's Talking Deployment

1. Deploy to a server with public IP
2. Configure USSD service in Africa's Talking dashboard
3. Set callback URL to: `https://your-domain.com/ussd`
4. Test with your USSD code (e.g., \*123#)

## 🧪 Testing

### Manual Testing

```bash
# Test different languages
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text=2"  # French

# Test invalid inputs
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text=abc"  # Invalid weight
```

### Automated Testing

```bash
node test/test-ussd.js
```

## 🐛 Troubleshooting

### Server won't start

- Check if port 3000 is available
- Kill existing processes: `pkill -f "node server.js"`

### Redis errors

- The app automatically falls back to in-memory storage
- No action needed for development

### USSD not responding

- Check server logs
- Verify endpoint is accessible
- Test with curl commands above

## 📈 Features

✅ **Multilingual Support** - English, French, Kinyarwanda  
✅ **Accurate BMI Calculation** - Weight (KG) and Height (CM)  
✅ **Health Categories** - Underweight, Normal, Overweight, Obese  
✅ **Personalized Health Tips** - Based on BMI category  
✅ **Session Management** - Redis or in-memory storage  
✅ **Input Validation** - Realistic weight/height ranges  
✅ **Africa's Talking Ready** - Production deployment ready  
✅ **Error Handling** - Graceful fallbacks and validation

## 🎯 Next Steps

1. **Test locally** with the demo script
2. **Deploy to server** following DEPLOYMENT.md
3. **Configure Africa's Talking** for production use
4. **Monitor and scale** as needed

## 📞 Support

- Check logs for errors
- Test with curl commands
- Review DEPLOYMENT.md for production setup
- Use demo.js for comprehensive testing

---

**Ready to deploy!** 🚀
