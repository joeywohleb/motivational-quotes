import React, { useState } from 'react';
import { Text } from '@tamagui/core';
import { YStack, XStack } from '@tamagui/stacks';
import { Button } from '@tamagui/button';
import { useParams, useNavigate } from 'react-router-dom';

import {
  useQuoteById,
  useRandomQuote,
  useNextQuote,
  usePreviousQuote,
} from '../../hooks';
import { QuoteDisplay } from '../../components';
import { buildQuoteUrl } from '../../utils/permalinks';

export function ViewQuote() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const quoteId = id ? parseInt(id, 10) : null;

  const { loading, error, quote } = useQuoteById(quoteId);
  const { refetch } = useRandomQuote();
  const { fetchNextQuote } = useNextQuote();
  const { fetchPreviousQuote } = usePreviousQuote();

  const getRandomQuote = async () => {
    setIsAnimating(true);
    try {
      if (refetch) {
        const result = await refetch();
        if (result.data?.randomQuote) {
          const newUrl = buildQuoteUrl(result.data.randomQuote);
          navigate(newUrl, { replace: false });
        }
      }
    } finally {
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }
  };

  const getNextQuote = async () => {
    if (!quoteId) return;
    setIsAnimating(true);
    try {
      const result = await fetchNextQuote(quoteId);
      if (result.data?.nextQuote) {
        const newUrl = buildQuoteUrl(result.data.nextQuote);
        navigate(newUrl, { replace: false });
      }
    } finally {
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }
  };

  const getPreviousQuote = async () => {
    if (!quoteId) return;
    setIsAnimating(true);
    try {
      const result = await fetchPreviousQuote(quoteId);
      if (result.data?.prevQuote) {
        const newUrl = buildQuoteUrl(result.data.prevQuote);
        navigate(newUrl, { replace: false });
      }
    } finally {
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }
  };

  if (loading) {
    return (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$4"
        minHeight="100vh"
        backgroundColor="$background"
      >
        <Text fontSize="$6" color="$color">
          Loading quote...
        </Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        padding="$4"
        minHeight="100vh"
        backgroundColor="$background"
      >
        <Text fontSize="$6" color="$color">
          Error loading quote: {error.message}
        </Text>
      </YStack>
    );
  }

  if (!quote) {
    navigate('/not-found', { replace: true });
    return null;
  }

  const currentQuote = quote;

  return (
    <YStack
      flex={1}
      alignItems="center"
      paddingHorizontal="$4"
      paddingTop="$2"
      paddingBottom="$4"
      minHeight="100vh"
      backgroundColor="$background"
      maxWidth={800}
      width="100%"
      marginHorizontal="auto"
      position="relative"
    >
      <YStack
        flex={1}
        justifyContent="center"
        width="100%"
        maxWidth={600}
        paddingBottom={80}
      >
        <YStack
          padding="$4"
          borderRadius="$4"
          backgroundColor="$backgroundHover"
          borderWidth={1}
          borderColor="$borderColor"
          width="100%"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          opacity={isAnimating ? 0.5 : 1}
          scale={isAnimating ? 0.98 : 1}
          animation="quick"
          key={currentQuote.quote}
        >
          <QuoteDisplay quote={currentQuote} />
        </YStack>
      </YStack>
      <XStack
        position="absolute"
        bottom="$2"
        left={0}
        right={0}
        justifyContent="center"
        gap="$2"
        paddingHorizontal="$4"
      >
        <Button
          onPress={getPreviousQuote}
          backgroundColor="$gray10"
          color="white"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$3"
          fontSize="$3"
          fontWeight="600"
          cursor="pointer"
          hoverStyle={{
            backgroundColor: '$gray11',
            scale: 1.05,
          }}
          pressStyle={{
            scale: 0.95,
          }}
        >
          Previous
        </Button>
        <Button
          onPress={getRandomQuote}
          backgroundColor="$blue10"
          color="white"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$3"
          fontSize="$3"
          fontWeight="600"
          cursor="pointer"
          hoverStyle={{
            backgroundColor: '$blue11',
            scale: 1.05,
          }}
          pressStyle={{
            scale: 0.95,
          }}
        >
          New Quote
        </Button>
        <Button
          onPress={getNextQuote}
          backgroundColor="$gray10"
          color="white"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$3"
          fontSize="$3"
          fontWeight="600"
          cursor="pointer"
          hoverStyle={{
            backgroundColor: '$gray11',
            scale: 1.05,
          }}
          pressStyle={{
            scale: 0.95,
          }}
        >
          Next
        </Button>
      </XStack>
    </YStack>
  );
}
