import { renderHook, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';

import { useNextQuote } from './useNextQuote';
import { GET_NEXT_QUOTE } from '../graphql/queries';

const mockNextQuote = {
  id: '2',
  quote: 'Innovation distinguishes between a leader and a follower.',
  permalink: 'test-quote-2',
  author: {
    id: '1',
    name: 'Steve Jobs',
    permalink: 'steve-jobs',
  },
};

describe('useNextQuote', () => {
  it('should fetch next quote successfully', async () => {
    const mocks = [
      {
        request: {
          query: GET_NEXT_QUOTE,
          variables: { currentQuoteId: 1 },
        },
        result: {
          data: {
            nextQuote: mockNextQuote,
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useNextQuote(), { wrapper });

    expect(result.current.loading).toBe(false);
    expect(result.current.nextQuote).toBeUndefined();

    act(() => {
      result.current.fetchNextQuote(1);
    });

    await waitFor(() => {
      expect(result.current.nextQuote).toEqual(mockNextQuote);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should handle errors when fetching next quote', async () => {
    const mocks = [
      {
        request: {
          query: GET_NEXT_QUOTE,
          variables: { currentQuoteId: 1 },
        },
        error: new Error('Failed to fetch next quote'),
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useNextQuote(), { wrapper });

    act(() => {
      result.current.fetchNextQuote(1);
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.nextQuote).toBeUndefined();
  });

  it('should handle null response from server', async () => {
    const mocks = [
      {
        request: {
          query: GET_NEXT_QUOTE,
          variables: { currentQuoteId: 999 },
        },
        result: {
          data: {
            nextQuote: null,
          },
        },
      },
    ];

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MockedProvider mocks={mocks}>{children}</MockedProvider>
    );

    const { result } = renderHook(() => useNextQuote(), { wrapper });

    act(() => {
      result.current.fetchNextQuote(999);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.nextQuote).toBeNull();
    expect(result.current.error).toBeUndefined();
  });
});
