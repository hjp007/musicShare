# MS-angular
音乐分享平台`angular`版本

## 项目说明
项目前端都统一放在 _app_ 文件夹里面

## 本地测试（关于后台搭建详见根目录的部署说明）
#### 引入依赖包

    npm install
    
#### 谷歌浏览器进入本地网址，F12调出控制台设置成手机模式

    http://localhost:8080/
    
## angular相关知识点
<pre>
1. 额外使用了ng-style动态设置css的number值，ng-class动态改变class属性选择
2. angular必须使用angular-css才能实现局部css。angular，vue，react里面只有vue自带实现了局部css功能
3. 该项目没有使用自动化构建工具，没有使用ES6
4. angular路由跳转：$state.go
5. angular点击：ng-click
6. angular条件渲染：ng-if ng-show ng-hide
7. angular循环：ng-repeat
8. angular双向数据绑定：ng-model
9. angular的本地缓存存储形式与html5自带的有些不同，但原理是一样的
10. 项目使用了bootstrap相关的navbar(导航条)、progress(进度条)、panel、modal(拟态框)、navtab、button、list-group-item、栅格系统和一些基础的css样式
11. 七牛云把id套在button上可实现手机端上传（原来放在a标签是不行的）
12. angular1.6+里面的路由有!#，个人建议用低版本
13. angular directive可实现组件化。项目里把导航条进一步封装成组件，调用极其方便
14. angular directive组件设置以自定义标签和属性为主，数据流需要scope里面设置"="
15. html里属性不能用驼峰式，驼峰式会转成带“-”形式
16. angular css也实现了directive局部css
17. 上传原理是用form-data形式进行post。
18. angular1.5.5版本及以后$http会有eventHandlers和uploadEventHandlers来检测上传进度,且该handler已经在处理脏数据了所以不需要apply
19. 七牛云可不用其上传工具包，可以自己获取token后post到https://up.qbox.me/
20. angular directive组件可以使用angular模块，可以用link来定义变量或函数。
21. angular directive的replace为true时自定义标签会消失，但如果restrict里面有A的话自定义标签的属性会顺延给模板最外层的div
22. onclick里面写angular.element(this).scope()可以达到与ng-click一样效果
23. 文件上传按钮(input type=file)的样式很难自定义，可以隐藏它然后用一个按钮来触发这个按钮
24. angular directive里ng-transinclude可以多个嵌入
###### 知识点清单创建于2017.9.7 当日重构了该项目前端所有html+css并适应移动端开发
</pre>