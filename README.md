### i 南昌小程序

兼容 微信小程序，支付宝小程序端

### 图片服务器地址

http://10.20.114.168:9000/minio/client-img/inc-miniapp

域名 线上图片地址将 ip 换成 https://api.yunshangnc.com 域名
如 https://api.yunshangnc.com/client-img/inc-miniapp/my/server-6.png

### 组件库

微信小程序组件： "@vant/weapp": "^1.10.3"
支付宝小程序组件："vant-aliapp": "^1.1.2",
uView 组件 https://www.uviewui.com/components/install.html 2.0.33

### 支付宝组件

```
问题修复
mycomponents\vant\__antmove\component\custom-input\custom-input.axml

<view class="input-wrap" onTap='tapHandler' catchTap='catchtapHandler'>
里面给 增加个 class 让使用的地方可以修改样式
```

注意事项：
当你项目中引入 Vant-aliapp 组件库，运行时报‘identifi(arguments) is disallowed in sjs’错误时, 可以取消 IDE 界面 详情 > 启用基础库 2.0 构建的勾选来解决
支付宝上使用 vant 的 checkbox、collapse、dropdown-menu、goods-action、grid、radio、tab、tabbar、index-bar、sidebar 等组件的解决方法，按以下步骤进行：
npm 下载 Antmove 命令行工具
npm install antmove -g

在你的项目根目录下，使用 alipay-compiler 对项目进行转换
antmove -t alipay-compiler

https://github.com/ant-move/Vant-Aliapp
转换后的支付宝小程序即可支持以上组件

### 页面配置

pages.json 中使用条件编译得时候注意
https://uniapp.dcloud.io/tutorial/platform.html#preprocessor

### uniapp 支付宝问题

uniapp 中支付宝小程序导航栏只有设置背景颜色为 #FFF(FFF) 时才会变成黑色文字。

### 下拉刷新， 上拉加载组件

> https://www.mescroll.com/uni.html
