import React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap-reboot.css';

import { LightTheme } from 'src/styled/light';
import { Header } from 'src/components/Header';

const BaseStyle = createGlobalStyle`
  :root {
  }
  
  body, body > div.root {
    display: flex;
    flex: 1 0 100%;
    flex-direction: column;
  }
`;

export const Main: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={LightTheme}>
                <React.Fragment>
                    <BaseStyle />
                    <Header />
                    <main>
                        <Switch>
                            <Route path="/here">{({ match }) => (match ? <h1>Here</h1> : null)}</Route>
                            <Route path="/there">{({ match }) => (match ? <h1>There</h1> : null)}</Route>
                            <Route path="/everywhere">{({ match }) => (match ? <h1>Everywhere</h1> : null)}</Route>
                            <Route>{({ match }) => (match ? <h1>Page Not Found</h1> : null)}</Route>
                        </Switch>
                    </main>
                </React.Fragment>
            </ThemeProvider>
        </BrowserRouter>
    );
};
