import webpack from 'webpack';
import config from 'config';
import CompressionPlugin from 'compression-webpack-plugin';

// PostCSS plugins
import autoprefixer from 'autoprefixer';
import willChange from 'postcss-will-change';
import mqpacker from 'css-mqpacker';
import cssnano from 'cssnano';

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
                loaders: ['react-hot', 'babel-loader']
            },
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader'
            }
        ]
    },
    postcss() {
        return [autoprefixer, willChange, mqpacker, cssnano];
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
        })
    ]
};
