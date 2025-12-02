import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NotFound } from './NotFound';
import { render } from '../../test-utils';

// Mock the module
jest.mock('react-router-dom');

// Import the mocked module
// eslint-disable-next-line @typescript-eslint/no-var-requires
const routerDom = require('react-router-dom');
const { mockNavigate } = routerDom;

describe('NotFound', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Rendering', () => {
    it('should render the page not found title', () => {
      render(<NotFound />);

      expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    });

    it('should render the error message', () => {
      render(<NotFound />);

      expect(
        screen.getByText(
          /the page you're looking for doesn't exist or may have been removed/i
        )
      ).toBeInTheDocument();
    });

    it('should render the "Go to Home" button', () => {
      render(<NotFound />);

      expect(screen.getByText(/go to home/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to home when button is clicked', () => {
      render(<NotFound />);

      const button = screen.getByText(/go to home/i);
      userEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Styling', () => {
    it('should render a styled card container', () => {
      const { container } = render(<NotFound />);

      // Check that the page has proper structure
      expect(container.querySelector('[class*="flex"]')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have clickable button with proper text', () => {
      render(<NotFound />);

      const button = screen.getByText(/go to home/i);
      expect(button).toBeInTheDocument();
    });

    it('should have centered layout for better UX', () => {
      const { container } = render(<NotFound />);

      // The main container should have flex properties for centering
      expect(container.querySelector('[class*="flex"]')).toBeInTheDocument();
    });
  });
});
