import React, { useState } from "react";
import { Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { useNavigate, useLocation } from "react-router-dom";

import { buildQuoteUrl } from "../../utils/permalinks";
import { useRandomQuote } from "../../hooks";

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
      color={isActive ? "white" : "rgba(255, 255, 255, 0.7)"}
      fontWeight="600"
      cursor="pointer"
      userSelect="none"
      hoverStyle={{
        color: "white",
      }}
    >
      {children}
    </Text>
  );
};


const menuItems = [
  { name: "Home", path: "/", action: "navigate" as const },
  { name: "Random", path: "/random", action: "random" as const },
  { name: "Browse", path: "/quotes", action: "navigate" as const },
];

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { refetch } = useRandomQuote();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleRandomQuote = async () => {
    try {
      const result = await refetch();
      if (result.data?.randomQuote) {
        const newUrl = buildQuoteUrl(result.data.randomQuote);
        navigate(newUrl);
      }
    } catch (error) {
      console.error('Error fetching random quote:', error);
    }
  };

  const handleNavClick = (itemPath: string, itemAction: "navigate" | "random") => {
    if (itemAction === "random") {
      handleRandomQuote();
    } else {
      navigate(itemPath);
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
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
          onPress={() => handleNavClick("/", "navigate")}
        >
          A Motivational Quote
        </Text>

        {/* Desktop Navigation */}
        <XStack
          gap="$2"
          alignItems="center"
          display="none"
          $gtSm={{
            display: "flex",
          }}
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              isActive={isActive(item.path)}
              onPress={() => handleNavClick(item.path, item.action)}
            >
              {item.name}
            </NavLink>
          ))}
        </XStack>

        {/* Mobile Menu Button */}
        <YStack
          onPress={toggleMobileMenu}
          padding="$2"
          display="flex"
          $gtSm={{
            display: "none",
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
              rotate={isMobileMenuOpen ? "45deg" : "0deg"}
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
              rotate={isMobileMenuOpen ? "-45deg" : "0deg"}
              y={isMobileMenuOpen ? -8 : 0}
            />
          </YStack>
        </YStack>
      </XStack>

      {/* Mobile Menu */}
      <YStack
        display="flex"
        $gtSm={{
          display: "none",
        }}
        overflow="hidden"
        maxHeight={isMobileMenuOpen ? 200 : 0}
        opacity={isMobileMenuOpen ? 1 : 0}
        animation="quick"
        backgroundColor="#001a33"
        borderTopWidth={isMobileMenuOpen ? 1 : 0}
        borderTopColor="rgba(255, 255, 255, 0.1)"
      >
        <YStack padding="$3" gap="$2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              isActive={isActive(item.path)}
              onPress={() => handleNavClick(item.path, item.action)}
            >
              {item.name}
            </NavLink>
          ))}
        </YStack>
      </YStack>
    </YStack>
  );
};
