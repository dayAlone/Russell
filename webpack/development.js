import webpack from 'webpack';
import config from 'config';


// PostCSS plugins
import autoprefixer from 'autoprefixer';
import willChange from 'postcss-will-change';
import mqpacker from 'css-mqpacker';

export default {
    entry: {
        app: [config.__dirname + '/client/js/index.js', 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000']
    },
    output: {
        path: config.__dirname + '/client/public/js/',
        publicPath: '/layout/js/',
        filename: '[name].js',
        pathinfo: true
    },
    //devtool: '#source-map',
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
        return [autoprefixer];//, willChange, mqpacker];
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
