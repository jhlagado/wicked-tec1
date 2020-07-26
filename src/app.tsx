import * as React from 'react';

import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AnyObj } from './types';
import { Tec1 } from './pages/tec1/tec1';

const GlobalStyle = createGlobalStyle`
html, body {
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  font-size: 0.875rem
}

#root {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
`;

const customTheme = (theme: AnyObj) => {
  return { ...theme };
};

export const App: React.FC<any> = () => {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={customTheme}>
        <Tec1 />
      </ThemeProvider>
    </>
  );
};
App.displayName = 'App';
