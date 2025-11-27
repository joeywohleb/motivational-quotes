import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from './test-utils';
import App from './App';
import { MockedProvider } from '@apollo/client/testing';
import { GET_RANDOM_QUOTE } from './graphql/queries';

const mocks = [
  {
    request: {
      query: GET_RANDOM_QUOTE,
    },
    result: {
      data: {
        randomQuote: {
          id: '1',
          quote: 'Test quote',
          permalink: 'test-quote',
          author: {
            id: '1',
            name: 'Test Author',
            permalink: 'test-author',
          },
        },
      },
    },
  },
];

describe('App', () => {
  it('should render QuoteDisplay component', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <App />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading quotes/i)).not.toBeInTheDocument();
    });

    // App should render QuoteDisplay which shows quotes
    expect(screen.getByText(/test quote/i)).toBeInTheDocument();
  });
});
