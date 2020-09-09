# test-project
js简易截图工具（后续功能待开发）
demo地址：http://tools.lzhong.wang/tools/screenshot
详情可以看我文章
https://blog.csdn.net/qq_34206004/article/details/108407807

因为是在vue项目上做的，少量用了es6语法，如果不支持es6的项目上需要稍微修改下，写的时候有考虑过这个，所以只需要改引入方式、将class换成es5的构造函数写法、let和const换成var即可。

基于html2canvas要画重点，所以生成图片跟html2canvas的规则是一样的，请熟知html2canvas的特性（比如部分css3不兼容，svg之类的，该怎么处理就按html2canvas的方法处理完再调用）
之前比较懒，所以没做demo，现在终于来了demo（懒出风格，懒出色彩）
下载代码后进入项目根目录执行
npm install
然后运行
npm run serve
