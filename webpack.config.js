var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

// https://blog.csdn.net/maomaolaoshi/article/details/78741007

module.exports = {
    devtool: 'eval-source-map',
    // entry: [
    //     path.join(__dirname, 'index.js')
    // ],
    entry:
    {
        'index':path.join(__dirname, 'index.js'),
        'user':['./client/scripts/base.js','./client/scripts/user.js'],
        'm':['./client/scripts/main.js']
    },
   
    output: {
        path: path.join(__dirname, '.tmp/'),  //这儿好像没起作用
        filename: '[name].js', //输出文件名，[name].js默认是main.js。如果指定则是指定名
        publicPath: '.tmp/',
        chunkFilename: "[chunkhash].js"
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //   template: './index.tpl.html',
        //   inject: 'body',
        //   filename: './index.html'
        // }),
        // new CommonsChunkPlugin('common'),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoErrorsPlugin(),
        // new webpack.DefinePlugin({
        //   'process.env.NODE_ENV': JSON.stringify('development')
        // })
    ],
    module: {
        // resolve:{
        //     extensions:['','.js','.json']
        // },        
        // loaders: [
        //     {
        //       test: /\.js$/,
        //       exclude: /node_modules/,
        //       loader: "babel-loader",
        //       query:
        //         {
        //           presets:['es2015']
        //         }
        //     },
        //     {
        //         test: /\.json?$/,
        //         loader: 'json'
        //     },
        //     {
        //         test: /\.css$/,
        //         loader: "style!css"
        //     },
        //     {
        //         test: /\.less/,
        //         loader: 'style-loader!css-loader!less-loader'
        //     }
        // ]
    }
};

