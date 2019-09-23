import React, { useContext } from 'react';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { usePromise } from 'src/utilities/usePromise';
import { useLocalStoreBackedState } from 'src/utilities/useLocalStoreageBackedState';

type Themes = 'Dark' | 'Light';

const themes: Readonly<Record<Themes, () => Promise<DefaultTheme>>> = {
    Dark: async () => (await import('src/styled/dark')).DarkTheme,
    Light: async () => (await import('src/styled/light')).LightTheme,
};

function isTheme(x: unknown): x is Themes {
    return x != null && typeof x === 'string' && Object.keys(themes).includes(x);
}

export interface ThemeSelectorContext {
    readonly current: Themes;

    changeTheme(next: Themes): void;
}

const SelectedThemeContext: React.Context<ThemeSelectorContext> = React.createContext<ThemeSelectorContext>({
    current: 'Light',
    changeTheme: () => {},
});

export const SelectedThemeProvider: React.FunctionComponent = ({ children }) => {
    const [current, changeTheme] = useLocalStoreBackedState<Themes>('Light', 'play-app-preference-theme', isTheme);

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

export const ThemeSelector: React.FunctionComponent = () => {
    const { current, changeTheme } = useContext(SelectedThemeContext);

    return (
        <ul>
            {(Object.keys(themes) as ReadonlyArray<Themes>).map(t => (
                <li key={t} onClick={(): void => changeTheme(t)} className={t === current ? 'active' : ''}>
                    {t}
                </li>
            ))}
        </ul>
    );
};
