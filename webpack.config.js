'use strict';

module.exports = {
    entry: './index.js',
    output: {
        filename: 'index.js',
        path: './lib',
        library: 'uncaught',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    target: 'node'
};
