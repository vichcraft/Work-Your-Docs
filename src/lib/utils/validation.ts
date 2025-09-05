// Environment validation utilities

import { REQUIRED_ENV_VARS } from '../constants';

/**
 * Validates required environment variables
 */
export function validateEnvironmentVariables(requiredVars: readonly string[] = REQUIRED_ENV_VARS): {
  isValid: boolean;
  missing: string[];
  hasPlaceholders: boolean;
} {
  const missing: string[] = [];
  let hasPlaceholders = false;

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      missing.push(varName);
    } else if (value.includes('placeholder')) {
      hasPlaceholders = true;
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    hasPlaceholders,
  };
}
