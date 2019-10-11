import React from 'react';

import { useReduxReducer, useSliceDispatch, useSliceSelector } from 'src/hooks/useReduxStore';
import { createThereReducer } from 'src/store/reducers/there';
import { setA, setB } from 'src/store/actions/there';

export const SomewhereElse: React.FunctionComponent = () => {
    const slice = useReduxReducer(createThereReducer, 'somewhere-else');

    const a = useSliceSelector(slice, s => s?.a);
    const b = useSliceSelector(slice, s => s?.b);

    const dispatch = useSliceDispatch(slice);

    return (
        <main>
            <h1>Test Somewhere Else Dynamic</h1>
            <pre>A: {a}</pre>
            <button onClick={(): unknown => dispatch(setA(Math.random().toFixed(4)))}>Update A</button>
            <pre>B: {b}</pre>
            <button onClick={(): unknown => dispatch(setB(Math.random()))}>Update B</button>
        </main>
    );
};
