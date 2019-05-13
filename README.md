# Next.js Baked getInitialProps
Running multiple api fetches in getInitialProps can get slow. Sometimes you just want to save the results somewhere and fetch that instead. Next.js baked initial props gives you the posibility to save/bake your result to your prefered storage (JSON, or your own storage implementation) and fetch the baked data instead of running your slow getInitialProps again and again.

## Install

```js
npm install --save next-baked-initial-props
```

## Usage with JSON storage
The easiest wat to get started is to use the **withJSONBakedInitialProps** HOC in combination with your Next.js page component.
When you export your Next.js app it will automaticly save a json file containing the result of your getInitialProps function.
The data will be saved to `/out/data/${id}.json` where **id** is a filename derived from the url's pathname.

```js
const Page = ({baked}) => (
  <div>
    { baked }
  </div>
);

// fetch the initial data as usual with Next.js
Page.getInitialProps = (ctx) => {
  return {
    'baked': 'nextjs'
  }
};

// Implemnent the JSON baked HOC
export default withJSONBakedInitialProps(Page)
```

## Overriding the Id
Overriding the Id is as easy as implementing the **defaultBakedInitialPropsIdentifier** callback on your pageComponent.
This mimics the default Identifier for example

```js
//Generate a unique identifier for your page data
Page.defaultBakedInitialPropsIdentifier = (ctx) => {
    if (ctx.asPath === '/') {
        return 'index';
    }
    return ctx.asPath.split('/').slice(1).join('_').toLowerCase();
};
```

## Custom storage implementation
Don't want to use the JSON implementation and need a differen storage? This can be done by using the **withBakedInitialProps** HOC.
This same HOC is used in the JSON implementation.

Example custom JSON implementation with **withBakedInitialProps**

```js

const Page = ({baked}) => (
  <div>
    { baked }
  </div>
);

// fetch the initial data as usual with Next.js
Page.getInitialProps = (ctx) => {
  return {
    'baked': 'nextjs'
  }
};

//Generate a unique identifier for your page data
Page.defaultBakedInitialPropsIdentifier = (ctx) => {
    if (ctx.asPath === '/') {
        return 'index';
    }
    return ctx.asPath.split('/').slice(1).join('_').toLowerCase();
};

//Write the JSON file based on the getInitialProps
Page.bakeInitialProps = async(initialPropsData, ctx) => {
    const id = Page.defaultBakedInitialPropsIdentifier(ctx);
    const fs = require('fs-extra');
    fs.ensureDirSync('out/static/data');
    fs.writeJSONSync(`out/static/data/${id}.json`, initialPropsData);
};

//Fetch the baked props
Page.getBakedInitialProps = async(ctx) => {
    const id = Page.defaultBakedInitialPropsIdentifier(ctx);
    const response = await fetch(`/static/data/${id}.json`);
    const data = await response.json();
    return data;
};

// Implement the base HOC
export default withBakedInitialProps(Page)

```

## Override bake triggers.
Sometimes you want to override the baking functionality for Example prismic.io has a preview feature which would be broken if we always render the baked data.
**withBakedInitialProps** and **defaultBakedInitialPropsIdentifier** have a optional options parameter with following callbacks:
- bakeWhen(defaultValue, ctx) returns a boolean which is true when the baking should happen.
By default it  return's true when running `next export` you could write your own check to let it run on `next build` for example.
- getInitialPropsWhen(defaultValue, ctx) returns a boolean which is true when the intialProps data should be returned instead of the bakedData
By default it return's false after your app is exported. So basicly it would only happen on export.

Example prismic preview implementation:

```js

// when the prismic cookie exists override the baked data and use the getInitialProps value instead.
withJSONBakedInitialProps(Page, {
  getInitialPropsWhen: (defaultValue, ctx) => {
    const onPreview = typeof window !== 'undefined' && document.cookie.indexOf('io.prismic.preview') >= 0
    return defaultValue || onPreview;
  }
})

```
