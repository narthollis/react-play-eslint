import { useContext, useEffect, useMemo, useState } from 'react';

import { Action, combineReducers, createStore, Reducer, Store, ReducersMapObject } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import { ReactReduxContext, ReactReduxContextValue, useDispatch, useSelector } from 'react-redux';

import { createActionCreator } from 'src/store/createActionCreator';

type RecursiveReducersMapObject = { [key: string]: Reducer | RecursiveReducersMapObject };
export interface DynamicStore<TStore = unknown> {
    store: TStore;
    reducers: RecursiveReducersMapObject;
}

const addReducer = createActionCreator(
    '@@DYNAMIC_STORE_ADD_REDUCER',
    (reducer: Reducer, ...prefix: ReadonlyArray<string>) => ({
        prefix,
        reducer,
    }),
);
const removeReducer = createActionCreator(
    '@@DYNAMIC_STORE_REMOVE_REDUCER',
    (reducer: Reducer, ...prefix: ReadonlyArray<string>) => ({
        prefix,
        reducer,
    }),
);

function getAtPath(obj: object, ...path: ReadonlyArray<string>): unknown {
    return path.reduce(
        (o: object | undefined, p) => (typeof o === 'object' ? (o as { [k: string]: object })[p] : undefined),
        obj,
    );
}
function imutSetAtPath(
    obj: RecursiveReducersMapObject,
    val: Reducer,
    ...path: ReadonlyArray<string>
): RecursiveReducersMapObject {
    const next = { ...obj };
    let seg: { [k: string]: object } = next;
    for (const p of path.slice(0, -1)) {
        seg = seg[p] = { ...seg[p] };
    }

    seg[path.slice(-1)[0]] = val;

    return next;
}

function reducerCacheReducer(
    state: RecursiveReducersMapObject = {},
    action: ReturnType<typeof addReducer> | ReturnType<typeof removeReducer>,
): RecursiveReducersMapObject {
    if (action.type === addReducer.toString()) {
        const current = getAtPath(state, ...action.payload.prefix);
        if (current == null) {
            return imutSetAtPath(state, action.payload.reducer, ...action.payload.prefix);
        }

        return state;
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

export type StoreSlice<P extends ReadonlyArray<string>, S> = { [K in P[0]]: S };

export type SliceDescriptor<P extends ReadonlyArray<string>, S, A extends Action> = {
    readonly prefix: P;
    readonly __VIRTUAL__store?: S;
    readonly __VIRTUAL__action?: A;
};

const recurseCombineReducers = (reducers: RecursiveReducersMapObject): Reducer => {
    const r: ReducersMapObject = {};
    for (const [key, value] of Object.entries(reducers)) {
        r[key] = typeof value === 'function' ? value : recurseCombineReducers(value);
    }

    return combineReducers(r);
};

export const useReduxReducer = <P extends ReadonlyArray<string>, S, A extends Action>(
    reducerCreator: (...prefix: P) => Reducer<S, A>,
    ...prefix: P
): SliceDescriptor<P, S, A> => {
    const { store } = useContext<ReactReduxContextValue<DynamicStore>>(ReactReduxContext);

    const reducer = useMemo(() => reducerCreator(...prefix), [reducerCreator, prefix]);

    useEffect(() => {
        const prevReducers = store.getState().reducers;

        store.dispatch(addReducer(reducer as Reducer<S>, ...prefix));

        const nextReducers = store.getState().reducers;

        if (prevReducers !== nextReducers) {
            store.replaceReducer(
                combineReducers<DynamicStore>({
                    store: recurseCombineReducers(nextReducers),
                    reducers: reducerCacheReducer,
                }),
            );
        }

        return (): void => {
            const prevReducers = store.getState().reducers;

            const reducer = reducerCreator(...prefix);
            store.dispatch(removeReducer(reducer as Reducer<S>, ...prefix));

            const nextReducers = store.getState().reducers;

            if (prevReducers !== nextReducers) {
                store.replaceReducer(
                    combineReducers({
                        store: recurseCombineReducers(nextReducers),
                        reducers: reducerCacheReducer,
                    }),
                );
            }
        };
    }, [...prefix]);

    return { prefix };
};

export const useSliceSelector = <P extends ReadonlyArray<string>, TSlice, TSelected, A extends Action>(
    sliceDescriptor: SliceDescriptor<P, TSlice, A>,
    selector: (slice?: TSlice) => TSelected | undefined,
    equalityFn?: (left?: TSelected, right?: TSelected) => boolean,
): TSelected | undefined => {
    return useSelector<DynamicStore<StoreSlice<P, TSlice>>, TSelected | undefined>(
        (s: DynamicStore<StoreSlice<P, TSlice>>) => selector(getAtPath(s.store, ...sliceDescriptor.prefix) as TSlice),
        equalityFn,
    );
};

export type PrefixedAction<A extends Action, P extends ReadonlyArray<string> = ReadonlyArray<string>> = A & {
    prefix: P;
};
export const useSliceDispatch = <P extends ReadonlyArray<string>, TSlice, A extends Action>(
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
    return Array.isArray((a as PrefixedAction<A>).prefix);
}
