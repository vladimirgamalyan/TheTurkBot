
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
    }
};
