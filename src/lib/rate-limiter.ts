interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerDay: number;
}

class RateLimiter {
  private requests: number[] = []; // timestamps
  private dailyRequests: { date: string; count: number } | null = null;

  constructor(private config: RateLimitConfig) {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gemini-rate-limit');
      if (saved) {
        const data = JSON.parse(saved);
        this.dailyRequests = data.dailyRequests;
      }
    }
  }

  canMakeRequest(): { allowed: boolean; reason?: string } {
    const now = Date.now();
    const today = new Date().toDateString();

    // Check daily limit
    if (this.dailyRequests?.date === today) {
      if (this.dailyRequests.count >= this.config.maxRequestsPerDay) {
        return {
          allowed: false,
          reason: `Daily limit reached (${this.config.maxRequestsPerDay} requests/day). Try again tomorrow.`
        };
      }
    } else {
      // Reset daily counter
      this.dailyRequests = { date: today, count: 0 };
    }

    // Check per-minute limit
    const oneMinuteAgo = now - 60 * 1000;
    this.requests = this.requests.filter(timestamp => timestamp > oneMinuteAgo);

    if (this.requests.length >= this.config.maxRequestsPerMinute) {
      return {
        allowed: false,
        reason: `Rate limit exceeded. Please wait a minute. (${this.config.maxRequestsPerMinute} requests/min max)`
      };
    }

    return { allowed: true };
  }

  recordRequest() {
    const now = Date.now();
    const today = new Date().toDateString();

    // Record timestamp
    this.requests.push(now);

    // Update daily count
    if (this.dailyRequests?.date === today) {
      this.dailyRequests.count++;
    } else {
      this.dailyRequests = { date: today, count: 1 };
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini-rate-limit', JSON.stringify({
        dailyRequests: this.dailyRequests
      }));
    }
  }

  getRemainingRequests(): { perMinute: number; perDay: number } {
    const now = Date.now();
    const today = new Date().toDateString();
    const oneMinuteAgo = now - 60 * 1000;

    const recentRequests = this.requests.filter(t => t > oneMinuteAgo).length;
    const dailyCount = this.dailyRequests?.date === today ? this.dailyRequests.count : 0;

    return {
      perMinute: Math.max(0, this.config.maxRequestsPerMinute - recentRequests),
      perDay: Math.max(0, this.config.maxRequestsPerDay - dailyCount)
    };
  }
}

// Gemini Free Tier limits (안전하게 설정)
export const geminiRateLimiter = new RateLimiter({
  maxRequestsPerMinute: 10, // 실제는 15지만 안전하게
  maxRequestsPerDay: 1000   // 실제는 1500이지만 안전하게
});
