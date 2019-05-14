import { withBakedInitialProps } from './withBakedInitialProps';

const defaultBakedInitialPropsIdentifier = (ctx) => {
    if (ctx.asPath === '/') {
        return 'index';
    }
    return ctx.asPath.split('/').slice(1).join('_').toLowerCase();
};

/**
 * @description
 * The JSON HOC which writes your baked data to a JSON file and automaticly fetches the baked data.
 * @function withBakedInitialProps
 *
 * @param {React.Component} PageComponent
 * @param {Object} options
 * @param {bakeWhen} options.bakeWhen
 * @param {getInitialPropsWhen} options.getInitialPropsWhen
 * @returns {React.Component}
 */
export const withJSONBakedInitialProps = (
    PageComponent,
    options
) => {
    const getBakedInitialPropsIdentifier = PageComponent.getBakedInitialPropsIdentifier || defaultBakedInitialPropsIdentifier;

    PageComponent.bakeInitialProps = async(initialPropsData, ctx) => {
        const id = await getBakedInitialPropsIdentifier(ctx);
        const fs = require('fs');

        try {
            await fs.promises.mkdir('out/static/data/', { recursive: true });
        } catch {}
        await fs.promises.writeFile(`out/static/data/${id}.json`, JSON.stringify(initialPropsData));
    };

    PageComponent.getBakedInitialProps = async(ctx) => {
        const id = await getBakedInitialPropsIdentifier(ctx);
        const response = await fetch(`/static/data/${id}.json`);
        const data = await response.json();
        return data;
    };

    return withBakedInitialProps(PageComponent, options);
};
