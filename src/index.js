import React from 'react';

import { createRoot } from 'react-dom/client';
import {reportWebVitals} from './reportWebVitals';

import App from './components/base-components/App';


//Initialising Root Element in React 18 based on App component
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Basic performance metric printed to console.log()
reportWebVitals();
