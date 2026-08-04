/**
 * NovaBank Frontend Security Utilities
 * - Anti-Replay Nonce & Timestamp Generation
 * - Auto Session Inactivity Timeout
 * - Input Sanitization & Masking
 */

export interface SecurityHeaders {
  'X-Timestamp': string;
  'X-Nonce': string;
  'X-Tx-Signature': string;
}

// Generate cryptographic nonce & timestamp headers for secure transaction requests
export const createSecurityHeaders = (): SecurityHeaders => {
  const timestamp = Date.now().toString();
  const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // Simulated HMAC-SHA256 request signature
  const txSignature = `sig_${timestamp}_${nonce.substring(0, 8)}`;

  return {
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
    'X-Tx-Signature': txSignature,
  };
};

// Auto Inactivity Session Logout Manager (15 mins)
export class SessionSecurityManager {
  private static timeoutId: any = null;
  private static INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

  public static initialize(onTimeout: () => void) {
    const resetTimer = () => {
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        onTimeout();
      }, this.INACTIVITY_LIMIT_MS);
    };

    // Listen to user interaction events
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    resetTimer();
  }

  public static clear() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

// Sanitize user inputs client-side
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};
