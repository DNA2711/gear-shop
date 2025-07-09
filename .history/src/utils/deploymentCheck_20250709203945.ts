// Utility to help debug deployment issues
export function checkDeploymentEnvironment() {
  const checks = {
    isServer: typeof window === 'undefined',
    isClient: typeof window !== 'undefined',
    nodeEnv: process.env.NODE_ENV,
    hasJwtSecret: !!process.env.JWT_SECRET,
    platform: process.platform,
    nodeVersion: process.version,
  };

  return checks;
}

export function logDeploymentInfo() {
  if (typeof window === 'undefined') {
    // Server-side only
    const info = checkDeploymentEnvironment();
    console.log('Deployment Environment Check:', info);
  }
}

// Safe environment variable getter
export function getEnvVar(key: string, fallback?: string): string | undefined {
  try {
    return process.env[key] || fallback;
  } catch (error) {
    console.warn(`Failed to get environment variable ${key}:`, error);
    return fallback;
  }
} 