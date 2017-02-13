module.exports = {
    entry: __dirname+"/src/scripts/app.js",    //Ҫ���������ļ�
    devtool: "source-map",          //��������
    output: {
        path: __dirname+"/prd/",
        filename: "boudle.js"     //����֮��������ļ�
    },
    module: {   //ģ��
        loaders: [
            {
                test: /\.css$/,     //�������е�css�ļ�
                loader: "style-loader!css-loader"
            },
            {
                test: /\.js$/,      //����ess2015
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
        contentBase:__dirname+"/prd/",      //���ط��������صĵ�ҳ������Ŀ¼
        port:"3000",                //�˿ں�
        //colors:true,                //�ն���������Ϊ��ɫ
        //historyApiFallback:true,    //����ת
        inline:true                 //ʵʱˢ��
    }
    //,
    //plugins:[
    //    new ET("./boudle.css")
    //]
}