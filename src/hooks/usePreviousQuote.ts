import { useLazyQuery } from '@apollo/client';

import { GET_PREVIOUS_QUOTE } from '../graphql/queries';
import { Quote } from '../types';

interface PreviousQuoteData {
  prevQuote: Quote | null;
}

export function usePreviousQuote() {
  const [getPreviousQuote, { loading, error, data }] =
    useLazyQuery<PreviousQuoteData>(GET_PREVIOUS_QUOTE);

  const fetchPreviousQuote = (currentQuoteId: number) => {
    return getPreviousQuote({
      variables: {
        currentQuoteId,
      },
    });
  };

  return {
    fetchPreviousQuote,
    loading,
    error,
    previousQuote: data?.prevQuote,
  };
}
