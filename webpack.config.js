
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    entry: './app.js',

    output: {
        filename: 'bundle.js'
    },

    devtool: "source-map",

    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel'
        }]
    },

    plugins: []
};

if (NODE_ENV == 'production') {
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
