import React from 'react';
import ReactDOM from 'react-dom/client';
import { TamaguiProvider } from '@tamagui/core';
import config from './tamagui.config';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TamaguiProvider config={config} defaultTheme="light">
      <App />
    </TamaguiProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
