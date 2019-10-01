import React, { useMemo } from 'react';
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

    useMemo(() => {
        console.log('hit memo inner');
    }, [store]);

    console.warn('rendering root component', { store });

    return (
        <Provider store={store}>
            <BrowserRouter>
                <SelectedThemeProvider>
                    <BaseStyle />
                    <Header />
                    <main>
                        <Switch>
                            <Route path="/here">{({ match }): React.ReactNode => (match ? <h1>Here</h1> : null)}</Route>
                            <Route path="/there">
                                <ThereLoader />
                            </Route>
                            <Route path="/everywhere">
                                <Everywhere />
                            </Route>
                            <Route path="/somewhere-else">
                                <SomewhereElseLoader />
                            </Route>
                            <Route>{({ match }): React.ReactNode => (match ? <h1>Page Not Found</h1> : null)}</Route>
                        </Switch>
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
