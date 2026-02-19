# Tasks: PPT AI Assistant Core

Implementation checklist for the core PPT AI Assistant system.

> **开发方法论**: SDD (Spec-Driven Development) + TDD (Test-Driven Development)
> 先写测试，再写实现，所有代码必须符合 OpenSpec 规范

## 1. 项目基础设施 (Project Setup)

- [ ] 1.1 初始化 Turborepo monorepo 结构
- [ ] 1.2 配置 pnpm workspace
- [ ] 1.3 设置 TypeScript 共享配置 (packages/types)
- [ ] 1.4 配置 ESLint + Prettier
- [ ] 1.5 设置 Vitest 测试框架
- [ ] 1.6 配置 Husky + lint-staged (Git hooks)

## 2. 数据层 (Data Storage) - 后端

- [ ] 2.1 编写 SQLite 数据库 schema 测试用例
- [ ] 2.2 实现 database initialization (better-sqlite3)
- [ ] 2.3 实现 settings 表和 CRUD 操作
- [ ] 2.4 实现 chat_history 表和 CRUD 操作
- [ ] 2.5 实现 presentations 表和 CRUD 操作
- [ ] 2.6 实现 API key 加密/解密功能
- [ ] 2.7 实现 WAL mode 和数据库维护
- [ ] 2.8 编写数据库单元测试 (覆盖率 > 80%)

## 3. AI Provider 系统 (后端)

- [ ] 3.1 定义 Provider interface (types)
- [ ] 3.2 编写 Provider interface 测试用例
- [ ] 3.3 实现 OpenAI provider
- [ ] 3.4 实现 Gemini provider
- [ ] 3.5 实现 Zhipu GLM provider
- [ ] 3.6 实现 Moonshot Kimi provider
- [ ] 3.7 实现 Minimax provider
- [ ] 3.8 实现 DashScope provider
- [ ] 3.9 实现 OpenRouter provider
- [ ] 3.10 实现 Volcano Engine provider
- [ ] 3.11 实现 Ollama provider (local)
- [ ] 3.12 实现 Provider 工厂和注册机制
- [ ] 3.13 实现流式响应 (streaming)
- [ ] [ ] 3.14 实现 API key 管理和验证
- [ ] 3.15 实现 token 使用量追踪
- [ ] 3.16 编写 Provider 集成测试

## 4. LangChain 集成 (后端)

- [ ] 4.1 配置 LangChain.js
- [ ] 4.2 实现 conversation memory
- [ ] 4.3 实现 prompt templates
- [ ] 4.4 实现 LangGraph workflow for PPT generation
- [ ] 4.5 编写 LangChain 集成测试

## 5. 知识库系统 (Knowledge Base) - 后端

- [ ] 5.1 定义 Knowledge Base interface
- [ ] 5.2 编写 Knowledge Base 测试用例
- [ ] 5.3 实现 Qdrant 集成
- [ ] 5.4 实现 Dify 集成
- [ ] 5.5 实现 RAGflow 集成
- [ ] 5.6 实现文档上传和 chunking
- [ ] 5.7 实现向量检索 (retrieval)
- [ ] 5.8 编写 Knowledge Base 集成测试

## 6. PPT 生成引擎 (PPT Engine) - 后端

- [ ] 6.1 编写 PPT 结构生成测试用例
- [ ] 6.2 实现 outline generator
- [ ] 6.3 实现 slide content generator
- [ ] 6.4 实现 speaker notes generator
- [ ] 6.5 实现 PPTX 文件生成 (pptxgenjs)
- [ ] 6.6 实现 PPTX 模板应用
- [ ] 6.7 实现 PDF 导出
- [ ] 6.8 编写 PPT Engine 单元测试

## 7. AI 功能模块 (AI Features) - 后端

- [ ] 7.1 编写翻译功能测试用例
- [ ] 7.2 实现多语言翻译服务
- [ ] 7.3 编写摘要功能测试用例
- [ ] 7.4 实现内容摘要服务
- [ ] 7.5 编写校对功能测试用例
- [ ] 7.6 实现智能校对服务
- [ ] 7.7 编写排版功能测试用例
- [ ] 7.8 实现布局优化建议
- [ ] 7.9 实现内容续写和扩写
- [ ] 7.10 编写 AI Features 集成测试

## 8. 桌面应用 - Electron (Desktop App) - 前端

- [ ] 8.1 初始化 Electron + Vue 3 项目 (electron-vite)
- [ ] 8.2 编写 IPC 通信层测试用例
- [ ] 8.3 实现 Electron main process
- [ ] 8.4 实现 preload scripts (安全 IPC)
- [ ] 8.5 实现系统托盘功能
- [ ] 8.6 实现自动更新功能
- [ ] 8.7 实现窗口状态持久化
- [ ] 8.8 编写 Electron 集成测试

## 9. UI 组件库 (Shared UI) - 前端

- [ ] 9.1 编写组件测试框架配置
- [ ] 9.2 实现 ChatInterface 组件
- [ ] 9.3 实现 MessageBubble 组件
- [ ] 9.4 实现 StreamingMessage 组件
- [ ] 9.5 实现 SettingsPanel 组件
- [ ] 9.6 实现 ProviderConfig 组件
- [ ] 9.7 实现 KnowledgeBaseManager 组件
- [ ] 9.8 实现 PresentationPreview 组件
- [ ] 9.9 编写所有组件单元测试

## 10. 桌面应用页面 (Desktop Pages) - 前端

- [ ] 10.1 实现主聊天页面
- [ ] 10.2 实现设置页面
- [ ] 10.3 实现 AI Provider 配置页面
- [ ] 10.4 实现知识库管理页面
- [ ] 10.5 实现历史记录页面
- [ ] 10.6 实现插件管理页面
- [ ] 10.7 编写页面 E2E 测试 (Playwright)

## 11. Office 插件 (Office Plugin) - 混合

- [ ] 11.1 编写 COM Add-in 接口定义
- [ ] 11.2 实现 Ribbon XML 定义
- [ ] 11.3 实现 Ribbon 事件处理
- [ ] 11.4 实现 Task Pane (WPF or WebView2)
- [ ] 11.5 实现 PowerPoint Object Model 交互
- [ ] 11.6 实现 WPS 兼容层
- [ ] 11.7 实现插件安装/卸载程序
- [ ] 11.8 编写插件功能测试

## 12. 插件管理器 (Plugin Manager) - 后端

- [ ] 12.1 编写 Office 检测测试用例
- [ ] 12.2 实现 PowerPoint 安装检测
- [ ] 12.3 实现 WPS 安装检测
- [ ] 12.4 实现插件注册/注销逻辑
- [ ] 12.5 实现安装日志记录
- [ ] 12.6 编写 Plugin Manager 集成测试

## 13. 端到端测试 (E2E Testing)

- [ ] 13.1 配置 Playwright E2E 测试环境
- [ ] 13.2 编写桌面应用启动测试
- [ ] 13.3 编写 PPT 生成完整流程测试
- [ ] 13.4 编写 Office 插件集成测试
- [ ] 13.5 编写多 Provider 切换测试
- [ ] 13.6 编写知识库 RAG 测试

## 14. 打包和发布 (Build & Release)

- [ ] 14.1 配置 Electron Builder
- [ ] 14.2 实现 Windows NSIS 安装包
- [ ] 14.3 实现自动更新服务器配置
- [ ] 14.4 配置 GitHub Actions CI/CD
- [ ] 14.5 编写发布文档
- [ ] 14.6 创建用户手册

---

## 开发团队分工

| 角色 | 负责任务 | 权限 |
|------|----------|------|
| **项目经理 (PM)** | OpenSpec 管理、代码审查、任务分配 | 只读代码，可修改 OpenSpec |
| **前端开发 (FE)** | 任务 8, 9, 10 | 读写前端代码 |
| **后端开发 (BE)** | 任务 2-7, 12 | 读写后端代码 |
| **测试工程师 (QA)** | 任务 13, 所有测试用例 | 读写测试代码 |
| **DevOps** | 任务 1, 14 | 读写 CI/CD 配置 |

## TDD 流程

1. **Red**: 先写失败的测试用例
2. **Green**: 编写最少代码使测试通过
3. **Refactor**: 重构代码，保持测试通过
4. **Document**: 更新相关文档

## 完成标准 (Definition of Done)

- [ ] 所有测试通过
- [ ] 代码覆盖率 > 80%
- [ ] 代码审查通过
- [ ] OpenSpec 规范检查通过
- [ ] 文档已更新
