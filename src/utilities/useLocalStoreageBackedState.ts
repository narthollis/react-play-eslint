import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const useLocalStoreBackedState = <T extends string>(
    initial: T,
    key: string,
    tc: (x: unknown) => x is T,
): [T, Dispatch<SetStateAction<T>>] => {
    const pref = window.localStorage.getItem(key);

    const [val, set] = useState(tc(pref) ? pref : initial);

    useEffect(() => {
        window.localStorage.setItem(key, val);
    }, [val]);

    return [val, set];
};
