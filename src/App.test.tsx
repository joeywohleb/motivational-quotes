import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from './test-utils';
import App from './App';
import { MockedProvider } from '@apollo/client/testing';
import { GET_RANDOM_QUOTE } from './graphql/queries';

const mockQuote = {
  id: '1',
  quote: 'Test quote',
  permalink: 'test-quote',
  author: {
    id: '1',
    name: 'Test Author',
    permalink: 'test-author',
  },
};

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

describe('App', () => {
  it('should render Header and QuoteDisplay components', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <App />
      </MockedProvider>
    );

    // Wait for Header to render
    await waitFor(() => {
      expect(screen.getByText('A Motivational Quote')).toBeInTheDocument();
    });

    // Verify navigation links from Header are present
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Random').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Browse').length).toBeGreaterThan(0);
  });
});
