import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ThemeContextProvider} from './HandyComponents/themeContext';
import {PossibleMovesProvider} from './HandyComponents/PossibleSquares';
import {LogContextProvider} from './HandyComponents/LogContext'
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const myChakraTheme = extendTheme({
  components: {
    Box: {
      color: 'none',
      background: 'none'
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeContextProvider>
        <LogContextProvider>
          <PossibleMovesProvider>
            <App/>
          </PossibleMovesProvider>
        </LogContextProvider>
      </ThemeContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
