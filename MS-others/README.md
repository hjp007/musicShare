# MS-others
音乐分享平台`其它`版本

## 项目说明
这里存放有4种进阶架构方案的前端代码，通过webpack热运行，并且共用一个后台

分别有vue&vuex,react&redux,react native,weex 4种架构方案。

项目前端都统一放在 _apps_ 文件夹里面

webpack目前前端多个app是热运行，并且后台也是热运行的。都在一个热服务器上

## 本地测试（关于后台搭建详见根目录的部署说明）
#### 引入依赖包

    npm install

#### 热运行

	npm run dev

#### vue版本注意是80端口

    http://localhost/

#### 首页会有多个app入口，可以选择进入，包括vuex,redux,react native,weex版本
    
## vuex相关知识点
<pre>
1. vuex 的...mapGetters 是映射路径store.getters.xxx
2. ...语法是超过ES6,ES7的东西，需要配置babelrc里面插件transform-object-rest-spread或者stage-3
3. 项目级别的state数据是全局的，每个组件通过computed里mapGetters获取,初始化并实时监听变化，
mutations改变state里的值的话，computed监听到再实时映射值回组件
总之，一次state值改变是有一次组件与store之间的往返通信
4. 大成功！利用vuex的开源代码环境实现了webpack自动热运行，http,router与热运行无冲突
5. 热运行时vue不能直接import，要在webpack里面配置resolve下的alias换到dist下的文件
</pre>
