import React from 'react';
import { Text } from '@tamagui/core';
import { YStack } from '@tamagui/stacks';
import { Button } from '@tamagui/button';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="$4"
      minHeight="100vh"
      backgroundColor="$background"
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
        alignItems="center"
      >
        <Text fontSize="$8" fontWeight="700" color="$color" textAlign="center">
          Page Not Found
        </Text>
        <Text fontSize="$5" color="$color" opacity={0.7} textAlign="center">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          removed.
        </Text>
        <Button
          onPress={() => navigate('/')}
          backgroundColor="$blue10"
          color="white"
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderRadius="$4"
          fontSize="$4"
          fontWeight="600"
          cursor="pointer"
          marginTop="$4"
          hoverStyle={{
            backgroundColor: '$blue11',
            scale: 1.05,
          }}
          pressStyle={{
            scale: 0.95,
          }}
        >
          Go to Home
        </Button>
      </YStack>
    </YStack>
  );
}
