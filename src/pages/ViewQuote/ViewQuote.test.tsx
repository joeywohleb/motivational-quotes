import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';

import { ViewQuote } from './ViewQuote';
import { GET_QUOTE_BY_ID, GET_RANDOM_QUOTE } from '../../graphql/queries';
import { render } from '../../test-utils';

// Import the mocked module
const routerDom = require('react-router-dom');
const { mockNavigate, mockParams } = routerDom;

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

// Mock the module
jest.mock('react-router-dom');

describe('ViewQuote', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Loading State', () => {
    it('should display loading message initially', () => {
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
          delay: 1000,
        },
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

      render(
        <MockedProvider mocks={mocks}>
          <ViewQuote />
        </MockedProvider>
      );

      expect(screen.getByText(/loading quote/i)).toBeInTheDocument();
    });
  });

  describe('Quote Display', () => {
    it('should display a quote after loading', async () => {
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

      render(
        <MockedProvider mocks={mocks}>
          <ViewQuote />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading quote/i)).not.toBeInTheDocument();
      });

      expect(screen.getByText(new RegExp(mockQuote.quote, 'i'))).toBeInTheDocument();
    });

    it('should display author name', async () => {
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

      render(
        <MockedProvider mocks={mocks}>
          <ViewQuote />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(new RegExp(mockQuote.author.name, 'i'))).toBeInTheDocument();
      });
    });
  });

  describe('New Quote Button', () => {
    it('should display "New Quote" button', async () => {
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

      render(
        <MockedProvider mocks={mocks}>
          <ViewQuote />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/new quote/i)).toBeInTheDocument();
      });
    });

    it('should call refetch and navigate when button is clicked', async () => {
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

      render(
        <MockedProvider mocks={mocks}>
          <ViewQuote />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading quote/i)).not.toBeInTheDocument();
      });

      const button = screen.getByText(/new quote/i);
      userEvent.click(button);

      // Wait for animation timeout
      jest.advanceTimersByTime(150);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/quote/2', { replace: false });
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on GraphQL error', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_ID,
            variables: { quoteId: 1 },
          },
          error: new Error('GraphQL error'),
        },
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

      render(
        <MockedProvider mocks={mocks}>
          <ViewQuote />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/error loading quote/i)).toBeInTheDocument();
      });
    });
  });

  describe('Quote Not Found', () => {
    it('should redirect to not-found when quote is null', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_ID,
            variables: { quoteId: 1 },
          },
          result: {
            data: {
              quoteById: null,
            },
          },
        },
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

      render(
        <MockedProvider mocks={mocks}>
          <ViewQuote />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/not-found', { replace: true });
      });
    });
  });

  describe('Invalid Quote ID', () => {
    it('should handle invalid quote ID gracefully', async () => {
      // Mock invalid ID
      Object.assign(mockParams, { id: 'invalid' });

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

      render(
        <MockedProvider mocks={mocks}>
          <ViewQuote />
        </MockedProvider>
      );

      // Should not crash, and should handle the invalid ID
      await waitFor(() => {
        expect(screen.queryByText(/loading quote/i)).not.toBeInTheDocument();
      });

      // Reset mockParams
      Object.assign(mockParams, { id: '1' });
    });
  });
});
