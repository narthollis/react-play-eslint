import { makeAsyncComponent } from 'src/components/makeAsyncComponent';

export const SomewhereElseLoader = makeAsyncComponent(
    async () => (await import('src/components/SomewhereElse/SomewhereElse')).SomewhereElse,
);
