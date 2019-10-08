import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import 'bootstrap/dist/css/bootstrap-reboot.css';

import { Header } from 'src/components/Header';
import { BaseStyle } from 'src/style/root';
import { SelectedThemeProvider } from 'src/style/SelectedThemeProvider';
import { useReduxStore } from 'src/hooks/useReduxStore';
import { ThereLoader } from 'src/components/There';
import { SomewhereElseLoader } from 'src/components/SomewhereElse';

const Everywhere: React.FunctionComponent = () => <h1>Everywhere</h1>;

const MainComponent: React.FunctionComponent = () => {
    const store = useReduxStore();

    return (
        <Provider store={store}>
            <BrowserRouter>
                <SelectedThemeProvider>
                    <BaseStyle />
                    <Header />
                    <main>
                        <React.Suspense fallback={<h1>Loading...</h1>}>
                            <Switch>
                                <Route path="/here">
                                    <h1>Here</h1>
                                </Route>
                                <Route path="/there">
                                    <ThereLoader />
                                </Route>
                                <Route path="/everywhere">
                                    <Everywhere />
                                </Route>
                                <Route path="/somewhere-else">
                                    <SomewhereElseLoader />
                                </Route>
                                <Route>
                                    <h1>Page Not Found</h1>
                                </Route>
                            </Switch>
                        </React.Suspense>
                    </main>
                </SelectedThemeProvider>
            </BrowserRouter>
        </Provider>
    );
};

export async function render(root: HTMLElement): Promise<void> {
    return new Promise((resolve): void => {
        ReactDOM.render(React.createElement(MainComponent), root, resolve);
    });
}
