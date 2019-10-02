import { Reducer, Action } from 'redux';

import { isPrefixedAction, PrefixedAction } from 'src/hooks/useReduxStore';
import { resetTheme, setTheme } from 'src/store/actions/options';

export const themes = ['Dark', 'Light'] as const;
export type Themes = typeof themes[number];

interface OptionsState {
    readonly theme: Themes;
}

function isTheme(x: unknown): x is Themes {
    return x != null && typeof x === 'string' && themes.includes(x as Themes);
}

const INITIAL_STATE: OptionsState = {
    theme: 'Light',
};

type OptionsActions = ReturnType<typeof setTheme> | ReturnType<typeof resetTheme>;

export function createOptionsReducer(prefix: 'options'): Reducer<OptionsState> {
    const themeFromLocalStorage = window.localStorage.getItem('options.theme');

    const initialState: OptionsState = {
        theme: isTheme(themeFromLocalStorage) ? themeFromLocalStorage : INITIAL_STATE.theme,
    };

    return (state = initialState, action: PrefixedAction<OptionsActions> | Action): OptionsState => {
        if (!isPrefixedAction(action) || action.prefix !== prefix) {
            return state;
        }

        switch (action.type) {
            case setTheme.toString():
                return {
                    ...state,
                    theme: action.payload,
                };
            case resetTheme.toString():
                return {
                    ...state,
                    theme: INITIAL_STATE.theme,
                };
            default:
                return state;
        }
    };
}
