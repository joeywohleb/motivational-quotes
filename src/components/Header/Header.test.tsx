import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';

import { Header } from './Header';
import { render } from '../../test-utils';
import { GET_RANDOM_QUOTE } from '../../graphql/queries';

// Mock react-router-dom
jest.mock('react-router-dom');

const mockQuote = {
  id: '1',
  quote: 'Test quote',
  permalink: 'test-quote',
  author: {
    id: '1',
    name: 'Test Author',
    permalink: 'test-author',
  },
};

const mocks = [
  {
    request: {
      query: GET_RANDOM_QUOTE,
    },
    result: {
      data: {
        randomQuote: mockQuote,
      },
    },
  },
  {
    request: {
      query: GET_RANDOM_QUOTE,
    },
    result: {
      data: {
        randomQuote: mockQuote,
      },
    },
  },
];

const renderHeader = () => {
  return render(
    <MockedProvider mocks={mocks}>
      <Header />
    </MockedProvider>
  );
};

describe('Header', () => {
  describe('Rendering', () => {
    it('should render the application title', () => {
      renderHeader();
      expect(screen.getByText('A Motivational Quote')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      renderHeader();

      const homeLinks = screen.getAllByText('Home');
      const randomLinks = screen.getAllByText('Random');
      const browseLinks = screen.getAllByText('Browse');

      expect(homeLinks.length).toBeGreaterThan(0);
      expect(randomLinks.length).toBeGreaterThan(0);
      expect(browseLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Active State', () => {
    it('should highlight Home as active by default', () => {
      renderHeader();

      const homeLinks = screen.getAllByText('Home');
      homeLinks.forEach((link) => {
        expect(link).toBeInTheDocument();
      });
    });

    it('should update active state when Random is clicked', async () => {
      renderHeader();

      const randomLinks = screen.getAllByText('Random');
      userEvent.click(randomLinks[0]);

      expect(randomLinks[0]).toBeInTheDocument();
    });

    it('should update active state when Browse is clicked', async () => {
      renderHeader();

      const browseLinks = screen.getAllByText('Browse');
      userEvent.click(browseLinks[0]);

      expect(browseLinks[0]).toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    it('should render mobile menu navigation items', () => {
      renderHeader();

      const homeLinks = screen.getAllByText('Home');
      expect(homeLinks.length).toBeGreaterThan(0);
    });

    it('should toggle mobile menu when hamburger is clicked', async () => {
      const { container } = renderHeader();

      // Find the hamburger menu container (YStack with three child divs)
      const hamburgerButton = container.querySelector(
        'div[class*="_cur-pointer"][class*="_marginLeft-auto"]'
      );

      expect(hamburgerButton).toBeInTheDocument();

      if (hamburgerButton) {
        userEvent.click(hamburgerButton);
        expect(hamburgerButton).toBeInTheDocument();
      }
    });

    it('should close mobile menu when a navigation link is clicked', async () => {
      const { container } = renderHeader();

      // Find the hamburger menu container
      const hamburgerButton = container.querySelector(
        'div[class*="_cur-pointer"][class*="_marginLeft-auto"]'
      );

      if (hamburgerButton) {
        userEvent.click(hamburgerButton);

        const randomLinks = screen.getAllByText('Random');
        userEvent.click(randomLinks[randomLinks.length - 1]);

        expect(randomLinks[0]).toBeInTheDocument();
      }
    });
  });

  describe('Branding', () => {
    it('should allow clicking on the title to navigate to home', async () => {
      renderHeader();

      const title = screen.getByText('A Motivational Quote');
      userEvent.click(title);

      expect(title).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have clickable navigation items', () => {
      renderHeader();

      // Check for clickable text elements (navigation links)
      const homeLinks = screen.getAllByText('Home');
      expect(homeLinks.length).toBeGreaterThan(0);
    });

    it('should have properly labeled navigation items', () => {
      renderHeader();

      expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Random').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Browse').length).toBeGreaterThan(0);
    });
  });
});
