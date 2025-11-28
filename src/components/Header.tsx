import React, { useState } from 'react';
import { Text } from '@tamagui/core';
import { YStack, XStack } from '@tamagui/stacks';

interface NavLinkProps {
  children: React.ReactNode;
  isActive?: boolean;

  onPress?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ children, isActive, onPress }) => {
  return (
    <Text
      onPress={onPress}
      paddingHorizontal="$3"
      paddingVertical="$2"
      fontSize="$4"
      color={isActive ? 'white' : 'rgba(255, 255, 255, 0.7)'}
      fontWeight="600"
      cursor="pointer"
      userSelect="none"
      hoverStyle={{
        color: 'white',
      }}
    >
      {children}
    </Text>
  );
};

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <YStack
      backgroundColor="#001f3f"
      shadowColor="rgba(0, 0, 0, 0.15)"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      zIndex={1000}
    >
      <XStack
        maxWidth={1200}
        width="100%"
        marginHorizontal="auto"
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="center"
        gap="$6"
      >
        {/* Logo/Branding */}
        <Text
          fontSize="$6"
          fontWeight="700"
          color="white"
          cursor="pointer"
          onPress={() => handleNavClick('home')}
        >
          A Motivational Quote
        </Text>

        {/* Desktop Navigation */}
        <XStack
          gap="$2"
          alignItems="center"
          display="none"
          $gtSm={{
            display: 'flex',
          }}
        >
          <NavLink
            isActive={currentPage === 'home'}
            onPress={() => handleNavClick('home')}
          >
            Home
          </NavLink>
          <NavLink
            isActive={currentPage === 'random'}
            onPress={() => handleNavClick('random')}
          >
            Random
          </NavLink>
          <NavLink
            isActive={currentPage === 'quotes'}
            onPress={() => handleNavClick('quotes')}
          >
            Browse
          </NavLink>
        </XStack>

        {/* Mobile Menu Button */}
        <YStack
          onPress={toggleMobileMenu}
          padding="$2"
          display="flex"
          $gtSm={{
            display: 'none',
          }}
          cursor="pointer"
          marginLeft="auto"
        >
          <YStack gap="$1.5">
            <YStack
              width={24}
              height={2}
              backgroundColor="white"
              borderRadius="$1"
              animation="quick"
              rotate={isMobileMenuOpen ? '45deg' : '0deg'}
              y={isMobileMenuOpen ? 8 : 0}
            />
            <YStack
              width={24}
              height={2}
              backgroundColor="white"
              borderRadius="$1"
              animation="quick"
              opacity={isMobileMenuOpen ? 0 : 1}
            />
            <YStack
              width={24}
              height={2}
              backgroundColor="white"
              borderRadius="$1"
              animation="quick"
              rotate={isMobileMenuOpen ? '-45deg' : '0deg'}
              y={isMobileMenuOpen ? -8 : 0}
            />
          </YStack>
        </YStack>
      </XStack>

      {/* Mobile Menu */}
      <YStack
        display="flex"
        $gtSm={{
          display: 'none',
        }}
        overflow="hidden"
        maxHeight={isMobileMenuOpen ? 200 : 0}
        opacity={isMobileMenuOpen ? 1 : 0}
        animation="quick"
        backgroundColor="#001a33"
        borderTopWidth={isMobileMenuOpen ? 1 : 0}
        borderTopColor="rgba(255, 255, 255, 0.1)"
      >
        <YStack
          padding="$3"
          gap="$2"
        >
          <NavLink
            isActive={currentPage === 'home'}
            onPress={() => handleNavClick('home')}
          >
            Home
          </NavLink>
          <NavLink
            isActive={currentPage === 'random'}
            onPress={() => handleNavClick('home')}
          >
            Random
          </NavLink>
          <NavLink
            isActive={currentPage === 'quotes'}
            onPress={() => handleNavClick('quotes')}
          >
            Browse
          </NavLink>
        </YStack>
      </YStack>
    </YStack>
  );
};

export default Header;
