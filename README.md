<img width="464" src="https://i.loli.net/2020/07/01/AmsnawZ29RbUqk8.png">

即时通讯应用, 包含[服务端](https://github.com/hezhongfeng/im-server)、[管理端](https://github.com/hezhongfeng/im-fe-admin)和[客户端](https://github.com/hezhongfeng/im-fe-client)

现已部署上线，欢迎体验[客户端](https://im-client.hezf.online/)和[管理端](https://im-admin.hezf.online/)

**请不要随意更改默认角色和权限，请有点爱心，别整一些很不文明的名字**

## 介绍

使用 egg 框架，IM 服务的服务端

## 功能简介

1. 注册，登录，个人、群组聊天，个人信息编辑等基础功能
2. 申请添加好友和申请入群
3. 表情，图片，视频，定位信息支持
4. 聊天会话列表记录
5. 消息记录（微信的消息记录真实一言难尽）
6. 支持多点同时登录
7. 百度 UNIT 机器人自动聊天
8. 支持 github 一键登录
9. 管理端，进行角色和权限的管理，群状态管理（我也当一回马化腾）

## 需求简介

移动互联网发展至今，以微信为首的即时通讯服务已经融入了我们生活中的各个角落，在公司的一些业务中也扮演着重要的角色，对于即时通讯我们公司原来是使用的环信的服务，但是有很多定制化的需求无法实现，所以后来决定内部开发一个满足定制化需求的即时通讯微服务。

使用`socket.io`框架是因为当时后端缺人，加上看了一些例子后觉得使用起来真的很方便，而且全平台支持，所以这个微服务就在前端团队进行落地实践，目前效果还不错。

社区目前这方面的内容比较少或者太简陋（只有一个公共的聊天室这种）。另外就是在业务开发过程中被 PM 搞得很难受，所以想脱离一些特有的业务上的东西，实现一个功能简单五脏俱全的不掺杂公司业务的 IM 应用,包含服务端，管理端和客户端。客户端的模仿对象是微信，因为我很熟悉，不用在产品上面思考太多，另外就是试用的人很熟悉，不需要太多的沟通成本。

## 框架简介

要开发一套完整的即时通讯服务，需要以下部分：

1. 服务端：用来实现基础的服务接口和数据持久化
2. 客户端：完成登录、聊天等基础功能，类似微信
3. 管理端：管理群组、用户和角色权限

### server

> 为企业级框架和应用而生

选用阿里的 egg.js 框架做支撑，看中的原因是他们内部大规模的落地和安全方面做得比较好，没有选择 nest 的原因是集成 `socket.io` 比较麻烦，ORM 选用 sequelize，数据库是 mysql ,之前一起使用过，上手难度小

### admin

> 开箱即用的中台前端/设计解决方案

选择 Ant Design Pro 作为模板开发管理端，选用的原因是我对 Vue 全家桶比较熟悉，想借着这个机会熟悉下整套 React 生态 的开发流程，感受下目前国内两大开发框架的本质区别和殊途同归，Ant Design Pro 已经发布了好几年了，也的确给中小型企业带来效率的提升，也正好适合我这的需求。

### client

> 🛠️ Vue.js 开发的标准工具

使用 @vue/cli 搭建 IM 服务的客户端，一个移动端的 H5 项目，UI 框架使用的有赞 vant，集成了我的开源组件[vue-page-stack](https://github.com/hezhongfeng/vue-page-stack)和黄老师的[better-scroll](https://github.com/ustbhuangyi/better-scroll)，实现 IM 的基础功能

## 实体关系

作为一个前端工程师，大多数的日常工作是不需要思考实体关系的。但是，就我的实际体验来看，懂得实体关系可以帮助我们更好的理解业务模型。而对产品和业务理解的提升对我们的帮助是非常大的，可以在需求评审的时候发现很多不符合逻辑的地方（怎么又要吐槽产品经理了），这时候能提出来就会主动避免我们在后续的过程中进行反复开发，同时可以和产品侧的同学形成比较良好的互动（而不是互怼）。下面简单罗列下比较重要的实体关系：

<img width="600" src="https://i.loli.net/2020/07/14/Zhz85V2ptOylDcj.png">

通过上图可以看到 user 是整个关系图中的核心，下面介绍下各个实体之间的关系：

1. user 和 user_info(用户信息) 是一对一的关系
2. user 和 role(角色)是多对多的关系
3. role 和 right(权限)是多对多的关系
4. user 和 apply(申请)是多对多的关系，申请都是涉及到两个 user（申请人和被申请人）
5. user 和 group(群组)是多对多的关系
6. group 和 conversation(会话) 是一对一的关系
7. friend 和 conversation(会话) 是一对一的关系
8. conversation 和 message(消息)是 1 对多的关系
9. friend(好友关系) 和 user 没有直接关系，friend 由两个 user 确定

下面详细介绍下会话、角色与权限：

### 会话

完成一个即时通讯应用，需要考虑的第一个事情就是会话，就是我们微信里面的对话窗口。思考会话和消息、用户、群组之间的关系花费了不少的精力，最终形成以下的基本关系：

1. 2 个用户参与的聊天属于建立了 Friend 关系（互为好友）
2. 多个用户参与的聊天组成了群组关系
3. Friend 和会话之间的关系是 1 对 1 的关系，可以通过 Friend 找到此 Friend 的会话，也可以通过会话确定 Friend
4. 群组和会话之间的关系是 1 对 1 的关系，可以通过群组找到此群组的会话，也可以通过会话确定群组
5. 消息属于某个会话，可以根据会话查看对应的消息列表
6. 保存消息的时候更新会话的激活时间，用户的会话列表根据激活时间排序，也就是最近的会话再最前面

也就是说，用户和会话没有直接的关系，只能通过用户对应的单聊和群聊去获取会话，这样做可以有以下的好处：

1. 无论是单聊还是群聊，连接上的用户只要 join 进对应的会话 room 里面就可以，消息也是在对应的 room 里面发布
2. 无论是单聊还是群聊，消息的保存和查询都比较简单，都是只针对这个会话
3. 获取个人的会话列表也变得很简单，用户的会话列表通过查询用户『所有的 Friend 和群组』->『所有的会话』->『排序会话(根据激活时间)』，就可以获取

### 角色和权限

为了设计一个灵活、通用、方便的权限管理系统，本系统采用 RBAC（基于角色的访问控制）控制，来设计一个通用的『用户角色权限』平台，方便后期扩展。

#### RBAC

RBAC（基于角色的访问控制）是指用户通过角色与权限进行关联。即一个用户拥有若干角色，每一个角色拥有若干权限(当然了，别把冲突的角色和权限配在一起)。这样，就构造成“用户—角色—权限”的授权模型。在这种模型中，用户与角色之间、角色与权限之间，一般是多对多的关系。

#### 本系统默认的角色和权限

本系统默认有管理员、一般用户、禁言用户和封禁用户这几种角色，给不同的角色分配不同的权限，所以需要针对管理和发言等接口路由做一下统一的鉴权（通过中间件的方式）处理，具体方式和方法在后端项目中会详细说明。本系统暂时采用预先定义了角色和权限的方式，后续想要扩展的话可以编辑角色和权限。

#### 管理员

没见过微信的管理端，但是可以想象一下，管理员可以配置用户的角色和权限，可以编辑群组的状态：

1. 登录的权限
2. 群组状态的编辑
3. 针对用户的角色和权限的编辑

#### 普通用户

注册登录后，可以正常的添加好友和加入群组，可以修改个人基础信息和处理申请

1. 注册登录
2. 编辑个人基础信息
3. 添加好友，申请入群
4. 处理好友申请和入群申请
5. 聊天

#### 禁言用户

1. 注册登录
2. 编辑个人基础信息
3. 添加好友，申请入群
4. 处理好友申请和入群申请

#### 封禁用户

无法登录

#### 角色的组合

举个例子：现在有一个新版的个人中心需要上线测试，首先新建一个角色『测试个人中心』，再给这个角色分配对应的权限；然后给普通用户做个分组，选出一些人配置上这个角色，这样就可以进行测试了。

## 即时通讯原理

下面说下即时通讯服务的核心通讯原理，和一般的 http 服务一样，有一个服务端和客户端进行通讯，只不过详细的协议和处理方式不一样。

### WebSocket

由于历史原因，现在主流的 http 协议是无状态协议（HTTP2 暂时应用不广泛），一般情况是由客户端主动发起请求，然后服务端去响应。那么为了实现服务端向客户端推送信息，就需要前端主动向后端去轮询，这种方式低效且容易出错,在之前我们的管理端首页确实是这么做的（5s 一次）。

为了实现这种服务端主动推送信息的需求， HTML5 开始提供一种在单个 TCP 连接上进行全双工通讯的协议，也就是 WebSocket。WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。WebSocket 协议在 2008 年诞生，2011 年成为国际标准，目前绝大部分浏览器都已经支持了。

![](https://i.loli.net/2020/07/14/hUcq98xWCi3loVb.png)

WebSocket 的用法相当简单:

```
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) {
  console.log("Connection open ...");
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};
```

有了 WebSocket 协议让服务端主动推送信息有了先进的武器，那么有没有什么方式可以兼容新旧浏览器呢？其实很多人想到了这点，答案就是`socket.io`

### `socket.io`

`socket.io`进一步封装了`WebSocket`的接口，而且可以在旧版本浏览器中自主切换到使用轮询的方式进行通讯（我们使用者是不会感知的），形成了一套统一的接口，大大减轻了开发的负担。主要具有以下优点：

1. 封装出了一套非常易用的接口，前后端统一，使用非常简单
2. 全平台支持（原生和 H5，微信小程序中也有对应的实现）
3. 自适应浏览器，在比较老的浏览器中主动切换使用轮询的方式，不需要我们自己搞轮询

[这是 socket.io 主页](https://socket.io/)

> 最快，最可靠的即时通讯引擎(FEATURING THE FASTEST AND MOST RELIABLE REAL-TIME ENGINE)

使用起来真的很简单：

```
var io = require('socket.io')(80);
var cfg = require('./config.json');
var tw = require('node-tweet-stream')(cfg);
tw.track('socket.io');
tw.track('javascript');
tw.on('tweet', function(tweet){
  io.emit('tweet', tweet);
});
```

## server 端详细说明

着重讲下 Server 端项目中我认为几个重要的点，大部分内容需要去 egg [官网](https://eggjs.org/zh-cn/)查看。

使用脚手架`npm init egg --type=simple`初始化 server 项目，安装 mysql（我的是 8.0 版本），配置上 sequelize 所需的数据库链接密码等，就可以启动了

```
// 目录结构说明

├── package.json // 项目信息
├── app.js // 启动文件，其中有一些钩子函数
├── app
|   ├── router.js // 路由
│   ├── controller
│   ├── service
│   ├── middleware // 中间件
│   ├── model // 实体模型
│   └── io // socket.io 相关
│       ├── controller
│       └── middleware // io独有的中间件
├── config // 配置文件
|   ├── plugin.js // 插件配置文件
|   └── config.default.js // 默认的配置文件
├── logs // server运行期间产生的log文件
└── public // 静态文件和上传文件目录
```

## 路由

Router 主要用来描述请求 URL 和具体承担执行动作的 Controller 的对应关系，即 `app/router`

1. 路由使用了版本号 v1，方便以后升级，一般的增删改查直接使用 restful 的方式比较简单
2. 除了登录和注册的接口，在其余所有 http 接口添加了对 session 的检查，校验登录状态，位置在`app/middleware/auth.js`
3. 在所有管理端的接口处添加了对 admin 权限的检查，位置在`app/middleware/admin.js`

## 统一鉴权

因为本系统预设有管理员和一般通信用户的不同角色，所以需要针对管理和通信的接口路由做一下统一的鉴权处理。

比如管理端的路由`/v1/admin/...`，想在这个系列路由全都添加管理员的鉴权，这时候可以用中间件的方式进行鉴权，下面是在 admin router 中使用中间件的具体例子

```
// middware
module.exports = () => {
  return async function admin(ctx, next) {
    let { session } = ctx;

    // 判断admin权限
    if (session.user && session.user.rights.some(right => right.keyName === 'admin')) {
      await next();
    } else {
      ctx.redirect('/login');
    }
  };
};

// router
const admin = app.middleware.admin();
router.get('/api/v1/admin/rights', admin, controller.v1.admin.rightsIndex);
```

## 数据库相关

使用的 sequelize+mysql 组合，egg 也有 sequelize 的相关插件，[sequelize](https://sequelize.org/v5/) 即是一款 Node 环境使用的 ORM，支持 Postgres, MySQL, MariaDB, SQLite 和 Microsoft SQL Server，使用起来还是挺方便的。需要先定义模型和模型直接的关系，有了关系之后便可以使用一些预设的方法了。

### model 实体模型

模型的基础信息比较容易处理，需要注意的就是实体之间的关系设计，即 associate，下面是 user 的关系描述

```
// User.js
module.exports = app => {
  const { STRING } = app.Sequelize;

  const User = app.model.define('user', {
    provider: {
      type: STRING
    },
    username: {
      type: STRING,
      unique: 'username'
    },
    password: {
      type: STRING
    }
  });

  User.associate = function() {
    // One-To-One associations
    app.model.User.hasOne(app.model.UserInfo);

    // One-To-Many associations
    app.model.User.hasMany(app.model.Apply);

    // Many-To-Many associations
    app.model.User.belongsToMany(app.model.Group, { through: 'user_group' });
    app.model.User.belongsToMany(app.model.Role, { through: 'user_role' });
  };

  return User;
};
```

### 一对一

例如 user 和 userInfo 的关系就是一对一的关系，定义好了之后，我们在新建 user 的时候就可以使用 `user.setUserInfo(userInfo)`了，想获取此 user 的基础信息的时候也可以通过`user.getUserInfo()`

### 一对多

User 和 Apply（申请）的关系就是一对多，即一个用户可以对应多个自己的申请，目前只有好友申请和入群申请:

添加申请的时候可以`user.addApply(apply)`，获取的时候可以这样获取：

```
const result = await ctx.model.Apply.findAndCountAll({
  where: {
    userId: ctx.session.user.id,
    hasHandled: false
  }
});
```

### 多对多

user 和 group 的关系就是多对多，即一个用户可以对应多个群组，一个群组也可以对应多个用户，这样 sequelize 会建立一个中间表 user_group 来实现这种关系。

一般我这么使用：

```
group.addUser(user); // 建立群组和用户的关系
user.getGroups(); // 获取用户的群组信息
```

### 需要注意的点

1. sequelize 的所有操作都是基于 Promise 的，所有大多时候都使用 await 进行等待
2. 修改了某个模型的实例的某个属性后，需要进行 save
3. 当我们需要把模型的数据进行组合后返回给前端的时候，需要通过 get({plain: true})这种方式，转化成数据，然后再拼接，例如获取会话列表的时候

## socketio

egg 提供了 egg-socket.io 插件，需要在安装 egg-socket.io 后在 config/plugin.js 开启插件，io 有自己的中间件和 controller

### socketio 的路由

io 的路由和一般的 http 请求的不太一样，注意这里的路由不能添加中间件处理（我没成功），所以禁言处理我是在 controller 里面处理的

```
// 加入群
io.of('/').route('/v1/im/join', app.io.controller.im.join);
// 发送消息
io.of('/').route('/v1/im/new-message', app.io.controller.im.newMessage);
// 查询消息
io.of('/').route('/v1/im/get-messages', app.io.controller.im.getMessages);
```

注意：我把群组和好友关系都看做是一个 room（也就是一个会话），这样就是直接向这个 romm 里面发消息，里面的人都可以收到

### socketio 的中间件

有两个默认的中间件，一个是连接和断开时候调用的 connection Middleware，这里用来校验登录状态和处理业务逻辑了；另外一个是每次发消息时候调用的 packet Middleware，这里用来打印 log

由于预设了禁言权限，在 controller 里面进行处理

```
// 对用户发言的权限进行判断
if (!ctx.session.user.rights.some(right => right.keyName === 'speak')) {
  return;
}
```

## 聊天

聊天分为单聊和群聊，聊天信息暂时有一般的文字、图片、视频和定位消息，可以根据业务扩展为订单或者商品等

### 消息

message 的结构设计参考了几家第三方服务的设计，也结合本项目自身的情况做了调整，可以随意扩展，做如下说明：

```
const Message = app.model.define('message', {
  /**
    * 消息类型：
    * 0:单聊
    * 1:群聊
    */
  type: {
    type: STRING
  },
  // 消息体
  body: {
    type: JSON
  },
  fromId: { type: INTEGER },
  toId: { type: INTEGER }
});
```

body 里面存放的是消息体，使用 json 用来存放不同的消息格式：

```
// 文本消息
{
  "type": "txt",
  "msg":"哈哈哈" //消息内容
}
```

```
// 图片消息
{
  "type": "img",
  "url": "http://nimtest.nos.netease.com/cbc500e8-e19c-4b0f-834b-c32d4dc1075e",
  "ext":"jpg",
  "w":360,    //宽
  "h":480,    //高
  "size": 388245
}
```

```
// 视频消息
{
  "type": 'video',
  "url": "http://nimtest.nos.netease.com/cbc500e8-e19c-4b0f-834b-c32d4dc1075e",
  "ext":"mp4",
  "w":360,    //宽
  "h":480,    //高
  "size": 388245
}
```

```
// 地理位置消息
{
  "type": "loc",
  "title":"中国 浙江省 杭州市 网商路 599号",    //地理位置title
  "lng":120.1908686708565,        // 经度
  "lat":30.18704515647036            // 纬度
}
```

## 定时任务

当前只有一个，就是更新 baidu 的 token，这里还算简单，参考官方文档即可

## 机器人聊天

> 智能对话定制与服务平台 UNIT

这个还是挺有意思的，可以在 `https://ai.baidu.com/` 新建机器人和添加对应的技能，我这里是闲聊，还有智能问答等可以选择

1. 新建机器人，管理机器人的技能，至少一个
2. 前往百度云"应用列表"中创建、查看 API Key / Secret Key
3. 在 config.default.js 中配置 baidu 相关参数，相关接口说明在[这里](https://ai.baidu.com/ai-doc/UNIT/qk38gggxg)

如果不想启动可以在 app.js 和 app/schedule/baidu.js 中删除 `ctx.service.baidu.getToken();`

### 上传文件

首先需要在配置文件里面进行配置，我这里限制了文件大小，饼跨站了 ios 的视频文件格式：

```
config.multipart = {
  mode: 'file',
  fileSize: '3mb',
  fileExtensions: ['.mov']
};
```

使用了一个统一的接口来处理文件上传，核心问题是文件的写入，files 是前端传来的文件列表

```
for (const file of ctx.request.files) {
  // 生成文件路径，注意upload文件路径需要存在
  const filePath = `./public/upload/${
    Date.now() + Math.floor(Math.random() * 100000).toString() + '.' + file.filename.split('.').pop()
  }`;
  const reader = fs.createReadStream(file.filepath); // 创建可读流
  const upStream = fs.createWriteStream(filePath); // 创建可写流
  reader.pipe(upStream); // 可读流通过管道写入可写流
  data.push({
    url: filePath.slice(1)
  });
}
```

我这里是存储到了 server 目录的`/public/upload/`，这个目录需要做一下静态文件的配置：

```
config.static = {
  prefix: '/public/',
  dir: path.join(appInfo.baseDir, 'public')
};
```

### passport

这个章节的 egg 官方文档，要你的命，例子啥也没有，一定要去看源码，太坑人了，我研究了很久才弄明白是怎么回事。

因为我想更自由的控制账户密码登录，所以账号密码登录并没有使用 passport，使用的就是普通的接口认证配合 session。

下面详细说下使用第三方平台（我选用的是 GitHub）登录的过程：

1. 在[GitHub OAuth Apps](https://github.com/settings/applications/new)新建你的应用，获取 key 和 secret
2. 在项目安装 egg-passport 和 egg-passport-github

开启插件：

```
// config/plugin.js
module.exports.passport = {
  enable: true,
  package: 'egg-passport',
};

module.exports.passportGithub = {
  enable: true,
  package: 'egg-passport-github',
};
```

3. 配置：

```
// config.default.js
config.passportGithub = {
  key: 'your_clientID',
  secret: 'your_clientSecret',
  callbackURL: 'http://localhost:3000/api/v1/passport/github/callback' // 注意这里非常的关键，这里需要和你在github上面设置的Authorization callback URL一致
};
```

4. 在 app.js 中开启 passport

```
this.app.passport.verify(verify);
```

5. 需要设置两个 passport 的 get 请求路由，第一个是我们在 login 页面点击的请求，第二个是我们在上一步设置的 callbackURL，这里主要是第三方平台会给我们一个可用的 code，然后根据 OAuth2 授权规则去获取用户的详细信息

```
const github = app.passport.authenticate('github', { successRedirect: '/' }); // successRedirect就是最后校验完毕后前端会跳转的路由，我这里直接跳转到主页了
router.get('/v1/passport/github', github);
router.get('/v1/passport/github/callback', github);
```

6. 这时候在前端点击`/v1/passport/github`会发起 github 对这个应用的授权，成功后 github 会 302 到`http://localhost:3000/v1/passport/github/callback?code=12313123123`，我们的 githubPassport 插件会去获取用户在 github 上的信息，获取到详细信息后，我们需要在 `app/passport/verify.js` 去验证用户信息，并且和我们自身平台的用户信息做关联，也要给 session 赋值

```
// verify.js
module.exports = async (ctx, githubUser) => {
  const { service } = ctx;
  const { provider, name, photo, displayName } = githubUser;
  ctx.logger.info('githubUser', { provider, name, photo, displayName });

  let user = await ctx.model.User.findOne({
    where: {
      username: name
    }
  });

  if (!user) {
    user = await ctx.model.User.create({
      provider,
      username: name
    });
    const userInfo = await ctx.model.UserInfo.create({
      nickname: displayName,
      photo
    });
    const role = await ctx.model.Role.findOne({
      where: {
        keyName: 'user'
      }
    });
    user.setUserInfo(userInfo);
    user.addRole(role);
    await user.save();
  }
  const { rights, roles } = await service.user.getUserAttribute(user.id);

  // 权限判断
  if (!rights.some(item => item.keyName === 'login')) {
    ctx.body = {
      statusCode: '1',
      errorMessage: '不具备登录权限'
    };
    return;
  }

  ctx.session.user = {
    id: user.id,
    roles,
    rights
  };

  return githubUser;
};

```

注意看上面的代码，如果是首次授权将会创建这个用户，如果是第二次授权，那么用户已经被创建了

## 初始化

系统部署或者运行的时候，需要预设一些数据和表，代码在`app.js` 和 `app/service/startup.js`

逻辑就是项目启动完毕后，利用 model 同步表结构到数据库中，然后开始新建一些基础数据：

1. 新建角色和权限，并给角色分配权限
2. 新建不同用户，分配角色
3. 给一些用户建立好友关系
4. 添加申请
5. 创建群组，并添加一些人

做完以上这些就算是完成了初始数据了，可以进行正常的运转

## 部署

我是在腾讯云买的服务器 centos，在阿里云买的域名，装了 node(12.18.2) 、 nginx 和 mysql8.0，直接在 centos 上面启动，前端使用 nginx 进行反向代理。由于服务器资源有限，没有使用一些自动化工具 Jenkins 和 Docker，这就导致了我在更新的时候得有一些手动操作。
