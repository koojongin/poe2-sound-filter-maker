const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/renderer/render.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/renderer'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'), // '@'를 src 폴더로 매핑
        },
        fallback: {
            fs: require.resolve('browserify-fs'), // Or use 'fs-extra'
            path: require.resolve('path-browserify')
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/, // CSS 파일 처리
                use: [
                    'style-loader',  // CSS를 <style> 태그로 삽입
                    'css-loader',    // CSS 파일을 JavaScript로 변환
                    'postcss-loader' // Tailwind를 처리
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',  // TypeScript 파일을 번들링
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        watchFiles: {
            paths: ['src/**/*', 'public/**/*'],
        },
        static: path.join(__dirname, 'dist'),
        port: 3000,  // React 개발 서버 포트
        hot: true,  // 핫 리로딩
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',  // HTML 템플릿
        }),
    ],
    mode: 'production',  // 개발 모드
};