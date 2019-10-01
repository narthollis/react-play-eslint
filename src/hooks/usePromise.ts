import { useEffect, useState } from 'react';

export type PromiseResult<T> = { result: T; error: null } | { result: null; error: unknown };

export const usePromise = <T>(fn: () => Promise<T>): PromiseResult<T> => {
    const [result, setResult] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        fn().then(
            (v: T) => {
                setResult(() => v);
            },
            (e: Error) => {
                setError(() => e);
            },
        );
    }, [fn]);

    if (error != null) {
        return { error, result: null };
    } else {
        return { result, error: null };
    }
};
