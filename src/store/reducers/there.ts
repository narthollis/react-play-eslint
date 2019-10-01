import { Action, Reducer } from 'redux';
import { PrefixedAction } from 'src/hooks/useReduxStore';

interface ThereState {
    readonly a: string;
    readonly b: string;
}

interface ThereStateSetAAction extends Action<'there-state-set-a'> {
    payload: string;
}

interface ThereStateSetBAction extends Action<'there-state-set-b'> {
    payload: string;
}

type ThereStateActions = PrefixedAction<ThereStateSetAAction> | PrefixedAction<ThereStateSetBAction>;

const INITIAL_STATE: ThereState = {
    a: 'initial',
    b: 'initial',
};

export function createThereReducer(prefix: string): Reducer<ThereState, ThereStateActions> {
    return (state: ThereState = INITIAL_STATE, action: ThereStateActions): ThereState => {
        if (action.prefix !== prefix) {
            return state;
        }

        switch (action.type) {
            case 'there-state-set-a':
                return {
                    ...state,
                    a: action.payload,
                };
            case 'there-state-set-b':
                return {
                    ...state,
                    b: action.payload,
                };
            default:
                return state;
        }
    };
}
