import { Quote } from '../types';

/**
 * Builds a quote URL from a quote object
 * Format: /{author-permalink}/{quote-slug}
 */
export function buildQuoteUrl(quote: Quote): string {
  return `/${quote.author.permalink}/${quote.permalink}`;
}
