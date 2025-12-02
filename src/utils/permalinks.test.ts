import { buildQuoteUrl } from './permalinks';
import { Quote } from '../types';

describe('buildQuoteUrl', () => {
  describe('Valid Quote', () => {
    it('should build correct URL for a quote', () => {
      const quote: Quote = {
        id: '1',
        quote: 'The only way to do great work is to love what you do.',
        permalink: 'test-quote',
        author: {
          id: '1',
          name: 'Steve Jobs',
          permalink: 'steve-jobs',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe('/quote/1');
    });

    it('should build correct URL for a quote with different ID', () => {
      const quote: Quote = {
        id: '42',
        quote: 'Another quote',
        permalink: 'another-quote',
        author: {
          id: '2',
          name: 'Author Name',
          permalink: 'author-name',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe('/quote/42');
    });

    it('should handle numeric string IDs', () => {
      const quote: Quote = {
        id: '999',
        quote: 'Test quote',
        permalink: 'test',
        author: {
          id: '3',
          name: 'Test Author',
          permalink: 'test-author',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe('/quote/999');
    });
  });

  describe('URL Format', () => {
    it('should start with /quote/', () => {
      const quote: Quote = {
        id: '1',
        quote: 'Test',
        permalink: 'test',
        author: {
          id: '1',
          name: 'Author',
          permalink: 'author',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toMatch(/^\/quote\//);
    });

    it('should only use quote ID in URL', () => {
      const quote: Quote = {
        id: '123',
        quote: 'This is a test quote with special chars!@#$%',
        permalink: 'this-is-a-test-quote-with-special-chars',
        author: {
          id: '456',
          name: 'Author With Special Chars!@#',
          permalink: 'author-with-special-chars',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe('/quote/123');
      expect(url).not.toContain('this-is-a-test-quote');
      expect(url).not.toContain('author');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single digit IDs', () => {
      const quote: Quote = {
        id: '1',
        quote: 'Test',
        permalink: 'test',
        author: {
          id: '1',
          name: 'Author',
          permalink: 'author',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe('/quote/1');
    });

    it('should handle large numeric IDs', () => {
      const quote: Quote = {
        id: '999999999',
        quote: 'Test',
        permalink: 'test',
        author: {
          id: '1',
          name: 'Author',
          permalink: 'author',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe('/quote/999999999');
    });
  });
});
