var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, './app/index.jsx'),
    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '/',
        filename: 'main.js',
        chunkFilename: '[id].[chunkhash].js'
    },
    module: {
        rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                plugins: ['transform-runtime'],
                presets: ['es2015', 'react', 'stage-2']
            }
        },{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        },{ 
            test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/, 
            loader: 'url-loader?limit=1024&name=images/[name].[ext]' 
        }]
    },    
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './app/index.html'),
            inject: true
        }), 
        new webpack.ProvidePlugin({
            $: "jquery/dist/jquery.min.js",
            jQuery: "jquery/dist/jquery.min.js"
        })
    ]
};