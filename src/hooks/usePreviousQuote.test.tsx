import { renderHook, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';

import { usePreviousQuote } from './usePreviousQuote';
import { GET_PREVIOUS_QUOTE } from '../graphql/queries';

const mockPreviousQuote = {
  id: '1',
  quote: 'The only way to do great work is to love what you do.',
  permalink: 'test-quote-1',
  author: {
    id: '1',
    name: 'Steve Jobs',
    permalink: 'steve-jobs',
  },
};

describe('usePreviousQuote', () => {
  it('should fetch previous quote successfully', async () => {
    const mocks = [
      {
        request: {
          query: GET_PREVIOUS_QUOTE,
          variables: { currentQuoteId: 2 },
        },
        result: {
          data: {
            prevQuote: mockPreviousQuote,
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => usePreviousQuote(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.previousQuote).toBeUndefined();

    act(() => {
      result.current.fetchPreviousQuote(2);
    });

    await waitFor(() => {
      expect(result.current.previousQuote).toEqual(mockPreviousQuote);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle errors when fetching previous quote', async () => {
    const mocks = [
      {
        request: {
          query: GET_PREVIOUS_QUOTE,
          variables: { currentQuoteId: 2 },
        },
        error: new Error('Failed to fetch previous quote'),
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => usePreviousQuote(), { wrapper });

    act(() => {
      result.current.fetchPreviousQuote(2);
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.previousQuote).toBeUndefined();
  });

  it('should handle null response from server', async () => {
    const mocks = [
      {
        request: {
          query: GET_PREVIOUS_QUOTE,
          variables: { currentQuoteId: 1 },
        },
        result: {
          data: {
            prevQuote: null,
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => usePreviousQuote(), { wrapper });

    act(() => {
      result.current.fetchPreviousQuote(1);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.previousQuote).toBeNull();
    expect(result.current.error).toBeUndefined();
  });
});
