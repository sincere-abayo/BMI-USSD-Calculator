const redis = require('redis');

class SessionManager {
  constructor() {
    this.client = null;
    this.initRedis();
  }

  async initRedis() {
    try {
      this.client = redis.createClient({
        url: 'redis-cli --tls -u redis://default:a2abe246cf7b46f4be178cbbbc341c27@gusc1-first-seagull-32179.upstash.io:32179'
      });

      this.client.on('error', (err) => {
        // Only log Redis errors once to avoid spam
        if (!this.useInMemoryStorage) {
          console.log('Redis not available, using in-memory storage');
          this.useInMemoryStorage = true;
          this.sessions = new Map();
        }
      });

      this.client.on('connect', () => {
        console.log('Connected to Redis');
      });

      await this.client.connect();
    } catch (error) {
      console.log('Redis connection failed, using in-memory storage');
      // Fallback to in-memory storage if Redis is not available
      this.useInMemoryStorage = true;
      this.sessions = new Map();
    }
  }

  async getSession(sessionId) {
    try {
      if (this.useInMemoryStorage) {
        return this.sessions.get(sessionId) || null;
      }

      const sessionData = await this.client.get(`session:${sessionId}`);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async saveSession(sessionId, sessionData) {
    try {
      if (this.useInMemoryStorage) {
        this.sessions.set(sessionId, sessionData);
        return;
      }

      // Set session with 30 minutes expiry
      await this.client.setEx(`session:${sessionId}`, 1800, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  async deleteSession(sessionId) {
    try {
      if (this.useInMemoryStorage) {
        this.sessions.delete(sessionId);
        return;
      }

      await this.client.del(`session:${sessionId}`);
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }

  async cleanupExpiredSessions() {
    try {
      if (this.useInMemoryStorage) {
        // For in-memory storage, we could implement a simple cleanup
        // but for now, we'll let sessions persist
        return;
      }

      // Redis automatically handles expiration
      console.log('Session cleanup completed');
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
    }
  }
}

module.exports = { SessionManager }; 