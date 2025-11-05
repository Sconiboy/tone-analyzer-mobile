import axios from 'axios';
import { API_URL } from '../config';
import type { AnalysisRequest, AnalysisResult } from '../types';

/**
 * API service for communicating with the Tone Analyzer backend
 */
class ToneAnalyzerAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  /**
   * Analyze message tone and get suggested responses
   */
  async analyzeTone(request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      const response = await axios.post(
        `${this.baseURL}/api/trpc/analysis.analyze`,
        {
          json: request,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      // tRPC returns data in result.data format
      if (response.data?.result?.data) {
        return response.data.result.data;
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `Server error: ${error.response.status} - ${error.response.statusText}`
          );
        } else if (error.request) {
          throw new Error(
            'Network error: Unable to reach the server. Please check your internet connection.'
          );
        }
      }
      throw error;
    }
  }

  /**
   * Get analysis history (requires authentication)
   */
  async getHistory(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/trpc/analysis.history`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.result?.data) {
        return response.data.result.data;
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch history:', error);
      return [];
    }
  }
}

export const toneAnalyzerAPI = new ToneAnalyzerAPI();
