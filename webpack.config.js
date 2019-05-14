const packageJson = require('./package.json');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    node: {
        fs: 'empty'
    },
    entry: {
        index: './src/index.js'
    },
    devtool: 'source-map',
    output: {
        filename: '[name].js',
        path: __dirname + '/lib',
        library: packageJson.name,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: 'this'
    },
    externals: {
        fs: 'commonjs fs',
        path: 'commonjs path'
    }
};
