import webpack from 'webpack'
import config from 'config'
import CompressionPlugin from 'compression-webpack-plugin'

import StringReplacePlugin from 'string-replace-webpack-plugin'

// PostCSS plugins
import autoprefixer from 'autoprefixer'
import lost from 'lost'
import willChange from 'postcss-will-change'
import mqpacker from 'css-mqpacker'
import cssnano from 'cssnano'

export default {
    entry: {
        app: [config.__dirname + '/client/js/index.js']
    },
    output: {
        path: config.__dirname + '/client/public/js/',
        publicPath: `${config.cdn}/layout/js/${config.version}/`,
        filename: '[name].js',
        pathinfo: true
    },
    module: {
        noParse: [/moment.js/],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [StringReplacePlugin.replace({
                    replacements: [{
                        pattern: /\/layout\/images/ig,
                        replacement: m => {
                            return config.cdn + m
                        }
                    }]}), 'babel-loader']
            },
            {
                test: /\.styl$/,
                loaders: [ 'style-loader', StringReplacePlugin.replace({
                    replacements: [{
                        pattern: /\/layout/ig,
                        replacement: m => {
                            return config.cdn + m
                        }
                    }]}), 'css-loader', 'postcss', 'stylus-loader']
            },
            {
                test: /\.css$/,
                loaders: [ 'style-loader', 'css-raw-loader', 'postcss']
            }
        ]
    },
    postcss() {
        return [autoprefixer(({ browsers: 'last 4 version' })), lost, willChange, mqpacker({sort: true}), cssnano({reduceIdents: false})]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            '_': 'lodash'
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
