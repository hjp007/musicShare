# MS-vue-ES6
音乐分享平台`vue`版本

## 项目说明
项目前端都统一放在 _app_ 文件夹里面

webpack进行自动化构建

webpack目前没有弄热运行，只有编译打包

## 本地测试（关于后台搭建详见根目录的部署说明）
#### 引入依赖包

    npm install

#### 编译打包

	npm run build

#### vue版本注意是8081端口

    http://localhost:8081/
    
## vue相关知识点
<pre>
1. 必须要用webpack进行编译打包，每次前端需要运行webpack（未弄热运行）
2. 每个template里面只能有一个父级div。最好加上当页名的class，来设置当页整体的css
3. 路由跳转：this.$router.push
4. ajax：this.$http.get/post 使用了vue-resource这个包
5. webpack里面弄了babel可以使用ES6.
6. 点击：@click
7. dom二元显示：v-if
8. 循环：v-for
9. 双向绑定:v-model
10. url-loader是基于file-loader的，超过limit的图会转文件，没超过则把图变成data-url
11. 引入bootstrap.js时需要引入jq。jq要么在webpack里面配置，要么用require引入，直接import jq会让bootstrap.js找不到全局的jq
12. css中background url照片文件是在js里面require出来再套上去的
13. vue点击阻止事件冒泡：@click.stop
14. vue动态处理class方法是v-bind:class
15. qiniu-js和其依赖plupload是npm可以安装的前端上传的七牛包（注意区别后端包qiniu）
16. 一些中间包如jq，moxie等（其他包会调用），需要提前设置在全局上，webpack.ProvidePlugin里面设置
17. vue子组件定义不是一个实例，所以data形式与vue页面父组件不一样
18. vue子组件被父组件调用时，在父组件单独import然后components里面注册
19. vue子组件获取外部数据是靠props,父组件用v-bind
20. vue动态处理style方法是v-bind:style
21. vue子组件嵌入div方法是标签slot,多个嵌入可以通过给slot的name赋值实现
22. 因为未知bug，七牛前端上传sdk已被废弃。由自写代码form-data post替代
23. v-on缩写为"@",v-bind缩写为":"
24. vue子组件向外传递数据使用$emit,冒泡给父组件用$on来获取
25. 非父子组件通信是通过新建额外的vue实例来使用$emit和$on实现
26. 该项目的messageBox就是用非父子组件通信实现。（messageBox是app级别的全局组件，不被页面组件包含）
27. 纯js可以使用bind(this)来使this指向不改变
28. vue对于静态资源，如果是路径资源需要require，如12条。而是如果是http的资源，则不需require或者其他的操作就可以直接使用
###### 框架机制理解：
1. vue给每个组件模板里的标签给了一个当个组件指定的属性，这个属性组件内是相同的，各个组件则是不同的。如"data-v-1777d4c5",css局部化本质就是在用.list-container[data-v-1777d4c5]:hover
2. vue拥抱经典的 Web 技术,html,css,js三个分离。样式,结构,行为的分离。
3. vue组件的注册不必在全局注册，可局部注册
</pre>

