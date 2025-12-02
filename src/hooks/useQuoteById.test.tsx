import React, { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import { useQuoteById } from './useQuoteById';
import { GET_QUOTE_BY_ID } from '../graphql/queries';

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

describe('useQuoteById', () => {
  describe('Valid Quote ID', () => {
    it('should return loading state initially', () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_ID,
            variables: { quoteId: 1 },
          },
          result: {
            data: {
              quoteById: mockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useQuoteById(1), { wrapper });

      expect(result.current.loading).toBe(true);
      expect(result.current.quote).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });

    it('should return quote data after loading', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_ID,
            variables: { quoteId: 1 },
          },
          result: {
            data: {
              quoteById: mockQuote,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useQuoteById(1), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.quote).toEqual(mockQuote);
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('Null Quote ID', () => {
    it('should skip query when quoteId is null', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={[]}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useQuoteById(null), { wrapper });

      expect(result.current.loading).toBe(false);
      expect(result.current.quote).toBeUndefined();
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('Invalid Quote ID', () => {
    it('should skip query when quoteId is NaN', () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={[]}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useQuoteById(NaN), { wrapper });

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
            query: GET_QUOTE_BY_ID,
            variables: { quoteId: 1 },
          },
          error: new Error('GraphQL error'),
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useQuoteById(1), { wrapper });

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
            query: GET_QUOTE_BY_ID,
            variables: { quoteId: 999 },
          },
          result: {
            data: {
              quoteById: null,
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      );

      const { result } = renderHook(() => useQuoteById(999), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.quote).toBeNull();
      expect(result.current.error).toBeUndefined();
    });
  });
});
