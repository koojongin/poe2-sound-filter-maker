const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        main: './src/main/main.ts', preload: './src/main/preload.ts'
    },
    output: {
        filename: '[name].js', path: path.resolve(__dirname, 'dist'),
    },
    target: 'electron-main',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [{
            test: /\.ts$/, exclude: /node_modules/, use: 'ts-loader',
        },],
    },
};