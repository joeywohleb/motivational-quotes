import React from 'react';
import { screen } from '@testing-library/react';

import { QuoteDisplay } from './QuoteDisplay';
import { render } from '../../test-utils';

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

describe('QuoteDisplay', () => {
  it('should display the quote text', () => {
    render(<QuoteDisplay quote={mockQuote} />);

    expect(screen.getByText(new RegExp(mockQuote.quote, 'i'))).toBeInTheDocument();
  });

  it('should display the author name', () => {
    render(<QuoteDisplay quote={mockQuote} />);

    expect(screen.getByText(new RegExp(mockQuote.author.name, 'i'))).toBeInTheDocument();
  });
});
