/**
 * Configuration for Tone Analyzer Mobile App
 */

// Update this with your deployed backend URL
// Example: 'https://3000-idyibqdcc7gl887ui0j20-340f28a4.manusvm.computer'
// or your production domain: 'https://your-domain.manus.space'
export const API_URL = 'https://3000-idyibqdcc7gl887ui0j20-340f28a4.manusvm.computer';

export const API_ENDPOINTS = {
  analyze: `${API_URL}/api/trpc/analysis.analyze`,
  history: `${API_URL}/api/trpc/analysis.history`,
};

export const APP_CONFIG = {
  name: 'Tone Analyzer',
  version: '1.0.0',
  supportEmail: 'support@toneanalyzer.app',
};
