/* eslint-disable @typescript-eslint/no-var-requires */
const React = require('react');

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/' };
const mockParams = { id: '1' };

// Simple mock without trying to require the actual module
module.exports = {
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  BrowserRouter: ({ children }) => React.createElement('div', null, children),
  MemoryRouter: ({ children }) => React.createElement('div', null, children),
  Routes: ({ children }) => React.createElement('div', null, children),
  Route: ({ _children, element }) => element || null,
  Link: ({ children, to }) => React.createElement('a', { href: to }, children),
  NavLink: ({ children, to }) =>
    React.createElement('a', { href: to }, children),
  mockNavigate,
  mockLocation,
  mockParams,
};
