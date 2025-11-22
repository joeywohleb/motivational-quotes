import React, { useState, useEffect } from 'react';
import { Text } from '@tamagui/core';
import { YStack, XStack } from '@tamagui/stacks';
import { Button } from '@tamagui/button';
import { Separator } from '@tamagui/separator';
import Papa, { ParseResult } from 'papaparse';

interface Quote {
  quote: string;
  author: string;
  category: string;
}

const QuoteDisplay: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load quotes from CSV file
    fetch('/quotes.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse<Quote>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult<Quote>) => {
            const parsedQuotes = results.data.filter(
              (q: Quote) => q.quote && q.author
            );
            setQuotes(parsedQuotes);
            // Select a random quote on initial load
            if (parsedQuotes.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * parsedQuotes.length
              );
              setCurrentQuote(parsedQuotes[randomIndex]);
            }
            setIsLoading(false);
          },
          error: (error: Error) => {
            console.error('Error parsing CSV:', error);
            setIsLoading(false);
          },
        });
      })
      .catch((error) => {
        console.error('Error loading quotes:', error);
        setIsLoading(false);
      });
  }, []);

  const getRandomQuote = () => {
    if (quotes.length > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIndex]);
        setIsAnimating(false);
      }, 150);
    }
  };

  const parseTags = (category: string): string[] => {
    if (!category) return [];
    return category.split(',').map((tag) => tag.trim()).filter(Boolean);
  };

  if (isLoading) {
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

  if (!currentQuote) {
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

  const tags = parseTags(currentQuote.category);

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
        <Text
          fontSize="$7"
          fontWeight="600"
          lineHeight="$7"
          color="$color"
          textAlign="center"
          marginBottom="$2"
        >
          "{currentQuote.quote}"
        </Text>

        <Separator />

        <XStack justifyContent="center" alignItems="center" marginTop="$2">
          <Text fontSize="$5" color="$color" fontStyle="italic">
            — {currentQuote.author}
          </Text>
        </XStack>

        {tags.length > 0 && (
          <XStack
            flexWrap="wrap"
            justifyContent="center"
            space="$2"
            marginTop="$4"
          >
            {tags.map((tag, index) => (
              <Text
                key={index}
                fontSize="$3"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$2"
                backgroundColor="$color2"
                color="$color"
                borderWidth={1}
                borderColor="$borderColor"
              >
                {tag}
              </Text>
            ))}
          </XStack>
        )}

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
};

export default QuoteDisplay;

