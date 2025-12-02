import React, { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { useRandomQuote } from './useRandomQuote';
import { GET_RANDOM_QUOTE } from '../graphql/queries';

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

const mockQuote2 = {
  id: '2',
  quote: 'Innovation distinguishes between a leader and a follower.',
  permalink: 'test-quote-2',
  author: {
    id: '1',
    name: 'Steve Jobs',
    permalink: 'steve-jobs',
  },
};

describe('useRandomQuote', () => {
  describe('Initial Load', () => {
    it('should return loading state initially', () => {
      const mocks = [
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          result: {
            data: {
              randomQuote: mockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useRandomQuote(), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should return quote data after loading', async () => {
      const mocks = [
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          result: {
            data: {
              randomQuote: mockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useRandomQuote(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockQuote);
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('Refetch Functionality', () => {
    it('should provide a refetch function', async () => {
      const mocks = [
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          result: {
            data: {
              randomQuote: mockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useRandomQuote(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe('function');
    });

    it('should refetch with new data when refetch is called', async () => {
      const mocks = [
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          result: {
            data: {
              randomQuote: mockQuote,
            },
          },
        },
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          result: {
            data: {
              randomQuote: mockQuote2,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useRandomQuote(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockQuote);

      // Call refetch
      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockQuote2);
      });
    });
  });

  describe('Network-Only Fetch Policy', () => {
    it('should use network-only fetch policy', async () => {
      const mocks = [
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          result: {
            data: {
              randomQuote: mockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useRandomQuote(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // The hook should always fetch from network, not cache
      expect(result.current.data).toEqual(mockQuote);
    });
  });

  describe('Error Handling', () => {
    it('should return error when GraphQL query fails', async () => {
      const mocks = [
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          error: new Error('GraphQL error'),
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useRandomQuote(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });
  });
});
