import { createActionCreator } from 'src/store/createActionCreator';

export const setA = createActionCreator('there-state-set-a', (val: string) => val);
export const setB = createActionCreator('there-state-set-b', (val: number) => val);
