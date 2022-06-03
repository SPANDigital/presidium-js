const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CompressionPlugin({
            filename: "[path][name].jgz",
            test: /\.(ts|js)x?$/,
        }),
        new BundleAnalyzerPlugin(),
    ],
}