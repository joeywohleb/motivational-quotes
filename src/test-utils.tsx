import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { TamaguiProvider, createTamagui } from '@tamagui/core';

// Create a minimal test config for Tamagui
// Using a more complete config structure
const testConfig = createTamagui({
  defaultFont: 'body',
  themeClassNameOnRoot: true,
  themes: {
    light: {
      background: '#fff',
      backgroundHover: '#f5f5f5',
      color: '#000',
      color2: '#f0f0f0',
      borderColor: '#e0e0e0',
      shadowColor: '#000',
      blue10: '#3b82f6',
      blue11: '#2563eb',
    },
  },
  tokens: {
    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
    },
    size: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
    },
    radius: {
      0: 0,
      1: 3,
      2: 6,
      3: 9,
      4: 12,
    },
    zIndex: {
      0: 0,
    },
    color: {
      background: '#fff',
      color: '#000',
    },
  },
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
  shorthands: {},
  fonts: {
    body: {
      family: 'System',
      size: {},
    },
  },
  animations: {},
});

// Custom render function that includes TamaguiProvider
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <TamaguiProvider config={testConfig} defaultTheme="light">
      {children}
    </TamaguiProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

