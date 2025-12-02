import { Quote } from '../types';

/**
 * Builds a quote URL from a quote object
 * Format: /quote/{id}
 */
export function buildQuoteUrl(quote: Quote): string {
  return `/quote/${quote.id}`;
}
