# clipScreen
js截图工具（基于html2canvas）

因为是在vue项目上做的，少量用了es6语法，如果不支持es6的项目上需要稍微修改下，写的时候有考虑过这个，所以只需要改引入方式、将class换成es5的构造函数写法、let和const换成var即可。
基于html2canvas要画重点，所以生成图片跟html2canvas的规则是一样的，请熟知html2canvas的特性（比如部分css3不兼容，svg之类的，该怎么处理就按html2canvas的方法处理完再调用）

使用前先安装（或引入）html2canvas:
npm install html2canvas --save

调用方法：
new ClipScreen(dom节点, {
  success: function (res) {},
  complete: function () {},
});
