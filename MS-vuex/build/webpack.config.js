const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const apps_dir = path.resolve(__dirname, '../apps')
const myApp_dir = path.resolve(__dirname, '..')

const HtmlWebpackPlugin = require('html-webpack-plugin'); 

module.exports = {
  	//动态读取apps下面的文件夹然后把各个应用附上去
  	entry: fs.readdirSync(apps_dir).reduce((entries, dir) => {
	    const fullDir = path.join(apps_dir, dir)
	    const entry = path.join(fullDir, 'app.js')
	    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
	      entries[dir] = entry
	    }
	    return entries
	  }, {}),
    output: {
        path: path.resolve(myApp_dir, './dist'),
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
    	rules: [
      		{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      		{ test: /\.vue$/, loader: 'vue-loader' }, 
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
	resolve: {
	    alias: {
	      'vue' : 'vue/dist/vue.js', 
	      '@'   : path.join(apps_dir, 'MS-vuex-ES6')
	    }, 
	    extensions: ['.js', '.vue']
	},
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(apps_dir, 'MS-vuex-ES6/index.html'),
            inject: true
        }), 
        new webpack.ProvidePlugin({
            $: "jquery",        //个人需要的全局形式
            jQuery: "jquery"  //bootstrap需要的全局形式
        })  //设置在全局变量中    
    ]
}