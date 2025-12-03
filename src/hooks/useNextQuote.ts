import { useLazyQuery } from '@apollo/client';

import { GET_NEXT_QUOTE } from '../graphql/queries';
import { Quote } from '../types';

interface NextQuoteData {
  nextQuote: Quote | null;
}

export function useNextQuote() {
  const [getNextQuote, { loading, error, data }] =
    useLazyQuery<NextQuoteData>(GET_NEXT_QUOTE);

  const fetchNextQuote = (currentQuoteId: number) => {
    return getNextQuote({
      variables: {
        currentQuoteId,
      },
    });
  };

  return {
    fetchNextQuote,
    loading,
    error,
    nextQuote: data?.nextQuote,
  };
}
