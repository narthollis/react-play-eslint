import React from 'react';
import { useDispatch } from 'react-redux';

import { useReduxReducer } from 'src/hooks/useReduxStore';
import { createThereReducer } from 'src/store/reducers/there';

export const There: React.FunctionComponent = () => {
    const { useSelectorInSlice, prefix } = useReduxReducer('somewhere-else', createThereReducer);

    const a = useSelectorInSlice(s => s.a);
    const b = useSelectorInSlice(s => s.b);

    const dispatch = useDispatch();

    return (
        <main>
            <h1>Test There Dynamic</h1>
            <pre>A: {a}</pre>
            <button onClick={() => dispatch(prefix({ type: 'there-state-set-a', payload: Math.random().toFixed(4) }))}>
                Update A
            </button>
            <pre>B: {b}</pre>
            <button onClick={() => dispatch(prefix({ type: 'there-state-set-b', payload: Math.random().toFixed(4) }))}>
                Update B
            </button>
        </main>
    );
};
