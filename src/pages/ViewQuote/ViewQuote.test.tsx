import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';

import { ViewQuote } from './ViewQuote';
import {
  GET_QUOTE_BY_PERMALINK,
  GET_RANDOM_QUOTE,
  GET_NEXT_QUOTE,
  GET_PREVIOUS_QUOTE,
} from '../../graphql/queries';
import { render } from '../../test-utils';

// Import the mocked module
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
    // Set default params for permalink-based routing
    Object.assign(mockParams, {
      authorPermalink: 'steve-jobs',
      quotePermalink: 'test-quote',
    });
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
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
          },
          result: {
            data: {
              quoteByPermalink: mockQuote,
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
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
          },
          result: {
            data: {
              quoteByPermalink: mockQuote,
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

      expect(
        screen.getByText(new RegExp(mockQuote.quote, 'i'))
      ).toBeInTheDocument();
    });

    it('should display author name', async () => {
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
        expect(
          screen.getByText(new RegExp(mockQuote.author.name, 'i'))
        ).toBeInTheDocument();
      });
    });
  });

  describe('New Quote Button', () => {
    it('should display "New Quote" button', async () => {
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
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
          },
          result: {
            data: {
              quoteByPermalink: mockQuote,
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
        expect(mockNavigate).toHaveBeenCalledWith('/steve-jobs/test-quote-2', {
          replace: false,
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on GraphQL error', async () => {
      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
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
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'steve-jobs', permalink: 'test-quote' },
          },
          result: {
            data: {
              quoteByPermalink: null,
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
        expect(mockNavigate).toHaveBeenCalledWith('/not-found', {
          replace: true,
        });
      });
    });
  });

  describe('Invalid Permalinks', () => {
    it('should handle invalid permalinks gracefully', async () => {
      // Mock invalid permalinks
      Object.assign(mockParams, {
        authorPermalink: 'invalid-author',
        quotePermalink: 'invalid-quote',
      });

      const mocks = [
        {
          request: {
            query: GET_QUOTE_BY_PERMALINK,
            variables: { author: 'invalid-author', permalink: 'invalid-quote' },
          },
          result: {
            data: {
              quoteByPermalink: null,
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

      // Should redirect to not-found when quote is not found
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/not-found', {
          replace: true,
        });
      });

      // Reset mockParams
      Object.assign(mockParams, {
        authorPermalink: 'steve-jobs',
        quotePermalink: 'test-quote',
      });
    });
  });

  describe('Next Quote Button', () => {
    it('should display "Next" button', async () => {
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
        expect(screen.getByText(/^next$/i)).toBeInTheDocument();
      });
    });

    it('should call fetchNextQuote and navigate when Next button is clicked', async () => {
      const mockQuote3 = {
        id: '3',
        quote: 'Stay hungry, stay foolish.',
        permalink: 'test-quote-3',
        author: {
          id: '1',
          name: 'Steve Jobs',
          permalink: 'steve-jobs',
        },
      };

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
            query: GET_NEXT_QUOTE,
            variables: { currentQuoteId: 1 },
          },
          result: {
            data: {
              nextQuote: mockQuote3,
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

      const button = screen.getByText(/^next$/i);
      userEvent.click(button);

      // Wait for animation timeout
      jest.advanceTimersByTime(150);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/steve-jobs/test-quote-3', {
          replace: false,
        });
      });
    });
  });

  describe('Previous Quote Button', () => {
    it('should display "Previous" button', async () => {
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
        expect(screen.getByText(/previous/i)).toBeInTheDocument();
      });
    });

    it('should call fetchPreviousQuote and navigate when Previous button is clicked', async () => {
      const mockQuote0 = {
        id: '0',
        quote: 'Your time is limited.',
        permalink: 'test-quote-0',
        author: {
          id: '1',
          name: 'Steve Jobs',
          permalink: 'steve-jobs',
        },
      };

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
            query: GET_PREVIOUS_QUOTE,
            variables: { currentQuoteId: 1 },
          },
          result: {
            data: {
              prevQuote: mockQuote0,
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

      const button = screen.getByText(/previous/i);
      userEvent.click(button);

      // Wait for animation timeout
      jest.advanceTimersByTime(150);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/steve-jobs/test-quote-0', {
          replace: false,
        });
      });
    });
  });
});
