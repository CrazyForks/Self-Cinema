# Self Cinema 项目实现规划.

注意：请你在编写前端的时候，严格使用 shadcn/ui 的组件API，我所说的美观好看的UI风格都是严格遵循 shadcn/ui 的组件的UI设计风格！就是给人一种高级感的感觉。

## 项目概述

Self Cinema 是一个基于 Next.js + FastAPI 的私人影院系统，支持多种视频格式播放，具有现代化的界面设计和完整的管理功能。

## 核心功能需求

1. **管理后台**：密码保护的管理界面，支持电视剧和剧集的CRUD操作
2. **视频播放**：支持 MP4、MKV、M3U8 等格式的专业播放器
3. **分享系统**：生成分享链接供用户观看
4. **响应式设计**：完美适配桌面端和移动端
5. **现代化界面**：严格使用 shadcn/ui 设计规范

## 技术栈选择

- **后端**: FastAPI + SQLAlchemy + SQLite (扁平化结构)
- **前端**: Next.js 14 + TypeScript + shadcn/ui + Tailwind CSS
- **播放器**: Plyr.js
- **认证**: JWT

## 项目结构规划

```
self-cinema/
├── backend/
│   ├── main.py           # 主应用文件 (包含所有API路由)
│   ├── models.py         # 数据库模型
│   ├── auth.py           # 认证相关功能
│   └── requirements.txt  # Python依赖
└── frontend/
    ├── src/
    │   ├── app/          # Next.js App Router页面
    │   ├── components/   # React组件
    │   ├── lib/          # 工具函数和API客户端
    │   └── types/        # TypeScript类型定义
    └── package.json      # Node.js依赖
```

## 后端API接口文档

根据前端实际使用的数据结构，以下是完整的API接口规范：

### 数据模型定义

#### Series（电视剧）数据结构
```json
{
  "id": "string",
  "title": "string",              // 剧集标题
  "englishTitle": "string",       // 英文标题
  "description": "string",        // 剧情简介
  "coverImage": "string",         // 封面图片URL
  "backdropImage": "string",      // 背景图片URL
  "totalEpisodes": "number",      // 总集数
  "releaseYear": "number",        // 发行年份
  "genre": ["string"],            // 类型标签数组
  "rating": "number",             // 评分 (0-10)
  "views": "string",              // 播放量显示文本
  "status": "string",             // 状态：已完结/更新中/待播出
  "director": "string",           // 导演
  "actors": ["string"],           // 主演数组
  "region": "string",             // 地区
  "language": "string",           // 语言
  "updateTime": "string",         // 更新时间说明
  "tags": ["string"],             // 标签数组
  "created_at": "string"          // 创建时间 ISO格式
}
```

#### Episode（剧集）数据结构
```json
{
  "id": "string",
  "series_id": "string",          // 所属电视剧ID
  "episode": "number",            // 集数
  "title": "string",              // 集标题
  "description": "string",        // 集简介
  "videoUrl": "string",           // 视频播放地址
  "duration": "string",           // 时长显示文本 "45:30"
  "cover_image": "string",        // 剧集封面图
  "isVip": "boolean",             // 是否VIP专享
  "created_at": "string"          // 创建时间 ISO格式
}
```

### API接口规范

#### 1. 认证相关
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "username": "string",
  "password": "string"
}

Response:
{
  "access_token": "string",
  "token_type": "Bearer"
}
```

#### 2. 电视剧管理

##### 获取所有电视剧
```
GET /series
Response: Series[]
```

##### 获取单个电视剧详情
```
GET /series/{series_id}
Response: Series
```

##### 创建电视剧 (需认证)
```
POST /series
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "title": "string",
  "englishTitle": "string",
  "description": "string",
  "coverImage": "string",
  "backdropImage": "string",
  "totalEpisodes": "number",
  "releaseYear": "number",
  "genre": ["string"],
  "rating": "number",
  "views": "string",
  "status": "string",
  "director": "string",
  "actors": ["string"],
  "region": "string",
  "language": "string",
  "updateTime": "string",
  "tags": ["string"]
}

Response: Series
```

##### 更新电视剧 (需认证)
```
PUT /series/{series_id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body: (同创建电视剧)
Response: Series
```

##### 删除电视剧 (需认证)
```
DELETE /series/{series_id}
Authorization: Bearer {token}
Response: {"message": "删除成功"}
```

#### 3. 剧集管理

##### 获取电视剧的所有剧集
```
GET /series/{series_id}/episodes
Response: Episode[]
```

##### 获取单个剧集详情
```
GET /episodes/{episode_id}
Response: Episode
```

##### 创建剧集 (需认证)
```
POST /episodes
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
  "series_id": "string",
  "episode": "number",
  "title": "string",
  "description": "string",
  "videoUrl": "string",
  "duration": "string",
  "cover_image": "string",
  "isVip": "boolean"
}

Response: Episode
```

##### 更新剧集 (需认证)
```
PUT /episodes/{episode_id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body: (同创建剧集)
Response: Episode
```

##### 删除剧集 (需认证)
```
DELETE /episodes/{episode_id}
Authorization: Bearer {token}
Response: {"message": "删除成功"}
```

#### 4. 分享功能

##### 生成分享链接
```
POST /series/{series_id}/share
Response: 
{
  "shareUrl": "string",     // 完整的分享URL
  "hash": "string",         // 分享hash
  "expiresAt": "string"     // 过期时间 (可选)
}
```

##### 通过分享链接获取剧集信息
```
GET /watch/{hash}
Response:
{
  "series": Series,
  "episodes": Episode[]
}
```

### 错误响应格式

所有API的错误响应统一格式：
```json
{
  "error": "string",        // 错误类型
  "message": "string",      // 错误详细信息
  "status_code": "number"   // HTTP状态码
}
```

### 常见HTTP状态码
- `200 OK` - 请求成功
- `201 Created` - 创建成功
- `400 Bad Request` - 请求参数错误
- `401 Unauthorized` - 未认证
- `403 Forbidden` - 权限不足
- `404 Not Found` - 资源不存在
- `500 Internal Server Error` - 服务器内部错误

### 特殊说明

1. **视频格式支持**: 后端需支持 MP4、MKV、M3U8 等视频格式的URL
2. **图片处理**: 封面图和背景图支持相对路径或完整URL
3. **分享机制**: 分享链接应该包含hash参数，无需认证即可访问
4. **播放进度**: 前端通过localStorage管理，后端无需存储
5. **数据分页**: 如果剧集数量较多，建议添加分页参数

## 后端实现规划 (FastAPI 扁平化)

### 数据库模型设计
- **Admin**: 管理员表 (id, username, password_hash, created_at)
- **Series**: 电视剧表 (id, title, description, cover_image, created_at)
- **Episode**: 剧集表 (id, series_id, episode_number, title, video_url, created_at)

### API路由规划
- `POST /auth/login` - 管理员登录
- `GET /series` - 获取所有电视剧
- `POST /series` - 创建电视剧 (需认证)
- `PUT /series/{id}` - 更新电视剧 (需认证)
- `DELETE /series/{id}` - 删除电视剧 (需认证)
- `GET /series/{id}/episodes` - 获取剧集列表
- `POST /episodes` - 创建剧集 (需认证)
- `PUT /episodes/{id}` - 更新剧集 (需认证)
- `DELETE /episodes/{id}` - 删除剧集 (需认证)
- `GET /series/{id}/share` - 获取分享链接

### 认证机制
- 使用 JWT Token 进行身份验证
- 默认管理员账号: admin/admin123
- 保护所有写操作接口

## 前端实现规划 (严格使用 shadcn/ui)

### 页面结构
1. **首页** (`/`) - 项目介绍和入口
2. **管理员登录** (`/admin/login`) - 登录表单
3. **管理后台** (`/admin/dashboard`) - 电视剧和剧集管理
4. **播放页面** (`/watch/[id]`) - 视频播放界面

### 组件规划
- **VideoPlayer** - Plyr.js视频播放器组件
- **SeriesForm** - 电视剧创建/编辑表单
- **EpisodeForm** - 剧集创建/编辑表单
- **EpisodeList** - 剧集列表组件

### shadcn/ui 组件使用
- Card, CardContent, CardHeader, CardTitle - 卡片布局
- Button - 按钮交互
- Input, Textarea, Label - 表单控件
- Dialog - 模态对话框
- Tabs - 标签页切换
- Badge - 标签显示
- Alert - 错误提示

### 状态管理
- 使用 React useState 进行本地状态管理
- localStorage 存储认证token
- 使用 axios 进行API调用

## 核心功能实现要点

### 1. 认证流程
- 登录页面收集用户名密码
- 调用后端登录API获取JWT token
- token存储在localStorage中
- 所有需要认证的请求携带Authorization header

### 2. 管理后台功能
- 使用Tabs组件分离电视剧管理和剧集管理
- 使用Dialog组件实现创建/编辑表单
- 实现CRUD操作的完整流程
- 复制分享链接功能

### 3. 视频播放器
- 集成Plyr.js播放器
- 自动检测视频格式 (MP4/MKV/M3U8)
- 支持全屏、画质选择、速度调节
- 移动端触控优化

### 4. 播放页面布局
- 左侧视频播放器 (75%宽度)
- 右侧剧集列表 (25%宽度)
- 移动端响应式布局
- 上一集/下一集切换功能

## 样式和设计规范

### shadcn/ui 设计原则
- 使用系统预定义的颜色变量
- 遵循组件的标准用法和属性
- 保持一致的间距和布局
- 使用Tailwind CSS类名
- 避免自定义CSS样式

### 响应式设计
- 使用Tailwind CSS的响应式断点
- 移动端优先的设计思路
- 确保触控友好的交互元素
- 适配不同屏幕尺寸

## 部署和配置

### 开发环境
- 后端: `python main.py` (端口8000)
- 前端: `npm run dev` (端口3000)
- 数据库: SQLite文件数据库

### 环境变量
- `NEXT_PUBLIC_API_URL`: 后端API地址
- `SECRET_KEY`: JWT密钥 (后端)

### 依赖安装
- 后端: fastapi, uvicorn, sqlalchemy, python-jose, passlib
- 前端: next, react, typescript, tailwindcss, shadcn/ui, axios, plyr

## 实现步骤建议

1. **后端基础** - 创建数据库模型和基本API
2. **认证系统** - 实现JWT登录和权限验证
3. **前端框架** - 搭建Next.js项目和shadcn/ui
4. **管理后台** - 实现电视剧和剧集的CRUD界面
5. **播放功能** - 集成视频播放器和播放页面
6. **样式优化** - 完善响应式设计和用户体验
7. **测试部署** - 测试各项功能并优化性能

## 关键技术细节

### 后端扁平化原则
- 所有功能集中在少数几个文件中
- 避免复杂的模块导入关系
- 使用最直接的实现方式
- 减少抽象层级

### 前端设计一致性
- 严格按照shadcn/ui的组件API使用
- 不添加自定义样式类
- 使用系统的设计token和变量
- 保持统一的视觉风格

### 用户体验优化
- 快速响应的界面交互
- 清晰的错误提示和加载状态
- 直观的操作流程
- 良好的移动端体验
