import React from 'react';

export const makeAsyncComponent = <P extends object, M extends () => Promise<React.FunctionComponent<P>>>(
    loader: M,
): React.FunctionComponent<P> => {
    let Component: React.FunctionComponent<P> | null = null;
    let error: Error | null = null;
    let promise: Promise<void> | null = null;

    return (props: P): ReturnType<React.FunctionComponent<P>> => {
        if (promise === null) {
            promise = loader().then(
                r => {
                    Component = r;
                },
                e => {
                    error = e;
                },
            );
        }

        if (error !== null) {
            throw error;
        }
        if (Component === null) {
            throw promise;
        }

        return <Component {...props} />;
    };
};
