import { makeAsyncComponent } from 'src/components/makeAsyncComponent';

export const ThereLoader = makeAsyncComponent(async () => (await import('src/components/There/There')).There);
