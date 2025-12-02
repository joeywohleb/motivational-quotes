import { useQuery } from '@apollo/client';
import { GET_QUOTE_BY_ID } from '../graphql/queries';
import { Quote } from '../types';

interface QuoteByIdData {
  quoteById: Quote | null;
}

export function useQuoteById(quoteId: number | null) {
  const { loading, error, data } = useQuery<QuoteByIdData>(
    GET_QUOTE_BY_ID,
    {
      variables: {
        quoteId,
      },
      skip: !quoteId || isNaN(quoteId),
    }
  );

  return {
    loading,
    error,
    quote: data?.quoteById,
  };
}
