import React, { useState } from 'react';
import { Text } from '@tamagui/core';
import { YStack, XStack } from '@tamagui/stacks';
import { Button } from '@tamagui/button';
import { useNavigate } from 'react-router-dom';

import { useRandomQuote } from '../../hooks';
import { QuoteDisplay } from '../../components';
import { buildQuoteUrl } from '../../utils/permalinks';

export function Home() {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const { loading, error, data, refetch } = useRandomQuote();

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
          Loading quotes...
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

  if (!data) {
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
          No quotes available
        </Text>
      </YStack>
    );
  }

  const currentQuote = data;

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$4"
      minHeight="100vh"
      backgroundColor="$background"
      maxWidth={800}
      width="100%"
      marginHorizontal="auto"
    >
      <YStack
        space="$4"
        padding="$6"
        borderRadius="$4"
        backgroundColor="$backgroundHover"
        borderWidth={1}
        borderColor="$borderColor"
        width="100%"
        maxWidth={600}
        shadowColor="$shadowColor"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={8}
        opacity={isAnimating ? 0.5 : 1}
        scale={isAnimating ? 0.98 : 1}
        animation="quick"
        key={currentQuote.quote}
      >
        <QuoteDisplay quote={currentQuote || null} />
        <XStack justifyContent="center" marginTop="$6">
          <Button
            onPress={getRandomQuote}
            backgroundColor="$blue10"
            color="white"
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderRadius="$4"
            fontSize="$4"
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
        </XStack>
      </YStack>
    </YStack>
  );
}
