import webpack from 'webpack'
import config from 'config'
import StringReplacePlugin from 'string-replace-webpack-plugin'
import lost from 'lost'

let webpackConfig = {
    entry: {
        app: [config.__dirname + '/client/js/index.dev.js', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000']
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
    devtool: 'eval-cheap-source-map',
    module: {
        noParse: [/moment.js/],
        loaders: [
            {
                test: /(\.js|\.jsx)$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel?cacheDirectory']
            },
            {
                test: /\.css$/,
                loaders: [ 'style-loader', 'css-raw-loader', 'postcss']
            }
        ]
    },
    postcss() {
        return [lost]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'React': 'react',
            '_': 'lodash'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new StringReplacePlugin()
    ]
}

export default webpackConfig
