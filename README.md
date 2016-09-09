#  Vue.js+LeanCloud单页面博客

## 简介
一个前后端完全分离的单页应用  [线上地址点此查看](http://cleartime.leanapp.cn)


### version 1.0
- 响应式布局
- 主页，关于，标签
- 过渡动画
- 文章显示markdown 和代码高亮


## 技术栈
### 前端
- [Vue.js](https://github.com/vuejs/vue)
- [vuex 状态管理](https://github.com/vuejs/vuex)
- [vue-router 路由](https://github.com/vuejs/vue-router)
- [marked 语法解析](https://github.com/chjj/marked)

### 后端
- [node.js 服务端](https://github.com/nodejs/node)
- [express 框架](https://github.com/expressjs/express)
- [LeanCloud 数据存储](http://www.leancloud.com)

## 开发

```bash
git clone https://github.com/cleartime/cleartime.git
$ cd cleartime
$ npm install

// 启动服务器端, 默认地址 http://localhost:3000
$ lean up

// 另开一个 terminal
$ cd public/blog
$ npm install
// 启动前端项目，默认地址 http://localhost:7000
$ npm run dev
```

## 构建部署

```bash
// 在bolg目录下  构建前端文件至 /build 文件夹
$ npm run build

// 根目录下 leancloud命令行部署 / 通过 github 部署
$ lean deploy / lean deploy -g

```

具体部署可参考[LeanCloud云引擎 Node.js 部署](https://leancloud.cn/docs/leanengine_webhosting_guide-node.html#部署)

## License
MIT
