
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';
const __DEV__ = (NODE_ENV === 'development');

module.exports = {
    entry: './app/app.js',

    output: {
        filename: 'dist/bundle.js'
    },

    devtool: "source-map",

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel'
        }]
    },

    plugins: [
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(__DEV__)
        })
    ]
};

if (!__DEV__) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}
