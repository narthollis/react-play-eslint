import { useEffect, useState } from 'react';

export type PromiseResult<T> =
    | { result: T; error: null; loading: false }
    | { result: null; error: Error; loading: false }
    | { result: null; error: null; loading: true };

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

        return (): void => {
            setResult(undefined);
            setError(undefined);
        };
    }, [fn]);

    if (error != null) {
        return { error, result: null, loading: false };
    } else if (result != null) {
        return { result, error: null, loading: false };
    } else {
        return { result: null, error: null, loading: true };
    }
};
