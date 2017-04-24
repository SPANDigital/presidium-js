var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path:  path.join(__dirname, '../dist'),
        filename: 'presidium.js',
        publicPath: '/'
    },
    module: {
        loaders: [
            {
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015']
                }}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: '/'
    }
};
