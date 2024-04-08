import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, theme } from "@chakra-ui/react";
import { RouterProvider } from 'react-router';
import { router } from './router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
      </ChakraProvider>
  </React.StrictMode>
);

