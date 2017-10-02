# MS-angular2-ES6
音乐分享平台`angular2`版本

## 项目说明
项目由angular-cli脚手架搭建，项目整体文件可能较大

项目前端主要放在 _src/app_ 文件夹里面

_src/app/assets_ 文件夹里面存放了一些静态文件和外部js文件，这里为了方便jq,bootstrap就直接放这里,然后标签引入了

里面很多像mocha测试，tslint并没有加上

很多文件是脚手架自动构成的

编译打包本质上还是用的webpack

目前没有弄热运行，只有编译打包

## 本地测试（关于后台搭建详见根目录的部署说明）
#### 安装angular2 脚手架工具

	npm install angular-cli -g

#### 引入依赖包

    npm install

#### 编译打包

	npm run build

或者

	ng build

#### 谷歌浏览器进入本地网址，F12调出控制台设置成手机模式

    http://localhost:8083/
    
## angular2相关知识点
<pre>
1. angular2用了ES7的新特性(ES6里没实现),decorator装饰器
2. ES6实现了模板字面量，可用"`"来包含住多行的html
3. typescript是ES6的超集,有ES7及以上的一些特性,直接体现在装饰器和强类型
4. angular2双向绑定[(ngModel)]
5. angular2条件渲染*ngIf
6. angular2循环*ngFor,且形式为let xx of xxx
7. angular2点击事件 (click)
8. angular2单类名选择性绑定[class.类名]="js表达式，返回真或假",(代替1里面的ng-class)
9. app.module.ts里面导入FormsModule后才能使用ngModel等表单模块
10. angular2的组件@Component定义后export class,需要在module的declarations注册
11. angular2的组件用@Input() xx 来接收外部数据,外部调用形式为[xx]="ng变量"
12. angular2路由最好以一个入口文件带router-outlet,然后html里面加baseUrl,本项目入口文件是app.component.ts
13. 项目为了简便,bootstrap与jq是直接标签引入的(项目约定)
14. 项目是由angular-cli脚手架构建,然后加的node后端.前端自动化构建配置在.angular-cli.json里面
15. 自动化工具依然是webpack
16. angular2的模块配置已自动实现局部css,这一点angular和react做不到
17. 页面模块要到app-routing.module里面配置路由,所有模块都要到app.module里面注册(项目约定)
18. 静态全局css和一些其他文件,其他第三方库默认放在assets里面(项目约定)
19. angular2 的ajax是http模块,并且项目中所有ajax单独放到service模块里面,数据用promise获取
20. 项目service里面把各个ajax获取形式，返回形式都进行了整理
21. service模块要在app.module里面用provider注册
22. typescript里面读取object的属性用['xx']会比.xx好
23. 由于强类型，html模板里面用的所有参数变量都要在对应的组件里面提前定义好，不能直接从object里面取，不然会报错，虽然不影响实际效果
24. typescript只要使用"=>"就不用修改this指向。因为"=>"编译时会默认去修改指向
25. angular2 url里面带#(也就是hash),需要在route配置里面添加{ useHash: true }
26. angular2 [ngStyle](代替1里面的ng-style)
27. angular2 (change)来代替1的ng-change
28. angular2 获取点击事件(click)="myFunction($event)"
29. typescript里面写函数回调。函数参数写callback: (xxx:object) => void
30. angular2 关于http模块有2个,一个Http,比较旧,另一个HttpClient比较新并增加了事件进度监听
31. angular2 事件进度监听是用HttpClient里设置reportProgress为true实现的
32. 外部引用包在typescript里面使用需要声明，比如declare var $ : any
</pre>
