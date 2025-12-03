import { useQuery } from '@apollo/client';
import { GET_QUOTE_BY_PERMALINK } from '../graphql/queries';
import { Quote } from '../types';

interface QuoteBySlugData {
  quoteByPermalink: Quote | null;
}

export function useQuoteByPermalink(
  authorPermalink: string | undefined,
  quotePermalink: string | undefined
) {
  const { loading, error, data } = useQuery<QuoteBySlugData>(
    GET_QUOTE_BY_PERMALINK,
    {
      variables: {
        author: authorPermalink,
        permalink: quotePermalink,
      },
      skip: !authorPermalink || !quotePermalink,
    }
  );

  return {
    loading,
    error,
    quote: data?.quoteByPermalink,
  };
}
