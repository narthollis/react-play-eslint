import React, { useState } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { usePromise } from 'src/utilities/usePromise';

type Themes = 'Dark' | 'Light';

const themes: Readonly<Record<Themes, () => Promise<DefaultTheme>>> = {
    Dark: async () => (await import('src/styled/dark')).DarkTheme,
    Light: async () => (await import('src/styled/light')).LightTheme,
};

export interface ThemeSelectorContext {
    readonly current: Themes;
    changeTheme(next: Themes): void;
}

const SelectedThemeContext: React.Context<ThemeSelectorContext> = React.createContext<ThemeSelectorContext>({
    current: 'Light',
    changeTheme: () => {},
});

export const SelectedThemeProvider: React.FunctionComponent = ({ children }) => {
    const [current, changeTheme] = useState<Themes>('Light');

    const { result: theme, error } = usePromise(themes[current]);

    return (
        <SelectedThemeContext.Provider value={{ changeTheme, current }}>
            {theme != null ? (
                <ThemeProvider theme={theme}>
                    <React.Fragment>{children}</React.Fragment>
                </ThemeProvider>
            ) : (
                <p>Error: {`${error}`}</p>
            )}
        </SelectedThemeContext.Provider>
    );
};

export const ThemeSelector: React.FunctionComponent = () => (
    <SelectedThemeContext.Consumer>
        {({ current, changeTheme }) => (
            <ul>
                {(Object.keys(themes) as ReadonlyArray<Themes>).map(t => (
                    <li key={t} onClick={() => changeTheme(t)} className={t === current ? 'active' : ''}>
                        {t}
                    </li>
                ))}
            </ul>
        )}
    </SelectedThemeContext.Consumer>
);
