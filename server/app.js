

var express = require('express');
var proxy = require('http-proxy-middleware');


var AipOcrClient = require("baidu-aip-sdk").ocr;
// 设置APPID/AK/SK
var APP_ID = "10605675";
var API_KEY = "q8HuYnv247c8OIVGiyHY45CP";
var SECRET_KEY = "v28Ps2K1qqFkrQoSaQ8PDWnGLrNPDVyv";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

var HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({timeout: 5000});

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function(requestOptions) {
    // 查看参数
    console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
});


var fs = require('fs');

get1 = function(res){
  var image = fs.readFileSync("/Users/zhuenqing/workspace/EDUCATION/vue-163-music/server/static/img/WechatIMG9.jpeg").toString("base64");

  // 调用通用文字识别, 图片参数为本地图片
  client.generalBasic(image).then(function(result) {
      console.log(JSON.stringify(result));
  }).catch(function(err) {
      // 如果发生网络错误
      console.log(err);
  });
  
  // 如果有可选参数
  var options = {};
  options["language_type"] = "CHN_ENG";
  options["detect_direction"] = "true";
  options["detect_language"] = "true";
  options["probability"] = "true";
  
  // 带参数调用通用文字识别, 图片参数为本地图片
  client.generalBasic(image, options).then(function(result) {
      console.log(JSON.stringify(result));
      res.send(JSON.stringify(result));

  }).catch(function(err) {
      // 如果发生网络错误
      console.log(err);
  });;
}

get2=function(){
  var url = "https//www.x.com/sample.jpg";

  // 调用通用文字识别, 图片参数为远程url图片
  client.generalBasicUrl(url).then(function(result) {
      console.log(JSON.stringify(result));
  }).catch(function(err) {
      // 如果发生网络错误
      console.log(err);
  });
  
  // 如果有可选参数
  var options = {};
  options["language_type"] = "CHN_ENG";
  options["detect_direction"] = "true";
  options["detect_language"] = "true";
  options["probability"] = "true";
  
  // 带参数调用通用文字识别, 图片参数为远程url图片
  client.generalBasicUrl(url, options).then(function(result) {
      console.log(JSON.stringify(result));
  }).catch(function(err) {
      // 如果发生网络错误
      console.log(err);
  });;
}






var app = express();
app.use('/static', express.static('static'));
app.use('/api', proxy({
  target: 'http://music.163.com', 
  changeOrigin: true, 
  headers: {
    Referer: 'http://music.163.com/'
  }
}
));

app.use('/newapi', proxy({
  target: 'http://localhost:3006/', 
  changeOrigin: true, 
  pathRewrite: {'^/newapi' : '/'}
}
));




app.get('/an', function (req, res) {
  console.log("/an1")

   x=get1(res)
  console.log("/an")
  // res.send(co.next());
  

})


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
var server = app.listen(3000,function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
});

