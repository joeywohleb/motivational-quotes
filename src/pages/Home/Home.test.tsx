import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';

import { GET_RANDOM_QUOTE } from '../../graphql/queries';
import { render } from '../../test-utils';
import { Home } from './Home';

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

describe('Home', () => {
  beforeEach(() => {
    jest.useFakeTimers();
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
            query: GET_RANDOM_QUOTE,
          },
          result: {
            data: {
              randomQuote: mockQuote,
            },
          },
          delay: 1000,
        },
      ];

      render(
        <MockedProvider mocks={mocks}>
          <Home />
        </MockedProvider>
      );

      expect(screen.getByText(/loading quotes/i)).toBeInTheDocument();
    });
  });

  describe('Quote Display', () => {
    it('should display a quote after loading', async () => {
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
          <Home />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading quotes/i)).not.toBeInTheDocument();
      });

      expect(screen.getByText(new RegExp(mockQuote.quote, 'i'))).toBeInTheDocument();
    });

    it('should display author name', async () => {
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
          <Home />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(new RegExp(mockQuote.author.name, 'i'))).toBeInTheDocument();
      });
    });
  });

  describe('Random Quote Button', () => {
    it('should display "New Quote" button', async () => {
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
          <Home />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/new quote/i)).toBeInTheDocument();
      });
    });

    it('should refetch quote when button is clicked', async () => {
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

      render(
        <MockedProvider mocks={mocks}>
          <Home />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.queryByText(/loading quotes/i)).not.toBeInTheDocument();
      });

      expect(screen.getByText(new RegExp(mockQuote.quote, 'i'))).toBeInTheDocument();

      const button = screen.getByText(/new quote/i);
      userEvent.click(button);

      // Wait for animation timeout
      jest.advanceTimersByTime(150);

      await waitFor(() => {
        expect(screen.getByText(new RegExp(mockQuote2.quote, 'i'))).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on GraphQL error', async () => {
      const mocks = [
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          error: new Error('GraphQL error'),
        },
      ];

      render(
        <MockedProvider mocks={mocks}>
          <Home />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/error loading quote/i)).toBeInTheDocument();
      });
    });
  });

  describe('No Quotes State', () => {
    it('should display "No quotes available" when randomQuote is null', async () => {
      const mocks = [
        {
          request: {
            query: GET_RANDOM_QUOTE,
          },
          result: {
            data: {
              randomQuote: null,
            },
          },
        },
      ];

      render(
        <MockedProvider mocks={mocks}>
          <Home />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/no quotes available/i)).toBeInTheDocument();
      });
    });
  });
});
