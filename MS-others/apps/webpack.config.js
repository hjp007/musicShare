const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

  devtool: 'inline-source-map',
  //动态读取apps下面的文件夹然后把各个应用附上去
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir)
    const entry = path.join(fullDir, 'app.js')
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ['webpack-hot-middleware/client', entry]
    }
    return entries
  }, {}),

  output: {
    path: path.join(__dirname, '__build__'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/__build__/'
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
      vue: 'vue/dist/vue.js'
    }, 
    extensions: ['.js', '.vue']
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared',
      filename: 'shared.js'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), 
    new webpack.ProvidePlugin({
        $: "jquery",        //个人需要的全局形式
        jQuery: "jquery"  //bootstrap需要的全局形式
    })  //设置在全局变量中   
  ]

}
