# 🎬 Self Cinema - 私人影院系统

![微信图片_20250730200910_886](https://img.onmicrosoft.cn/zkeq/20250730201012645.png)

![image-20250730201238279](https://img.onmicrosoft.cn/zkeq/20250730201238399.png)

![image-20250730201249281](https://img.onmicrosoft.cn/zkeq/20250730201249405.png)

<div align="center">

![Self Cinema Logo](https://img.shields.io/badge/Self%20Cinema-🎭-red?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**🌟 一个现代化的私人影院管理系统，让你轻松管理和分享你的视频收藏！**

[🚀 快速开始](#-快速开始) •
[✨ 功能特性](#-功能特性) •
[🛠️ 技术栈](#️-技术栈) •
[📱 演示截图](#-演示截图) •
[🤝 贡献](#-贡献) 

</div>

---

## 📖 项目简介

Self Cinema 是一个功能完善的私人影院系统，专为个人或小团体设计。它提供了优雅的管理界面和流畅的观看体验，支持多种视频格式，让你可以轻松管理自己的视频收藏并与朋友分享。

### 🎯 核心亮点

- 🎨 **现代化设计** - 基于 shadcn/ui 的精美界面
- 📱 **响应式布局** - 完美适配桌面和移动设备
- 🔐 **安全认证** - JWT 保护的管理后台
- 🎥 **专业播放器** - 基于 Plyr.js 的高质量视频播放
- 🔗 **便捷分享** - 一键生成分享链接
- 🌓 **暗黑模式** - 支持明暗主题切换

---

## ✨ 功能特性

### 🎭 管理后台功能
- ✅ **电视剧管理** - 完整的 CRUD 操作
  - 📝 添加剧集信息（标题、简介、封面等）
  - 🏷️ 分类标签和评分系统
  - 🎬 导演和演员信息管理
  - 📊 播放量和状态跟踪
- ✅ **剧集管理** - 逐集详细管理
  - 🎞️ 视频文件上传和链接管理
  - ⏱️ 时长和封面图设置
  - 💎 VIP 专享内容标记
- ✅ **分享系统** - 智能链接生成
  - 🔗 安全的哈希链接生成
  - ⏰ 可选的过期时间设置
  - 📱 移动端友好的分享页面

### 🎬 观看体验
- 🎥 **多格式支持** - MP4、MKV、M3U8 等主流格式
- ⚡ **智能播放** - 自动记忆播放进度
- 🎛️ **播放控制** - 倍速、全屏、画质选择
- 📱 **触控优化** - 移动端手势控制
- 🔄 **连续播放** - 自动切换下一集
- 💾 **进度保存** - 跨设备同步观看进度

### 🔐 安全特性
- 🛡️ **JWT 认证** - 安全的用户身份验证
- 🔒 **权限控制** - 细粒度的访问权限管理
- 🚫 **防盗链** - 视频资源保护机制
- 📝 **操作日志** - 完整的管理操作记录

---

## 🛠️ 技术栈

### 🔧 后端技术
- **🐍 FastAPI 0.104.1** - 现代化的 Python Web 框架
- **🗄️ SQLAlchemy 2.0.23** - 强大的 ORM 工具
- **💾 SQLite** - 轻量级数据库
- **🔐 python-jose** - JWT 认证支持
- **📊 Uvicorn 0.24.0** - 高性能 ASGI 服务器
- **🔒 bcrypt** - 密码加密

### 🎨 前端技术
- **⚛️ Next.js 15.4.4** - React 全栈框架
- **📘 TypeScript 5** - 类型安全的 JavaScript
- **🎨 Tailwind CSS 4** - 实用优先的 CSS 框架
- **🧩 shadcn/ui + Radix UI** - 高质量的 React 组件库
- **🎥 Plyr.js 3.7.8** - 现代化的 HTML5 播放器
- **📡 Axios 1.11.0** - HTTP 客户端库
- **🎭 next-themes** - 主题切换支持

---

## 🚀 开发指南

### 📋 环境要求

- 🐍 **Python 3.8+**
- 📦 **Node.js 18+**
- 💿 **npm**

### 📥 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/zkeq/self-cinema.git
   cd self-cinema
   ```

2. **🔧 设置后端环境**
   ```bash
   cd backend
   
   # 安装 Python 依赖
   pip install -r requirements.txt
   
   # 启动后端服务 🚀
   python main.py
   ```
   
   后端服务将在 `http://localhost:8000` 启动
   - 📖 API 文档: `http://localhost:8000/docs`
   - 👤 默认管理员: `admin` / `admin123`

3. **🎨 设置前端环境**
   ```bash
   cd ../frontend
   
   # 安装依赖
   npm install
   
   # 启动开发服务器 🚀
   npm run dev
   ```
   
   前端服务将在 `http://localhost:3000` 启动

4. **🎉 开始使用**
   - 🏠 **首页**: `http://localhost:3000`
   - 🔐 **管理后台**: `http://localhost:3000/admin/login`
   - 📝 **登录信息**: `admin` / `admin123`

---

## 📱 项目结构

```
self-cinema/
├── 📂 backend/                 # 后端代码
│   ├── 🐍 main.py             # 主应用文件
│   ├── 🗄️ models.py          # 数据库模型
│   ├── 🔐 auth.py             # 认证功能
│   ├── 📝 requirements.txt    # Python 依赖
│   └── 💾 database.db         # SQLite 数据库
├── 📂 frontend/               # 前端代码
│   ├── 📂 src/
│   │   ├── 📂 app/           # Next.js 页面
│   │   │   ├── 🏠 page.tsx           # 首页
│   │   │   ├── 📂 admin/             # 管理后台
│   │   │   │   ├── 🔐 login/         # 登录页面
│   │   │   │   └── 📊 dashboard/     # 管理面板
│   │   │   └── 📂 watch/             # 播放页面
│   │   ├── 📂 components/     # React 组件
│   │   │   ├── 🎥 video-player.tsx  # 视频播放器
│   │   │   ├── 🎨 ui/               # UI 组件库
│   │   │   └── 🛡️ error-boundary.tsx # 错误边界
│   │   ├── 📂 lib/           # 工具函数
│   │   │   ├── 🌐 api.ts            # API 客户端
│   │   │   ├── 🔐 auth.ts           # 认证工具
│   │   │   └── 💾 progress.ts       # 进度管理
│   │   └── 📂 types/         # TypeScript 类型
│   ├── 📦 package.json       # Node.js 依赖
│   └── ⚙️ next.config.ts     # Next.js 配置
└── 📖 README.md              # 项目文档
```

---

## 🎮 使用指南

### 👨‍💼 管理员操作

1. **📺 添加电视剧**
   - 登录管理后台
   - 点击"电视剧管理"标签
   - 填写详细信息（标题、简介、封面等）
   - 设置分类标签和评分

2. **🎞️ 管理剧集**
   - 选择对应的电视剧
   - 添加视频文件链接
   - 设置剧集封面和简介
   - 配置 VIP 权限 (图个好看)

3. **🔗 生成分享链接**
   - 在电视剧详情页点击"分享"
   - 复制生成的安全链接
   - 发送给朋友观看

### 👥 观众体验

1. **🎬 观看视频**
   - 通过分享链接访问
   - 选择想看的剧集
   - 享受高质量的播放体验

2. **📱 移动端使用**
   - 响应式设计完美适配手机
   - 支持手势控制
   - 自动记忆播放进度

---

## 🔧 配置说明

### 🌐 项目配置

**后端配置** (在 `backend/main.py` 中)：
- 默认管理员账号通过 `init_default_admin()` 创建
- 数据库：SQLite (`database.db`)
- JWT 认证：内置配置
- CORS：允许所有来源 (生产环境建议限制)

**前端配置** (在 `frontend/src/lib/api.ts` 中)：
- API 基础地址：`http://localhost:8000`
- 支持主题切换 (明暗模式)
- 响应式设计适配移动端

### ⚙️ 自定义配置

- **🎥 视频格式**: 支持 MP4、MKV、M3U8 等格式
- **🎨 主题样式**: 在 `frontend/src/app/globals.css` 中自定义颜色主题
- **📱 响应式设计**: 基于 Tailwind CSS 4 的响应式断点
- **🔧 管理员账号**: 可通过 `backend/update_admin.py` 更新管理员信息

---

## 📚 API 文档

### 🔐 认证接口

| 方法 | 端点 | 描述 | 
|------|------|------|
| `POST` | `/auth/login` | 🔑 用户登录 |

### 📺 电视剧接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `GET` | `/series` | 📋 获取所有电视剧 | ✅ |
| `GET` | `/series/{id}` | 📖 获取电视剧详情 | ✅ |
| `POST` | `/series` | ➕ 创建电视剧 | ✅ |
| `PUT` | `/series/{id}` | ✏️ 更新电视剧 | ✅ |
| `DELETE` | `/series/{id}` | 🗑️ 删除电视剧 | ✅ |

### 🎞️ 剧集接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `GET` | `/series/{id}/episodes` | 📋 获取剧集列表 | ✅ |
| `GET` | `/episodes/{id}` | 📖 获取剧集详情 | ✅ |
| `POST` | `/episodes` | ➕ 创建剧集 | ✅ |
| `PUT` | `/episodes/{id}` | ✏️ 更新剧集 | ✅ |
| `DELETE` | `/episodes/{id}` | 🗑️ 删除剧集 | ✅ |

### 🔗 分享接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `POST` | `/series/{id}/share` | 🔗 生成分享链接 | ✅ |
| `GET` | `/watch/{hash}` | 👀 通过分享链接观看 | ❌ |

---

## 🐛 故障排除

### 常见问题

**❓ 后端启动失败**
- 检查 Python 版本是否 3.8+
- 确认所有依赖已正确安装
- 检查端口 8000 是否被占用

**❓ 前端样式异常**
- 清除 Node.js 缓存: `npm cache clean --force`
- 重新安装依赖: `rm -rf node_modules && npm install`
- 检查 Tailwind CSS 配置

**❓ 视频播放失败**
- Safari 浏览器已知不支持 mkv 格式的视频播放
- 确认视频文件格式受支持
- 检查视频文件链接是否可访问
- 验证播放器组件是否正确加载

**❓ 登录认证问题**
- 检查 JWT 密钥配置
- 确认默认管理员账号已创建
- 查看浏览器控制台错误信息

---

## 🚀 部署指南

### 📦 生产部署

**前端生产构建：**
```bash
cd frontend
npm run build
npm start
```

**后端生产运行：**
```bash
cd backend
python main.py
```

### 🚀 快速开始

### ☁️ 云服务器部署 （后端）[使用宝塔部署]

1. 将 `backend` 文件夹上传至服务器 `\root` 即可

   ![image-20250731101134242](https://img.onmicrosoft.cn/zkeq/20250731101141473.png)

   删掉 backend/music.db 开发测试数据库

3. 修改 `jwt secret` 为一串随机字符串 `auth.py`

   ![image-20250731101241859](https://img.onmicrosoft.cn/zkeq/20250731101323797.webp)

4. 修改默认管理员账号，默认管理员密码 `models.py`

   ![image-20250731101413349](https://img.onmicrosoft.cn/zkeq/20250731101430055.webp)

5. 打开宝塔 网站 -> `Ptython项目` -> `新建站点`

   新建一个虚拟环境

   ![image-20250731101721616](https://img.onmicrosoft.cn/zkeq/20250731101721697.png)

6. 表单按如下填写

   ![image-20250731101757603](https://img.onmicrosoft.cn/zkeq/20250731101757694.png)

7. 点击确定后项目会进行创建虚拟环境和安装，等待安装完毕 即可

8. 点击设置可查看项目日志

   ![image-20250731101900749](https://img.onmicrosoft.cn/zkeq/20250731101900862.png)

9. 在这一步如果提示找不到某个依赖，点击 `操作` 中的 `终端`，自行输入 `pip install xxx(包名)` 即可，若提示端口被占用 （更改一个没有被占用的端口即可 `main.py`）

   ![image-20250731102037862](https://img.onmicrosoft.cn/zkeq/20250731102037989.png)

10.  请求服务端口，查看运行情况 （看到这个字符串，说明服务正常运行）

   ![image-20250731102123918](https://img.onmicrosoft.cn/zkeq/20250731102123995.png)

10. 后端部署已完成，可在cdn测绑定反代域名即可上线

### ☁️  Vercel 部署 （前端）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzkeq%2FSelf-Cinema%2Ftree%2Fmain%2Ffrontend&env=NEXT_PUBLIC_API_URL&envDescription=%E5%90%8E%E7%AB%AF%E9%A1%B9%E7%9B%AE%E5%9C%B0%E5%9D%80%EF%BC%88%E7%A4%BA%E4%BE%8B%3A%20https%3A%2F%2Fmovie-api.onmicrosoft.cn%EF%BC%89%EF%BC%9A&project-name=self-ciname&repository-name=self-ciname)

- 按步骤进行操作即可成功部署

![image-20250731103123137](https://img.onmicrosoft.cn/zkeq/20250731103123356.png)


---

## 🤝 贡献

我们欢迎所有形式的贡献！💪

### 🎯 贡献方式

- 🐛 **报告 Bug** - 提交详细的问题报告
- 💡 **功能建议** - 分享你的创意想法
- 🔧 **代码贡献** - 提交 Pull Request
- 📖 **文档改进** - 完善项目文档
- 🌍 **国际化** - 添加多语言支持

### 💻 开发规范

- 📏 遵循现有代码风格
- ✅ 添加必要的测试用例
- 📝 更新相关文档
- 🎨 使用 shadcn/ui 组件规范
- 🔍 通过 ESLint 和 TypeScript 检查

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

```
MIT License

Copyright (c) 2024 Self Cinema

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 致谢

感谢以下开源项目的支持：

- 🎨 **shadcn/ui** - 精美的 React 组件库
- ⚛️ **Next.js** - 强大的 React 框架
- 🐍 **FastAPI** - 现代化的 Python 框架
- 🎥 **Plyr.js** - 优秀的视频播放器
- 🎨 **Tailwind CSS** - 实用的 CSS 框架

---

## 📞 联系我们

- 📧 **邮箱**: [admin@icodeq.com](mailto:admin@icodeq.com)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/zkeq/self-cinema/issues)
- 💬 **讨论**: [GitHub Discussions](https://github.com/zkeq/self-cinema/discussions)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给我们一个星星！⭐**

Made with ❤️ by Zkeq

[🔝 回到顶部](#-self-cinema---私人影院系统)

</div>
