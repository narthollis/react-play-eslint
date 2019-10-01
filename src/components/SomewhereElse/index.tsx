import React from 'react';
import { usePromise } from 'src/hooks/usePromise';

export const SomewhereElseLoader: React.FunctionComponent = () => {
    const { result: ActualThere, error } = usePromise(async () => (await import('./There')).There);

    if (error != null) {
        return <p>Error</p>;
    }

    if (ActualThere == null) {
        return <p>Loading...</p>;
    }

    return <ActualThere />;
};
