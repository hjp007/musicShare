//vue，ES6，webpack配置文件

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');  //这个插件可以创建html文件，并自动将依赖写入html文件中。
var webpack = require('webpack'); 

module.exports = {
    // 入口文件，path.resolve()方法，可以结合我们给定的两个参数最后生成绝对路径，最终指向的就是我们的index.js文件
    entry: path.resolve(__dirname, './app/index.js'), 
    // 输出配置
    output: {
        path: path.resolve(__dirname, './build'),
        publicPath: '/',
        filename: 'main.js',
        chunkFilename: '[id].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.vue']
    },
    node: {
        fs: "empty"
    },
    module: {
        
        loaders: [
            // 使用vue-loader 加载 .vue 结尾的文件
            {
                test: /\.vue$/, 
                loader: 'vue-loader'   
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?presets=es2015',
                exclude: /node_modules/
            }, 
            {
                test: /\.css$/, 
                use: [ 'style-loader', 'css-loader' ]
            },
            { 
                test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,       //这里要加上音乐文件 
                loader: 'url-loader?limit=1024&name=images/[name].[ext]' 
            }
        ]
    }, 
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './app/index.html'),
            inject: true
        }), 
        new webpack.ProvidePlugin({
            $: "jquery",        //个人需要的全局形式
            jQuery: "jquery"  //bootstrap需要的全局形式
        })  //设置在全局变量中    
    ]
}