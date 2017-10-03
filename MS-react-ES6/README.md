# MS-react-ES6
音乐分享平台`react`版本

## 项目说明
项目前端都统一放在 _app_ 文件夹里面

webpack进行自动化构建

webpack目前没有弄热运行，只有编译打包

## 本地测试（关于后台搭建详见根目录的部署说明）
#### 引入依赖包

    npm install

#### 编译打包

	npm run build

#### react版本注意是8082端口

    http://localhost:8082/#/main

## react相关知识点
<pre> 
1. webpack --progress --colors 可在git bash下显示颜色和进度
2. react路由v4.0以上是用react-router-dom,且调用机制与v4.0以下是不一样的
3. react里面css处理必用dom的className属性而不是class，组件局部css需使用react-css-module且局部css用styleName
4. react-router-dom v4的路由跳转用this.props.history.push及withRouter模块
5. 点击事件用onClick={this.toLogin.bind(this, 参数)}
6. react里面所有style属性（也就是内联css）必须改变形式（驼峰，双括号，变字符串）
7. react没有双向数据绑定model，对于input数据只能用onchange监听
8. react没有默认ajax方法，项目里面用的jq
9. react组件最好等dom渲染好后再运行js（componentDidMount替代componentWillMount）
10. react里面条件渲染用内嵌&&或render里写if语句实现，没有ng-if，v-if这样的模板属性
11. react里面列表循环用map实现，依旧没有ng-repeat，v-for这样的模板属性
12. setState是异步方法，且不要直接改this.state的值，用setState改
13. react组件可以直接用function定义，然后父组件里import即可
14. react组件名字的首字母必须大写！且标签里面血法依然用驼峰式，不带'-'
15. react对标签检查很严，必须要有结束符"/"
16. react自定义函数使用时加的bind(this)是为了让其函数定义区域的this一直指向组件
17. react onClick里面不要执行函数，不然就写成(evt)=>myFunction()
18. react 路由路径为'/'是默认主路由，默认包含其他路由所以主路由不要写内容
19. react函数定义间没有逗号，vue函数定义间有逗号
20. react子组件的props.children可以实现组合外部标签
21. react子组件的props.children.filter和属性key使用可以实现多区域外部标签
22. html里面tabindex属性在react里面为tabIndex
23. react定义组件方式2种(createClass已废弃),类定义和函数定义。
24. react函数定义组件里数据是单向流动的，没有state,this这些,一般只用来单向渲染展示DOM
25. react里面带数据处理的组件(比如uploader)用类定义,当然页面父组件也用类定义
26. qiniu服务器端7+版本与6及以下使用方法不一样，这里用的6.1.13版本
27. jq实现form-data上传需要把data序列化,使用processData: false
28. jq上传下载文件获取进度是通过额外创建XHR来监听progress实现的
29. react非父子组件通信我是自建bus对象去进行中间处理，对信息进行注册和分发（subscribe和dispatch）
30. 全局组件的html定义我是放在和Route同级的地方
</pre>