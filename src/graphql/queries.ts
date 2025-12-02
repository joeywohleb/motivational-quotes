import { gql } from '@apollo/client';

export const GET_RANDOM_QUOTE = gql`
  query HomePage {
    randomQuote {
      id
      quote
      permalink
      author {
        id
        name
        permalink
      }
    }
  }
`;

export const GET_QUOTE_BY_ID = gql`
  query GetQuoteById($quoteId: Int!) {
    quoteById(quoteId: $quoteId) {
      id
      quote
      permalink
      author {
        id
        name
        permalink
      }
    }
  }
`;
