import { Reducer, Action } from 'redux';

import { isPrefixedAction, PrefixedAction } from 'src/hooks/useReduxStore';
import { setA, setB } from 'src/store/actions/there';

interface ThereState {
    readonly a: string;
    readonly b: number;
}

type ThereStateActions = ReturnType<typeof setA> | ReturnType<typeof setB>;

const INITIAL_STATE: ThereState = {
    a: 'initial',
    b: NaN,
};

export function createThereReducer(...prefix: ReadonlyArray<string>): Reducer<ThereState, ThereStateActions> {
    return (state = INITIAL_STATE, action: PrefixedAction<ThereStateActions> | Action): ThereState => {
        if (!isPrefixedAction(action)) {
            return state;
        }

        if (action.prefix.join('.') !== prefix.join('.')) {
            return state;
        }

        switch (action.type) {
            case setA.toString():
                return {
                    ...state,
                    a: action.payload,
                };
            case setB.toString():
                return {
                    ...state,
                    b: action.payload,
                };
            default:
                return state;
        }
    };
}
