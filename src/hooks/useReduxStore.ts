import { useContext, useState } from 'react';

import { Action, ActionCreator, combineReducers, createStore, Reducer, Store } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { ReactReduxContext, useSelector } from 'react-redux';

export interface DynamicStore<TStore extends { [key: string]: unknown } = { [key: string]: unknown }> {
    store: TStore;
    reducers: { [K in keyof TStore]: Reducer<TStore[K], Action> };
}

interface AddReducerAction extends Action<'DYNAMIC_STORE_ADD_REDUCER'> {
    reducer: Reducer<unknown, Action>;
    prefix: string;
}
const addReducer: ActionCreator<AddReducerAction> = (prefix: string, reducer: Reducer<unknown, Action>) => ({
    type: 'DYNAMIC_STORE_ADD_REDUCER',
    prefix,
    reducer,
});

type ReducerCacheState = { [key: string]: Reducer<unknown, Action> };
function reducerCacheReducer(state: ReducerCacheState = {}, action: AddReducerAction): ReducerCacheState {
    if (action.type === 'DYNAMIC_STORE_ADD_REDUCER') {
        return {
            ...state,
            [action.prefix]: action.reducer,
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

export type StoreWithSlice<P extends string, S> = { [K in P]: S };

export type PrefixedAction<A extends Action, P extends string = string> = A & { prefix: P };

type TypedUseSelector<S> = <TSelected>(
    selector: (state: S) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
) => TSelected;

type UseReduxStoreReducer<S> = {
    useSelectorInSlice: TypedUseSelector<S>;
    prefix<A extends Action>(action: A): PrefixedAction<A>;
};

// TODO have this return a slice descriptor which can be used as the parameter to
//  useSliceSelector<TSlice, TSelected>(slice, selector, equality): TSelected
//  useSliceDispatch<TSlice>(slice): Dispatch
export const useReduxReducer = <P extends string, S, A extends Action>(
    prefix: P,
    reducerCreator: (prefix: P) => Reducer<S, A>,
): UseReduxStoreReducer<S> => {
    const { store } = useContext(ReactReduxContext);

    const state: DynamicStore<StoreWithSlice<P, S>> = store.getState();
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

        store.dispatch(addReducer(prefix, reducer));
    } else {
        console.info('reduce already loaded, not bothering to do anything');
    }

    return {
        useSelectorInSlice<TSelected>(
            selector: (state: S) => TSelected,
            equalityFn?: (left: TSelected, right: TSelected) => boolean,
        ): TSelected {
            return useSelector<DynamicStore<StoreWithSlice<P, S>>, TSelected>(
                (s: DynamicStore<StoreWithSlice<P, S>>) => selector(s.store[prefix]),
                equalityFn,
            );
        },
        prefix<A extends Action>(action: A): PrefixedAction<A> {
            return { ...action, prefix: prefix };
        },
    };
};
