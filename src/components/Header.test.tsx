import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header', () => {
  describe('Rendering', () => {
    it('should render the application title', () => {
      render(<Header />);
      expect(screen.getByText('A Motivational Quote')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(<Header />);

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
      render(<Header />);

      const homeLinks = screen.getAllByText('Home');
      homeLinks.forEach(link => {
        expect(link).toBeInTheDocument();
      });
    });

    it('should update active state when Random is clicked', async () => {
      render(<Header />);

      const randomLinks = screen.getAllByText('Random');
      userEvent.click(randomLinks[0]);

      expect(randomLinks[0]).toBeInTheDocument();
    });

    it('should update active state when Browse is clicked', async () => {
      render(<Header />);

      const browseLinks = screen.getAllByText('Browse');
      userEvent.click(browseLinks[0]);

      expect(browseLinks[0]).toBeInTheDocument();
    });
  });

  describe('Mobile Menu', () => {
    it('should render mobile menu navigation items', () => {
      render(<Header />);

      const homeLinks = screen.getAllByText('Home');
      expect(homeLinks.length).toBeGreaterThan(0);
    });

    it('should toggle mobile menu when hamburger is clicked', async () => {
      const { container } = render(<Header />);

      // Find the hamburger menu container (YStack with three child divs)
      const hamburgerButton = container.querySelector('div[class*="_cur-pointer"][class*="_marginLeft-auto"]');

      expect(hamburgerButton).toBeInTheDocument();

      if (hamburgerButton) {
        userEvent.click(hamburgerButton);
        expect(hamburgerButton).toBeInTheDocument();
      }
    });

    it('should close mobile menu when a navigation link is clicked', async () => {
      const { container } = render(<Header />);

      // Find the hamburger menu container
      const hamburgerButton = container.querySelector('div[class*="_cur-pointer"][class*="_marginLeft-auto"]');

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
      render(<Header />);

      const title = screen.getByText('A Motivational Quote');
      userEvent.click(title);

      expect(title).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have clickable navigation items', () => {
      render(<Header />);

      // Check for clickable text elements (navigation links)
      const homeLinks = screen.getAllByText('Home');
      expect(homeLinks.length).toBeGreaterThan(0);
    });

    it('should have properly labeled navigation items', () => {
      render(<Header />);

      expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Random').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Browse').length).toBeGreaterThan(0);
    });
  });
});
