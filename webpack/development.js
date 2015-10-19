import webpack from 'webpack';
import config from 'config';
import path from 'path';
import StringReplacePlugin from 'string-replace-webpack-plugin';

let webpackConfig = {
    entry: {
        app: [config.__dirname + '/client/js/index.js', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000']
    },
    resolve: {
        alias: {}
    },
    output: {
        path: config.__dirname + '/client/public/js/',
        publicPath: '/layout/js/',
        filename: '[name].js',
        pathinfo: true
    },
    //devtool: 'eval-cheap-source-map',
    module: {
        noParse: [/moment.js/],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'imports?$=jquery,react', 'babel-loader?cacheDirectory']
            },
            {
                test: /\.styl$/,
                loaders: [ 'style-loader', 'css-loader', 'stylus-loader']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'React': 'react'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new StringReplacePlugin()
    ]
};

export default webpackConfig;
