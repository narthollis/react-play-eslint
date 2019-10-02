import { useContext, useState } from 'react';

import { Action, combineReducers, createStore, Reducer, Store } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { ReactReduxContext, useDispatch, useSelector } from 'react-redux';

import { createActionCreator } from 'src/store/createActionCreator';

export interface DynamicStore<TStore extends { [key: string]: unknown } = { [key: string]: unknown }> {
    store: TStore;
    reducers: { [K in keyof TStore]: Reducer<TStore[K]> };
}

const addReducer = createActionCreator('@@DYNAMIC_STORE_ADD_REDUCER', (prefix: string, reducer: Reducer) => ({
    prefix,
    reducer,
}));

type ReducerCacheState = { [key: string]: Reducer };
function reducerCacheReducer(state: ReducerCacheState = {}, action: ReturnType<typeof addReducer>): ReducerCacheState {
    if (action.type === addReducer.toString()) {
        return {
            ...state,
            [action.payload.prefix]: action.payload.reducer,
        };
    }

    return state;
}

export const useReduxStore = <TStore extends { [key: string]: unknown }>(): Store<DynamicStore<TStore>> => {
    const [store] = useState<Store<DynamicStore<TStore>>>(() =>
        createStore(
            combineReducers({
                reducers: reducerCacheReducer,
            }),
            devToolsEnhancer({
                name: 'narth-play',
            }),
        ),
    );

    return store;
};

export type StoreSlice<P extends string, S> = { [K in P]: S };

export type SliceDescriptor<P, S, A extends Action> = {
    readonly prefix: P;
    readonly __VIRTUAL__store?: S;
    readonly __VIRTUAL__action?: A;
};

export const useReduxReducer = <P extends string, S, A extends Action>(
    prefix: P,
    reducerCreator: (prefix: P) => Reducer<S, A>,
): SliceDescriptor<P, S, A> => {
    const { store } = useContext(ReactReduxContext);

    const state: DynamicStore<StoreSlice<P, S>> = store.getState();
    if (state.reducers[prefix] == null) {
        const reducer = reducerCreator(prefix);

        const nextReducers = {
            ...state.reducers,
            [prefix]: reducer,
        };

        store.replaceReducer(
            combineReducers({
                store: combineReducers(nextReducers),
                reducers: reducerCacheReducer,
            }),
        );

        store.dispatch(addReducer(prefix, reducer as Reducer<S>));
    }

    return { prefix };
};

export const useSliceSelector = <P extends string, TSlice, TSelected, A extends Action>(
    sliceDescriptor: SliceDescriptor<P, TSlice, A>,
    selector: (slice: TSlice) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
): TSelected => {
    return useSelector<DynamicStore<StoreSlice<P, TSlice>>, TSelected>(
        (s: DynamicStore<StoreSlice<P, TSlice>>) => selector(s.store[sliceDescriptor.prefix]),
        equalityFn,
    );
};

export type PrefixedAction<A extends Action, P extends string = string> = A & { prefix: P };
export const useSliceDispatch = <P extends string, TSlice, A extends Action>(
    sliceDescriptor: SliceDescriptor<P, TSlice, A>,
): ((action: A) => PrefixedAction<A, P>) => {
    const dispatch = useDispatch();

    return (a: A): PrefixedAction<A, P> =>
        dispatch({
            ...a,
            prefix: sliceDescriptor.prefix,
        });
};
export function isPrefixedAction<A extends Action>(a: A): a is PrefixedAction<A> {
    return typeof (a as PrefixedAction<A>).prefix === 'string';
}
