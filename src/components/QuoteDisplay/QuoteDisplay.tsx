import React from 'react';
import { Text } from '@tamagui/core';
import { XStack } from '@tamagui/stacks';
import { Separator } from '@tamagui/separator';

import { Quote } from '../../types';

interface Props {
  quote: Quote;
}

export const QuoteDisplay: React.FC<Props> = ({ quote }) => {
  return (
    <>
      <Text
        fontSize="$7"
        fontWeight="600"
        lineHeight="$7"
        color="$color"
        textAlign="center"
        marginBottom="$2"
      >
        &ldquo;{quote.quote}&rdquo;
      </Text>

      <Separator />

      <XStack justifyContent="center" alignItems="center" marginTop="$2">
        <Text fontSize="$5" color="$color" fontStyle="italic">
          — {quote.author.name}
        </Text>
      </XStack>
    </>
  );
};
