export const isExported = ctx => {
    const isServer = typeof window === 'undefined';
    return (
        (isServer && ctx.req.headers === undefined) ||
        (!isServer && window.__NEXT_DATA__.nextExport)
    )
}

export const onExport = ctx => {
    const isServer = typeof window === 'undefined';
    return isExported(ctx) && isServer;
}
