var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

// https://blog.csdn.net/maomaolaoshi/article/details/78741007
// 打包思路：可以把库文件打包在一个文件中；把公共不变文件打包到一个文件中
// https://webpack.js.org/configuration/  官网配置
// webpack在gulpfile中引用，则读取不到插件
module.exports = {
    // mode: "production", 
    devtool: 'eval-source-map',
    entry:
    {
        'index':path.join(__dirname, 'index.js'),
        'user':['./client/scripts/base.js','./client/scripts/user.js'],
        'm':['./client/scripts/main.js'],
        'common':['./client/scripts/common.js'],
        'login':['./client/scripts/login.js']
    },
   
    output: {
        path: path.join(__dirname, '.tmp/'),  //这儿好像没起作用
        filename: '[name].js', //输出文件名，[name].js默认是main.js。如果指定则是指定名
        publicPath: '.tmp/',
        chunkFilename: "[chunkhash].js"
    },
    module: {
        rules:[
             {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, "app")
                ],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                loader: "babel-loader",
                options: {
                    presets: ["es2015"]
                },
             },
             {
                test: /\.css$/,
                loader: "style!css"
             },
             {
                test: /\.json?$/,
                loader: 'json'
             },
             {
                test: /\.less/,
                loader: 'style-loader!css-loader!less-loader'
             }
            //  {
            //     test: /\.html$/,
            //     use: [
            //         "htmllint-loader",
            //         {
            //             loader: "html-loader",
            //             options: {
            //             }
            //         }
            //     ]
            // },
        ]      
    },
     resolve: {
        // options for resolving module requests解决模块请求的选项。
        // 查找模块的目录
        extensions: [".js", ".json", ".jsx", ".css"],
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //   template: './index.tpl.html',
        //   inject: 'body',
        //   filename: './index.html'
        // }),
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.DefinePlugin({
        //    'VERSION': JSON.stringify("5fa3b9"),
        //    'NICE_FEATURE': JSON.stringify(true),
        // })

    ],
    // watch: true
    
};

