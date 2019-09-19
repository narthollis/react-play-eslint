import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap-reboot.css';

import { Header } from 'src/components/Header';
import { BaseStyle } from 'src/style/root';
import { SelectedThemeProvider } from 'src/style/SelectedThemeProvider';

export const Main: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <SelectedThemeProvider>
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
            </SelectedThemeProvider>
        </BrowserRouter>
    );
};
