import React, { useEffect } from 'react';

import { DefaultTheme, ThemeProvider } from 'styled-components';

import { usePromise } from 'src/hooks/usePromise';
import { createOptionsReducer, Themes } from 'src/store/reducers/options';
import { useReduxReducer, useSliceDispatch, useSliceSelector } from 'src/hooks/useReduxStore';
import { setTheme } from 'src/store/actions/options';

const themes: Readonly<Record<Themes, () => Promise<DefaultTheme>>> = {
    Dark: async () => (await import('src/styled/dark')).DarkTheme,
    Light: async () => (await import('src/styled/light')).LightTheme,
};

export const SelectedThemeProvider: React.FunctionComponent = ({ children }) => {
    const slice = useReduxReducer('options', createOptionsReducer);

    const currentTheme = useSliceSelector(slice, s => s.theme);

    useEffect(() => {
        window.localStorage.setItem('options.theme', currentTheme);
    }, [currentTheme]);

    const { result: theme, error } = usePromise(themes[currentTheme]);

    if (error != null) {
        return <p>Error loading theme: {`${error}`}</p>;
    }

    if (theme != null) {
        return (
            <ThemeProvider theme={theme}>
                <React.Fragment>{children}</React.Fragment>
            </ThemeProvider>
        );
    }

    return null;
};

export const ThemeSelector: React.FunctionComponent = () => {
    const slice = useReduxReducer('options', createOptionsReducer);

    const current = useSliceSelector(slice, s => s.theme);
    const themeDispatcher = useSliceDispatch(slice);

    return (
        <ul>
            {(Object.keys(themes) as ReadonlyArray<Themes>).map(t => (
                <li
                    key={t}
                    onClick={(): void => {
                        themeDispatcher(setTheme(t));
                    }}
                    className={t === current ? 'active' : ''}
                >
                    {t}
                </li>
            ))}
        </ul>
    );
};
