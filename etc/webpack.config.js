var webpack = require('webpack');
var path = require('path');
var buildPath = path.join(__dirname, '../dist');
var buildFileName = 'presidium.js';

module.exports = {
    entry: './src/index.js',
    output: {
        path: buildPath,
        filename: buildFileName,
        publicPath: '/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            PRESIDIUM_VERSION: JSON.stringify(process.env.npm_package_version),
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname, '../src'),
                use: ['react-hot-loader', 'babel-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.css/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'resolve-url'],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=img/[name].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: 'file-loader'
                }
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: {
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
                }
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true // true outputs JSX tags
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        port: 8009,
        overlay: {warnings: true, errors: true},
        hot: true,
        contentBase: '/'
    }
};