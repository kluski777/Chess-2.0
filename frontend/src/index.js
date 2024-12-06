import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ThemeContextProvider} from './HandyComponents/themeContext';
import {LogContextProvider} from './HandyComponents/LogContext'
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const myChakraTheme = extendTheme({
  components: {
    Box: {
      color: 'none',
      background: 'none'
    }
  },
  styles: {
    global: {
        html: {
            height: '100%',
            width: '100%',
        },
        body: {
            height: '100%',
            width: '100%',
            margin: 0,
            padding: 0,
        },
        '#root': {
            height: '100%',
            width: '100%',
        },
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={myChakraTheme}>
      <ThemeContextProvider>
        <LogContextProvider>
          <App/>
        </LogContextProvider>
      </ThemeContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
