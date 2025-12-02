import { useQuery } from '@apollo/client';

import { GET_RANDOM_QUOTE } from '../graphql/queries';
import { Quote } from '../types';

interface RandomQuoteData {
  randomQuote: Quote;
}

export function useRandomQuote() {
  const { loading, error, data, refetch } = useQuery<RandomQuoteData>(
    GET_RANDOM_QUOTE,
    {
      fetchPolicy: 'network-only',
    }
  );

  return {
    loading,
    error,
    data: data?.randomQuote,
    refetch,
  };
}
