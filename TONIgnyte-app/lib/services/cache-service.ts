// lib/services/cache-service.ts
// Mock implementation of caching service
// In a real implementation, this would use Redis or Vercel KV

export class CacheService {
  private static instance: CacheService | null = null;
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  private constructor() {
    // Clean up expired cache entries periodically
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (entry.expiry < now) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Check every minute
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  // Get value from cache
  async get(key: string): Promise<any> {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  // Set value in cache with optional TTL (in seconds)
  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  // Delete value from cache
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  // Clear all cache entries
  async clear(): Promise<void> {
    this.cache.clear();
  }

  // Get cache statistics
  async stats(): Promise<{ size: number; keys: string[] }> {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Specific cache methods for the application

  // Cache user session
  async cacheUserSession(userId: number, sessionData: any, ttlSeconds: number = 3600): Promise<void> {
    const key = `user_session:${userId}`;
    await this.set(key, sessionData, ttlSeconds);
  }

  // Get user session
  async getUserSession(userId: number): Promise<any> {
    const key = `user_session:${userId}`;
    return await this.get(key);
  }

  // Cache merchant configuration
  async cacheMerchantConfig(merchantId: string, config: any, ttlSeconds: number = 1800): Promise<void> {
    const key = `merchant_config:${merchantId}`;
    await this.set(key, config, ttlSeconds);
  }

  // Get merchant configuration
  async getMerchantConfig(merchantId: string): Promise<any> {
    const key = `merchant_config:${merchantId}`;
    return await this.get(key);
  }

  // Cache exchange rates
  async cacheExchangeRates(rates: any, ttlSeconds: number = 300): Promise<void> {
    await this.set('exchange_rates', rates, ttlSeconds);
  }

  // Get exchange rates
  async getExchangeRates(): Promise<any> {
    return await this.get('exchange_rates');
  }

  // Cache loyalty program rules
  async cacheLoyaltyRules(merchantId: string, rules: any, ttlSeconds: number = 3600): Promise<void> {
    const key = `loyalty_rules:${merchantId}`;
    await this.set(key, rules, ttlSeconds);
  }

  // Get loyalty program rules
  async getLoyaltyRules(merchantId: string): Promise<any> {
    const key = `loyalty_rules:${merchantId}`;
    return await this.get(key);
  }
}