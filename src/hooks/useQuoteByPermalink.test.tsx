import React, { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { useQuoteByPermalink } from './useQuoteByPermalink';
import { GET_QUOTE_BY_PERMALINK } from '../graphql/queries';

const mockQuote = {
  id: '1',
  quote: 'The only way to do great work is to love what you do.',
  permalink: 'test-quote',
  author: {
    id: '1',
    name: 'Steve Jobs',
    permalink: 'steve-jobs',
  },
};

describe('useQuoteByPermalink', () => {
  describe('Valid Permalinks', () => {
    it('should return loading state initially', () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
          },
          result: {
            data: {
              quoteByPermalink: mockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink('steve-jobs', 'test-quote'),
        { wrapper }
      );

      expect(result.current.loading).toBe(true);
      expect(result.current.quote).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should return quote data after loading', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
          },
          result: {
            data: {
              quoteByPermalink: mockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink('steve-jobs', 'test-quote'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.quote).toEqual(mockQuote);
      expect(result.current.error).toBeUndefined();
    });

    it('should fetch quote with different permalinks', async () => {
      const anotherMockQuote = {
        id: '2',
        quote: 'Another quote',
        permalink: 'another-quote',
        author: {
          id: '2',
          name: 'Author Name',
          permalink: 'author-name',
        },
      };

      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'author-name', permalink: 'another-quote' },
          },
          result: {
            data: {
              quoteByPermalink: anotherMockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink('author-name', 'another-quote'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.quote).toEqual(anotherMockQuote);
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('Missing Permalinks', () => {
    it('should skip query when author permalink is undefined', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={[]}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink(undefined, 'test-quote'),
        { wrapper }
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.quote).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should skip query when quote permalink is undefined', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={[]}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink('steve-jobs', undefined),
        { wrapper }
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.quote).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should skip query when both permalinks are undefined', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={[]}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink(undefined, undefined),
        { wrapper }
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.quote).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should return error when GraphQL query fails', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
          },
          error: new Error('GraphQL error'),
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink('steve-jobs', 'test-quote'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.quote).toBeUndefined();
    });

    it('should handle network errors', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
          },
          error: new Error('Network error'),
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink('steve-jobs', 'test-quote'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.quote).toBeUndefined();
    });
  });

  describe('Quote Not Found', () => {
    it('should return null when quote is not found', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: {
              author: 'nonexistent-author',
              permalink: 'nonexistent-quote',
            },
          },
          result: {
            data: {
              quoteByPermalink: null,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink('nonexistent-author', 'nonexistent-quote'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.quote).toBeNull();
      expect(result.current.error).toBeUndefined();
    });

    it('should return null when author exists but quote does not', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: {
              author: 'steve-jobs',
              permalink: 'nonexistent-quote',
            },
          },
          result: {
            data: {
              quoteByPermalink: null,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () => useQuoteByPermalink('steve-jobs', 'nonexistent-quote'),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.quote).toBeNull();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle permalinks with special characters', async () => {
      const specialQuote = {
        id: '3',
        quote: 'Quote with special chars',
        permalink: 'quote-with-special-chars',
        author: {
          id: '3',
          name: 'Author',
          permalink: 'author-with-special-chars',
        },
      };

      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: {
              author: 'author-with-special-chars',
              permalink: 'quote-with-special-chars',
            },
          },
          result: {
            data: {
              quoteByPermalink: specialQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () =>
          useQuoteByPermalink(
            'author-with-special-chars',
            'quote-with-special-chars'
          ),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.quote).toEqual(specialQuote);
      expect(result.current.error).toBeUndefined();
    });

    it('should handle very long permalinks', async () => {
      const longQuote = {
        id: '4',
        quote: 'Long quote',
        permalink: 'this-is-a-very-long-quote-permalink-with-many-words',
        author: {
          id: '4',
          name: 'Author',
          permalink: 'this-is-a-very-long-author-permalink',
        },
      };

      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: {
              author: 'this-is-a-very-long-author-permalink',
              permalink: 'this-is-a-very-long-quote-permalink-with-many-words',
            },
          },
          result: {
            data: {
              quoteByPermalink: longQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(
        () =>
          useQuoteByPermalink(
            'this-is-a-very-long-author-permalink',
            'this-is-a-very-long-quote-permalink-with-many-words'
          ),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.quote).toEqual(longQuote);
      expect(result.current.error).toBeUndefined();
    });
  });
});
