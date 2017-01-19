var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path:  path.join(__dirname, '../presidium-core/assets/shared/js/'),
        // path:  path.join(__dirname, '../test'),
        filename: 'presidium.js'
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
