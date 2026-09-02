import { LinkedInProfile, PortfolioConfigOverride } from '../types';
import { configOverride } from '../config/portfolioConfig';

/**
 * Returns the centralized portfolio configuration override.
 */
export function getPortfolioConfigOverride(): PortfolioConfigOverride {
  return configOverride;
}

export type { LinkedInProfile };
