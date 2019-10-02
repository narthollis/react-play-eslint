import { createActionCreator } from 'src/store/createActionCreator';
import { Themes } from 'src/store/reducers/options';

export const setTheme = createActionCreator('options-theme-set', (theme: Themes) => theme);
export const resetTheme = createActionCreator('options-theme-reset', () => {});
