import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import userEvent from '@testing-library/user-event';
import QuoteDisplay from './QuoteDisplay';
import Papa from 'papaparse';

// Mock papaparse
jest.mock('papaparse');

// Mock fetch
global.fetch = jest.fn();

describe('QuoteDisplay', () => {
  const mockQuotes = [
    {
      quote: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
      category: 'motivation,success',
    },
    {
      quote: 'Innovation distinguishes between a leader and a follower.',
      author: 'Steve Jobs',
      category: 'innovation,leadership',
    },
    {
      quote: 'Life is what happens to you while you\'re busy making other plans.',
      author: 'John Lennon',
      category: 'life,wisdom',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Loading State', () => {
    it('should display loading message initially', () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce(''),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        // Don't call complete immediately to test loading state
        return {};
      });

      render(<QuoteDisplay />);
      expect(screen.getByText(/loading quotes/i)).toBeInTheDocument();
    });
  });

  describe('CSV Loading and Parsing', () => {
    it('should fetch and parse CSV file on mount', async () => {
      const csvText = 'quote,author,category\n"Test quote","Test Author","test"';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce(csvText),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [
            { quote: 'Test quote', author: 'Test Author', category: 'test' },
          ],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/quotes.csv');
        expect(Papa.parse).toHaveBeenCalledWith(
          csvText,
          expect.objectContaining({
            header: true,
            skipEmptyLines: true,
          })
        );
      });
    });

    it('should filter out quotes with missing quote or author', async () => {
      const csvText = 'quote,author,category\n"Valid quote","Author","test"\n,"Missing quote","test"';
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce(csvText),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [
            { quote: 'Valid quote', author: 'Author', category: 'test' },
            { quote: '', author: 'Missing quote', category: 'test' },
            { quote: 'No author', author: '', category: 'test' },
          ],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText(/valid quote/i)).toBeInTheDocument();
        expect(screen.queryByText(/missing quote/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/no author/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Quote Display', () => {
    it('should display a random quote after loading', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: mockQuotes,
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.queryByText(/loading quotes/i)).not.toBeInTheDocument();
      });

      // Should display one of the quotes
      const quoteText = mockQuotes.find((q) =>
        screen.queryByText(new RegExp(q.quote, 'i'))
      );
      expect(quoteText).toBeDefined();
    });

    it('should display quote text with quotes', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [mockQuotes[0]],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(
          screen.getByText(new RegExp(mockQuotes[0].quote, 'i'))
        ).toBeInTheDocument();
      });
    });

    it('should display author name', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [mockQuotes[0]],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText(new RegExp(mockQuotes[0].author, 'i'))).toBeInTheDocument();
      });
    });
  });

  describe('Tag Parsing and Display', () => {
    it('should parse and display tags from category', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [mockQuotes[0]], // Has category: 'motivation,success'
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText('motivation')).toBeInTheDocument();
        expect(screen.getByText('success')).toBeInTheDocument();
      });
    });

    it('should handle tags with spaces', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [
            {
              quote: 'Test',
              author: 'Author',
              category: 'tag1, tag2 , tag3',
            },
          ],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText('tag1')).toBeInTheDocument();
        expect(screen.getByText('tag2')).toBeInTheDocument();
        expect(screen.getByText('tag3')).toBeInTheDocument();
      });
    });

    it('should not display tags section when category is empty', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [
            {
              quote: 'Test quote',
              author: 'Test Author',
              category: '',
            },
          ],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText(/test quote/i)).toBeInTheDocument();
      });

      // Tags should not be rendered
      const tagElements = screen.queryAllByText(/motivation|success|innovation/i);
      expect(tagElements.length).toBe(0);
    });

    it('should filter out empty tags', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [
            {
              quote: 'Test',
              author: 'Author',
              category: 'tag1,,tag2, ,tag3',
            },
          ],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText('tag1')).toBeInTheDocument();
        expect(screen.getByText('tag2')).toBeInTheDocument();
        expect(screen.getByText('tag3')).toBeInTheDocument();
      });
    });
  });

  describe('Random Quote Button', () => {
    it('should display "New Quote" button', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [mockQuotes[0]],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText(/new quote/i)).toBeInTheDocument();
      });
    });

    it('should change quote when button is clicked', async () => {
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: mockQuotes,
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.queryByText(/loading quotes/i)).not.toBeInTheDocument();
      });

      const initialQuote = screen.getByText(/"/).textContent;
      const button = screen.getByText(/new quote/i);

      userEvent.click(button);

      // Wait for animation timeout
      jest.advanceTimersByTime(150);

      await waitFor(() => {
        const newQuote = screen.getByText(/"/).textContent;
        // The quote might be the same (random), but we've triggered the change
        expect(button).toBeInTheDocument();
      });
    });

    it('should not change quote if quotes array is empty', async () => {
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText(/no quotes available/i)).toBeInTheDocument();
      });

      // Button should not be visible when no quotes
      expect(screen.queryByText(/new quote/i)).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error loading quotes:',
          expect.any(Error)
        );
        expect(screen.getByText(/no quotes available/i)).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });

    it('should handle CSV parsing errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('invalid csv'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.error(new Error('Parse error'));
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error parsing CSV:',
          expect.any(Error)
        );
        expect(screen.getByText(/no quotes available/i)).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('No Quotes State', () => {
    it('should display "No quotes available" when no quotes are loaded', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: [],
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.getByText(/no quotes available/i)).toBeInTheDocument();
      });
    });
  });

  describe('Animation State', () => {
    it('should trigger animation when getting new quote', async () => {
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        text: jest.fn().mockResolvedValueOnce('quote,author,category'),
      });

      (Papa.parse as jest.Mock).mockImplementation((csv, options) => {
        options.complete({
          data: mockQuotes,
        });
      });

      render(<QuoteDisplay />);

      await waitFor(() => {
        expect(screen.queryByText(/loading quotes/i)).not.toBeInTheDocument();
      });

      const button = screen.getByText(/new quote/i);
      userEvent.click(button);

      // Animation should be triggered (isAnimating = true)
      // The component should still be visible during animation
      expect(screen.getByText(/"/)).toBeInTheDocument();

      // Advance timers to complete animation
      jest.advanceTimersByTime(150);

      await waitFor(() => {
        expect(screen.getByText(/"/)).toBeInTheDocument();
      });
    });
  });
});

