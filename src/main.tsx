import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap-reboot.css';

import { Header } from 'src/components/Header';
import { BaseStyle } from 'src/style/root';
import { SelectedThemeProvider } from 'src/style/SelectedThemeProvider';

const Everywhere: React.FunctionComponent = () => <h1>Everywhere</h1>;

export const Main: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <SelectedThemeProvider>
                <BaseStyle />
                <Header />
                <main>
                    <Switch>
                        <Route path="/here">{({ match }): React.ReactNode => (match ? <h1>Here</h1> : null)}</Route>
                        <Route path="/there">{({ match }): React.ReactNode => (match ? <h1>There</h1> : null)}</Route>
                        <Route path="/everywhere" componwnr={Everywhere} />
                        <Route>{({ match }): React.ReactNode => (match ? <h1>Page Not Found</h1> : null)}</Route>
                    </Switch>
                </main>
            </SelectedThemeProvider>
        </BrowserRouter>
    );
};
