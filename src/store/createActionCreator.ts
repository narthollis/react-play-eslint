interface ActionWithPayload<T extends string, P> {
    type: T;
    payload: P;
}

interface ActionCreator<T extends string, P, Params extends ReadonlyArray<any>> {
    (...args: Params): ActionWithPayload<T, P>;
    toString(): T;
}

export function createActionCreator<T extends string, C extends (...args: ReadonlyArray<any>) => any>(
    type: T,
    creator: C,
): ActionCreator<T, ReturnType<C>, Parameters<C>> {
    const ac: ActionCreator<T, ReturnType<C>, Parameters<C>> = (
        ...args: Parameters<C>
    ): ActionWithPayload<T, ReturnType<C>> => {
        return {
            type,
            payload: creator(...args),
        };
    };
    ac.toString = (): T => type;

    return ac;
}
