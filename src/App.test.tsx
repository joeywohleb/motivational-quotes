import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from './test-utils';
import App from './App';
import Papa from 'papaparse';

// Mock papaparse
jest.mock('papaparse');

// Mock fetch
global.fetch = jest.fn();

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render QuoteDisplay component', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      text: jest.fn().mockResolvedValueOnce('quote,author,category'),
    });

    (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
      options.complete({
        data: [
          {
            quote: 'Test quote',
            author: 'Test Author',
            category: 'test',
          },
        ],
      });
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading quotes/i)).not.toBeInTheDocument();
    });

    // App should render QuoteDisplay which shows quotes
    expect(screen.getByText(/test quote/i)).toBeInTheDocument();
  });
});
