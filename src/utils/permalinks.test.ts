import { buildQuoteUrl } from './permalinks';
import { Quote } from '../types';

describe('buildQuoteUrl', () => {
  describe('Valid Quote', () => {
    it('should build correct URL using author and quote permalinks', () => {
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
      expect(url).toBe('/steve-jobs/test-quote');
    });

    it('should build correct URL for a quote with different permalinks', () => {
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
      expect(url).toBe('/author-name/another-quote');
    });

    it('should use permalinks regardless of IDs', () => {
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
      expect(url).toBe('/test-author/test');
    });
  });

  describe('URL Format', () => {
    it('should follow /{author-permalink}/{quote-permalink} format', () => {
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
      expect(url).toMatch(/^\/[^/]+\/[^/]+$/);
      expect(url).toBe('/author/test');
    });

    it('should use permalinks, not IDs or raw text', () => {
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
      expect(url).toBe(
        '/author-with-special-chars/this-is-a-test-quote-with-special-chars'
      );
      expect(url).not.toContain('123');
      expect(url).not.toContain('456');
      expect(url).not.toContain('!@#$%');
    });

    it('should include both author and quote permalinks', () => {
      const quote: Quote = {
        id: '1',
        quote: 'Test',
        permalink: 'my-quote',
        author: {
          id: '1',
          name: 'Author',
          permalink: 'my-author',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toContain('my-author');
      expect(url).toContain('my-quote');
      expect(url.split('/').length).toBe(3); // Empty string, author, quote
    });
  });

  describe('Edge Cases', () => {
    it('should handle short permalinks', () => {
      const quote: Quote = {
        id: '1',
        quote: 'Test',
        permalink: 'a',
        author: {
          id: '1',
          name: 'Author',
          permalink: 'b',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe('/b/a');
    });

    it('should handle long permalinks', () => {
      const quote: Quote = {
        id: '999999999',
        quote: 'Test',
        permalink: 'this-is-a-very-long-quote-permalink-with-many-words',
        author: {
          id: '1',
          name: 'Author',
          permalink: 'this-is-a-very-long-author-permalink',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe(
        '/this-is-a-very-long-author-permalink/this-is-a-very-long-quote-permalink-with-many-words'
      );
    });

    it('should handle permalinks with hyphens', () => {
      const quote: Quote = {
        id: '1',
        quote: 'Test',
        permalink: 'quote-with-many-hyphens',
        author: {
          id: '1',
          name: 'Author',
          permalink: 'author-name-with-hyphens',
        },
      };

      const url = buildQuoteUrl(quote);
      expect(url).toBe('/author-name-with-hyphens/quote-with-many-hyphens');
    });
  });
});
