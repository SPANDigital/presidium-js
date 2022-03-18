var webpack = require('webpack')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'presidium.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: '/'
    },
    plugins: [
        new webpack.DefinePlugin({
            PRESIDIUM_VERSION: JSON.stringify(process.env.npm_package_version),
            'process.env.NODE_ENV': JSON.stringify('production')

        }),
        new UglifyJsPlugin()
    ]
};
