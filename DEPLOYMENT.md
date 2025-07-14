# Deployment Guide for Africa's Talking

This guide will help you deploy the BMI USSD Calculator to Africa's Talking platform.

## Prerequisites

1. **Africa's Talking Account**: Sign up at [Africa's Talking](https://africastalking.com/)
2. **Server**: A server with a public IP address (VPS, AWS, DigitalOcean, etc.)
3. **Domain**: A domain name pointing to your server (optional but recommended)

## Step 1: Server Setup

### Option A: Using a VPS (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Redis (optional)
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx (for reverse proxy)
sudo apt install nginx -y
```

### Option B: Using Docker

Create a `docker-compose.yml` file:

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    restart: unless-stopped
```

## Step 2: Application Deployment

1. **Clone and setup the application**:

```bash
# Clone your repository
git clone <your-repo-url>
cd ussd

# Install dependencies
npm install

# Create production config
cp config.env.example config.env
```

2. **Configure environment variables**:

Edit `config.env`:

```bash
PORT=3000
REDIS_URL=redis://localhost:6379
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=your_africas_talking_username
NODE_ENV=production
```

3. **Start the application**:

```bash
# Using PM2
pm2 start server.js --name "bmi-ussd"

# Or using npm
npm start
```

## Step 3: Nginx Configuration

Create `/etc/nginx/sites-available/bmi-ussd`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/bmi-ussd /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 4: SSL Certificate (Recommended)

Install Certbot for Let's Encrypt SSL:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Step 5: Africa's Talking Configuration

1. **Log into Africa's Talking Dashboard**

2. **Create a USSD Service**:

   - Go to "USSD" in the dashboard
   - Click "Create USSD Service"
   - Fill in the details:
     - **Service Name**: BMI Calculator
     - **Service Code**: \*123# (or your preferred code)
     - **Callback URL**: `https://your-domain.com/ussd`
     - **HTTP Method**: POST

3. **Configure the callback URL**:
   - The callback URL should point to your server's `/ussd` endpoint
   - Use HTTPS if you have SSL configured
   - Example: `https://your-domain.com/ussd`

## Step 6: Testing

### Test the USSD Service

1. **Dial the USSD code** (e.g., \*123#) from your phone
2. **Follow the flow**:
   - Select language (1=English, 2=French, 3=Swahili)
   - Enter weight in KG
   - Enter height in CM
   - View BMI result and category
   - Choose to get health tips or calculate again

### Test the API Endpoint

```bash
# Test the health endpoint
curl https://your-domain.com/health

# Test the USSD endpoint
curl -X POST https://your-domain.com/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=*123#&phoneNumber=+254700000000&text="
```

## Step 7: Monitoring and Logs

### View Application Logs

```bash
# PM2 logs
pm2 logs bmi-ussd

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs
tail -f logs/app.log
```

### Monitor Application Status

```bash
# Check PM2 status
pm2 status

# Check Redis status
sudo systemctl status redis-server

# Check Nginx status
sudo systemctl status nginx
```

## Step 8: Security Considerations

1. **Firewall Configuration**:

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

2. **Environment Variables**:

   - Never commit API keys to version control
   - Use environment variables for sensitive data
   - Regularly rotate API keys

3. **Rate Limiting**:
   - Consider implementing rate limiting for the USSD endpoint
   - Monitor for abuse and implement blocking if necessary

## Troubleshooting

### Common Issues

1. **USSD not responding**:

   - Check if the server is running: `pm2 status`
   - Verify the callback URL in Africa's Talking dashboard
   - Check application logs: `pm2 logs bmi-ussd`

2. **Session issues**:

   - Verify Redis is running: `sudo systemctl status redis-server`
   - Check Redis connection in logs
   - The app falls back to in-memory storage if Redis is unavailable

3. **SSL issues**:
   - Verify SSL certificate: `sudo certbot certificates`
   - Check Nginx configuration: `sudo nginx -t`
   - Ensure port 443 is open in firewall

### Debug Mode

Enable debug logging by setting in `config.env`:

```bash
LOG_LEVEL=debug
NODE_ENV=development
```

## Support

- **Africa's Talking Support**: [support@africastalking.com](mailto:support@africastalking.com)
- **Application Issues**: Check the logs and GitHub issues
- **Server Issues**: Contact your hosting provider

## Cost Optimization

1. **Use a smaller VPS** for development/testing
2. **Implement caching** to reduce Redis usage
3. **Monitor usage** and scale accordingly
4. **Use Africa's Talking sandbox** for testing before going live

## Backup Strategy

1. **Application Code**: Use Git for version control
2. **Configuration**: Backup `config.env` and server configurations
3. **Database**: Redis data is ephemeral, but consider backups if storing important data
4. **Logs**: Implement log rotation to manage disk space
