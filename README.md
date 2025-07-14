# BMI USSD Calculator

A multilingual USSD application for calculating BMI (Body Mass Index) and providing personalized health tips. The application supports English, French, and Swahili languages.

## Features

- **Multilingual Support**: English, French, and Swahili
- **BMI Calculation**: Accurate BMI calculation using weight (KG) and height (CM)
- **Health Categories**: Classifies users as underweight, normal, overweight, or obese
- **Personalized Health Tips**: Provides specific health advice based on BMI category
- **Session Management**: Maintains user sessions using Redis or in-memory storage
- **Africa's Talking Integration**: Ready for deployment on Africa's Talking platform
- **Input Validation**: Validates user inputs for realistic weight and height ranges

## BMI Categories
 
- **Underweight**: BMI < 18.5
- **Normal Weight**: BMI 18.5 - 24.9
- **Overweight**: BMI 25.0 - 29.9
- **Obese**: BMI ≥ 30.0

## Prerequisites

- Node.js (v14 or higher)
- Redis (optional, falls back to in-memory storage)
- Africa's Talking account (for production deployment)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sincere-abayo/BMI-USSD-Calculator.git
cd ussd
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp config.env.example config.env
```

Edit `config.env` with your settings:

```
PORT=3000
REDIS_URL=redis://localhost:6379
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=your_africas_talking_username
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on port 3000 (or the port specified in your config).

## API Endpoints

### USSD Endpoint

- **URL**: `POST /ussd`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Parameters**:
  - `sessionId`: Unique session identifier
  - `serviceCode`: USSD service code
  - `phoneNumber`: User's phone number
  - `text`: User input (can be empty for first request)

### Health Check

- **URL**: `GET /health`
- **Response**: JSON status message

## USSD Flow

1. **Language Selection**: User chooses preferred language (English, French, Swahili)
2. **Weight Input**: User enters weight in kilograms
3. **Height Input**: User enters height in centimeters
4. **BMI Result**: Display calculated BMI and category
5. **Health Tips Option**: Ask if user wants health tips
6. **Health Tips**: Display personalized health advice
7. **Restart/End**: Option to calculate again or end session

## Session Management

The application uses Redis for session storage with automatic fallback to in-memory storage if Redis is unavailable. Sessions expire after 30 minutes of inactivity.

## Deployment on Africa's Talking

1. Deploy your application to a server with a public IP
2. Configure your Africa's Talking USSD service:

   - Set the callback URL to: `http://your-server-ip:3000/ussd`
   - Ensure your server is accessible from the internet

3. Update your `config.env` with Africa's Talking credentials:

```
AT_API_KEY=your_actual_api_key
AT_USERNAME=your_actual_username
```

## Testing

### Local Testing with cURL

```bash
# Test the USSD endpoint
curl -X POST http://localhost:3000/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text="
```

### Testing Different Steps

```bash
# Language selection (English)
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text=1"

# Weight input
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text=70"

# Height input
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text=170"
```

## Project Structure

```
ussd/
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── config.env              # Environment configuration
├── README.md               # This file
└── services/
    ├── ussdService.js      # Main USSD logic
    ├── sessionManager.js   # Session handling
    ├── bmiCalculator.js    # BMI calculation logic
    ├── healthTips.js       # Health tips and advice
    └── languageManager.js  # Multilingual support
```

## Health Tips by Category

### Underweight

- Eat more calories than you burn
- Include protein-rich foods
- Add healthy fats
- Eat frequent meals
- Include strength training
- Consider nutritional supplements

### Normal Weight

- Maintain current healthy weight
- Eat balanced diet with fruits and vegetables
- Exercise regularly (150 minutes/week)
- Stay hydrated
- Get adequate sleep (7-9 hours)
- Avoid processed foods

### Overweight

- Reduce calorie intake gradually
- Increase physical activity (30 minutes/day)
- Eat more vegetables and lean proteins
- Limit processed foods and sugary drinks
- Practice portion control
- Consider working with a nutritionist

### Obese

- Consult healthcare provider
- Start with low-impact exercises
- Focus on portion control
- Keep food diary
- Join support group
- Consider medical weight loss options

## Error Handling

The application includes comprehensive error handling:

- Input validation for weight and height
- Session management errors
- Redis connection failures
- Invalid user inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:

- Create an issue in the repository
- Contact the development team

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement rate limiting for production use
- Validate all user inputs
- Use HTTPS in production
