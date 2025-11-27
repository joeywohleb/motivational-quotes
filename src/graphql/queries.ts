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
