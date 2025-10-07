// Password Strength Analysis
export function analyzePasswordStrength(password: string) {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
  } else {
    suggestions.push("Use at least 12 characters for better security");
  }

  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    suggestions.push("Add lowercase letters");
  }

  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    suggestions.push("Add uppercase letters");
  }

  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    suggestions.push("Add numbers");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 20;
  } else {
    suggestions.push("Add special characters (!@#$%^&*)");
  }

  if (password.length >= 16) {
    score += 10;
  }

  let strength: 'weak' | 'medium' | 'strong';
  if (score >= 70) {
    strength = 'strong';
  } else if (score >= 40) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }

  if (strength === 'strong') {
    suggestions.push("Excellent! Your password is strong");
  }

  return { strength, score, suggestions };
}

// URL Phishing Detection
export function analyzeUrl(url: string) {
  const threats: string[] = [];
  let riskLevel = 0;

  try {
    const urlObj = new URL(url);
    
    if (urlObj.protocol !== 'https:') {
      threats.push("Not using secure HTTPS protocol");
      riskLevel += 30;
    }

    const suspiciousPatterns = [
      { pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, message: "Uses IP address instead of domain" },
      { pattern: /(login|verify|account|secure|update).*\.(com|net|org)/i, message: "Contains suspicious login-related keywords" },
      { pattern: /[a-z0-9]{20,}/i, message: "Contains unusually long random strings" },
      { pattern: /@/, message: "Contains @ symbol (possible phishing technique)" },
      { pattern: /-/g, message: "Multiple hyphens in domain (common in phishing)" }
    ];

    suspiciousPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(url)) {
        threats.push(message);
        riskLevel += 15;
      }
    });

    const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 't.co'];
    if (shorteners.some(shortener => urlObj.hostname.includes(shortener))) {
      threats.push("URL shortener detected (can hide real destination)");
      riskLevel += 20;
    }

    const phishingKeywords = ['paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook', 'bank'];
    const hasSuspiciousDomain = phishingKeywords.some(keyword => {
      return urlObj.hostname.includes(keyword) && !urlObj.hostname.endsWith(`${keyword}.com`);
    });

    if (hasSuspiciousDomain) {
      threats.push("Domain name mimics legitimate service");
      riskLevel += 40;
    }

    let isSafe: 'safe' | 'suspicious' | 'dangerous';
    if (riskLevel >= 50) {
      isSafe = 'dangerous';
    } else if (riskLevel >= 20) {
      isSafe = 'suspicious';
    } else {
      isSafe = 'safe';
      threats.push("URL appears to be safe");
    }

    return { isSafe, riskLevel, threats };
  } catch (error) {
    return {
      isSafe: 'dangerous' as const,
      riskLevel: 100,
      threats: ["Invalid URL format"]
    };
  }
}

// Email Threat Analysis
export function analyzeEmail(content: string) {
  const threats: string[] = [];
  let riskScore = 0;

  const urgentKeywords = [
    'urgent', 'immediate action', 'verify now', 'account locked', 'suspended',
    'act now', 'limited time', 'expire', 'confirm your', 'unusual activity',
    'verify your account', 'click here immediately', 'security alert'
  ];

  urgentKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword)) {
      threats.push(`Contains urgent/pressure language: "${keyword}"`);
      riskScore += 15;
    }
  });

  const genericGreetings = ['dear customer', 'dear user', 'dear member', 'valued customer'];
  genericGreetings.forEach(greeting => {
    if (content.toLowerCase().includes(greeting)) {
      threats.push("Uses generic greeting instead of your name");
      riskScore += 10;
    }
  });

  const sensitiveRequests = [
    'password', 'credit card', 'ssn', 'social security', 'bank account',
    'pin', 'verification code', 'cvv', 'account number'
  ];

  sensitiveRequests.forEach(request => {
    if (content.toLowerCase().includes(request)) {
      threats.push(`Requests sensitive information: "${request}"`);
      riskScore += 20;
    }
  });

  const linkPattern = /https?:\/\/[^\s]+/gi;
  const links = content.match(linkPattern) || [];
  
  if (links.length > 3) {
    threats.push(`Contains multiple links (${links.length})`);
    riskScore += 15;
  }

  links.forEach(link => {
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(link)) {
      threats.push("Link uses IP address instead of domain name");
      riskScore += 25;
    }
  });

  const commonMisspellings = ['recieve', 'occured', 'untill', 'seperate', 'definately'];
  commonMisspellings.forEach(word => {
    if (content.toLowerCase().includes(word)) {
      threats.push("Contains spelling errors (common in phishing)");
      riskScore += 10;
    }
  });

  const threatWords = ['legal action', 'will be closed', 'will be terminated', 'face charges'];
  threatWords.forEach(threat => {
    if (content.toLowerCase().includes(threat)) {
      threats.push(`Contains threatening language: "${threat}"`);
      riskScore += 15;
    }
  });

  let riskLevel: 'low' | 'medium' | 'high';
  if (riskScore >= 50) {
    riskLevel = 'high';
  } else if (riskScore >= 25) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'low';
    if (threats.length === 0) {
      threats.push("No obvious phishing indicators detected");
    }
  }

  return { riskScore: Math.min(riskScore, 100), riskLevel, detectedThreats: threats };
}
