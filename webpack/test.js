import webpack from 'webpack'
import config from 'config'
import CompressionPlugin from 'compression-webpack-plugin'

import StringReplacePlugin from 'string-replace-webpack-plugin'

// PostCSS plugins
import autoprefixer from 'autoprefixer'
import willChange from 'postcss-will-change'
import mqpacker from 'css-mqpacker'
import cssnano from 'cssnano'
import lost from 'lost'

export default {
    entry: {
        app: [config.__dirname + '/client/js/index.js']
    },
    output: {
        path: config.__dirname + '/client/public/js/',
        publicPath: '/layout/js/',
        filename: '[name].js',
        pathinfo: true
    },
    module: {
        noParse: [/moment.js/],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.styl$/,
                loaders: [ 'style-loader', 'css-loader', 'postcss', 'stylus-loader']
            },
            {
                test: /\.css$/,
                loaders: [ 'style-loader', 'css-raw-loader', 'postcss']
            }
        ]
    },
    postcss() {
        return [autoprefixer(({ browsers: 'last 2 version' })), lost, willChange, mqpacker({sort: true}), cssnano({reduceIdents: false})]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new CompressionPlugin({
            asset: '{file}.gz',
            algorithm: 'gzip',
            regExp: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new StringReplacePlugin()
    ]
}
