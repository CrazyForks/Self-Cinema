# Self Cinema 启动指南

## 系统概述

Self Cinema 现已完成开发，包含以下组件：
- FastAPI 后端 (端口 8000)
- Next.js 前端 (端口 3000) 
- SQLite 数据库 (自动创建)
- 管理后台界面

## 启动步骤

### 1. 启动后端服务

```bash
cd backend
python main.py
```

后端服务将在 http://localhost:8000 启动
- API 文档: http://localhost:8000/docs
- 默认管理员账号: admin / admin123

### 2. 启动前端服务

```bash
cd frontend
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 3. 访问管理后台

访问 http://localhost:3000/admin/login
- 用户名: admin
- 密码: admin123

## 功能说明

### 管理后台功能
- ✅ 电视剧管理 (CRUD)
- ✅ 剧集管理 (CRUD)  
- ✅ 分享链接生成
- ✅ 数据统计面板
- ✅ JWT 认证保护

### API 接口
- ✅ 认证相关: `/auth/login`
- ✅ 电视剧: `/series` (GET/POST/PUT/DELETE)
- ✅ 剧集: `/episodes` (GET/POST/PUT/DELETE)
- ✅ 分享: `/series/{id}/share`, `/watch/{hash}`

### 数据结构
- ✅ 完整的电视剧信息字段
- ✅ 剧集信息和视频链接
- ✅ 分享链接管理
- ✅ 用户认证系统

## 技术特点

- **扁平化架构**: 后端代码简洁，易于维护
- **shadcn/ui 设计**: 现代化管理界面
- **响应式设计**: 适配桌面和移动端
- **类型安全**: 完整的 TypeScript 支持

## 使用建议

1. 首次使用请先添加电视剧信息
2. 为每个电视剧添加剧集和视频链接
3. 使用分享功能生成观看链接
4. 管理界面支持实时数据更新

系统已完成开发并可以正常使用！