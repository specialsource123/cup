const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js', // 애플리케이션 진입점
    output: { // 번들된 파일의 출력 설정
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: { // 로더 설정
        rules: [
            {
                test: /\.(js|jsx)$/, // .js, .jsx 확장자를 가진 파일에 대해
                exclude: /node_modules/, // node_modules 디렉토리는 제외하고
                use: {
                    loader: 'babel-loader', // babel-loader를 사용하여 변환
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'], // babel preset 설정
                    },
                },
            },
            // CSS, 이미지 등의 다른 파일에 대한 로더 설정
        ],
    },
    plugins: [ // 플러그인 설정
        new HtmlWebpackPlugin({
            template: './public/index.html', // 사용할 HTML 템플릿 파일
        }),
    ],
    devServer: { // 개발 서버 설정
        contentBase: './dist', // 서버가 읽을 파일 경로
        port: 3000, // 개발 서버 포트
        historyApiFallback: true, // SPA 라우팅을 위한 설정
    },
};