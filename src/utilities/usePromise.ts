import { useEffect, useState } from 'react';

export const usePromise = <T>(fn: () => Promise<T>): { result: T, error: unknown } => {
    const [result, setResult] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        fn().then(setResult, setError);
    });

    return { result, error };
};
