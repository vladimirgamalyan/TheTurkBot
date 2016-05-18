
const webpack = require('webpack');

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

module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true,
            unsafe: true
        }
    })
);
