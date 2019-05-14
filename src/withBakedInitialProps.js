import { onExport, isExported } from './utils/env';
import React from 'react';

const notImplemented = () => {};

/**
 * @description
 * Callback wich describes when the data should be baked.
 * @callback bakeWhen
 *
 * @param {boolean} defaultValue
 * @param {Object} ctx
 * @returns {boolean}
 */
const bakeWhen = (defaultValue, ctx) => defaultValue;

/**
 * @description
 * CallBack which describes when the intiial initialProps of the PageComponent should be used instead of the baked data.
 * @param {boolean} defaultValue
 * @param {Object} ctx
 * @returns {boolean}
 */
const getInitialPropsWhen = (defaultValue, ctx) => defaultValue;

/**
 * @description
 * The base HOC which can be used to implement your own bake storage
 *
 * @param {React.Component} PageComponent
 * @param {Object} options
 * @param {bakeWhen} options.bakeWhen
 * @param {getInitialPropsWhen} options.getInitialPropsWhen
 * @returns {React.Component}
 */
export const withBakedInitialProps = (
    PageComponent,
    options = {
        bakeWhen,
        getInitialPropsWhen
    }
) => {
    const BakedInitialPropsPage = (props) => <PageComponent {...props }/>;

    BakedInitialPropsPage.getInitialProps = async(...params) => {
        const [ctx] = params;
        const getBakedInitialProps = PageComponent.getBakedInitialProps || notImplemented;
        const bakeInitialProps = PageComponent.bakeInitialProps || notImplemented;

        const defaultGetInitialPropsWhen = () => {
            return !isExported(ctx);
        };

        const defaultBakeWhen = () => {
            return onExport(ctx);
        };

        if ( options.bakeWhen(defaultBakeWhen(ctx), ctx) || options.getInitialPropsWhen(defaultGetInitialPropsWhen(ctx), ctx) ) {
            const data = await PageComponent.getInitialProps(...params);

            if (options.bakeWhen(defaultBakeWhen(ctx), ctx)) {
                await bakeInitialProps(data, ctx);
            }

            return data;
        }

        return await getBakedInitialProps(...params);
    };

    return BakedInitialPropsPage;
};
