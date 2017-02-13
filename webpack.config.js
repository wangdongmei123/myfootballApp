module.exports = {
    entry: __dirname+"/src/scripts/app.js",    //要编译的入口文件
    devtool: "source-map",          //传出配置
    output: {
        path: __dirname+"/prd/",
        filename: "boudle.js"     //编译之后的配置文件
    },
    module: {   //模块
        loaders: [
            {
                test: /\.css$/,     //编译所有的css文件
                loader: "style-loader!css-loader"
            },
            {
                test: /\.js$/,      //解析ess2015
                loader: "babel-loader"
            },
            {
             test: /\.(sass|scss)$/,

             loader:"style-loader!css-loader!sass-loader"

             }

            /*{
                test: /\.sass$/,

                loader:ET.extract({fallbackLoader:'style-loader',loader:'css-loader!sass-loader'})

            }*/
        ]
    },
    devServer:{
        contentBase:__dirname+"/prd/",      //本地服务所加载的的页面所在目录
        port:"3000",                //端口号
        //colors:true,                //终端中输出结果为彩色
        //historyApiFallback:true,    //不跳转
        inline:true                 //实时刷新
    }
    //,
    //plugins:[
    //    new ET("./boudle.css")
    //]
}