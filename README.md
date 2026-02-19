# 🤖 PPT AI Assistant

<p align="center">
  <img src="./assets/logo.png" alt="PPT AI Assistant Logo" width="200"/>
</p>

<p align="center">
  <a href="https://github.com/wardbit/ppt-ai-assistant/releases">
    <img src="https://img.shields.io/github/v/release/wardbit/ppt-ai-assistant" alt="Release">
  </a>
  <a href="https://github.com/wardbit/ppt-ai-assistant/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/wardbit/ppt-ai-assistant" alt="License">
  </a>
  <a href="https://github.com/wardbit/ppt-ai-assistant/stargazers">
    <img src="https://img.shields.io/github/stars/wardbit/ppt-ai-assistant" alt="Stars">
  </a>
</p>

> 🤖 AI-powered PowerPoint/WPS plugin with desktop application. Supports multiple LLM providers and knowledge bases.

## ✨ Features

### Dual Mode

- **Desktop Application**: Standalone Electron app for generating presentations via chat
- **Office Plugin**: Seamless integration with PowerPoint and WPS Office

### AI Capabilities

- 📝 **Smart Generation**: Create presentations from natural language
- 🌐 **Translation**: Translate presentation content between languages
- 📋 **Summarization**: Generate executive summaries and key points
- ✏️ **Proofreading**: Smart grammar and style checking
- 🎨 **Layout Optimization**: Suggest and apply better layouts
- 💡 **Content Expansion**: Expand brief points into detailed content

### Multi-Provider Support

Connect to 10+ AI providers:

| Provider | Models |
|----------|--------|
| OpenAI | GPT-4, GPT-3.5 Turbo |
| Google Gemini | Gemini Pro, Ultra |
| 智谱 GLM | GLM-4, GLM-3 Turbo |
| Moonshot Kimi | Kimi k1.5, k2 |
| Minimax | MoE Models |
| 阿里云 DashScope | Qwen, LLaMA |
| OpenRouter | Unified API |
| 火山引擎 | Douyin Models |
| Ollama | Local Models (Llama, Mistral) |

### Knowledge Base

- 🔍 **Qdrant**: Vector database for semantic search
- 📚 **Dify**: LLMOps platform integration
- 🧠 **RAGflow**: RAG engine integration

### Local-First

- 💾 **SQLite Database**: No external database required
- 🔒 **Local Processing**: Your data stays on your machine
- ⚡ **Offline Support**: Works with local Ollama models

## 📸 Screenshots

> (Screenshots coming soon)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Windows 10/11 (for Office plugin)

### Installation

```bash
# Clone the repository
git clone https://github.com/wardbit/ppt-ai-assistant.git
cd ppt-ai-assistant

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev
```

### Quick Start

1. Launch the desktop application
2. Configure your AI provider (API key)
3. Start chatting to generate presentations!

## 📖 Documentation

- [📋 OpenSpec Requirements](./openspec/changes/ppt-ai-core/proposal.md)
- [🏗️ Technical Design](./openspec/changes/ppt-ai-core/design.md)
- [📝 Task List](./openspec/changes/ppt-ai-core/tasks.md)

## 🛠️ Development

### Tech Stack

- **Frontend**: Vue 3 + TypeScript + Composition API
- **Desktop**: Electron + electron-vite
- **AI**: LangChain.js + LangGraph.js
- **Database**: SQLite (better-sqlite3)
- **Build**: Turborepo + pnpm

### Project Structure

```
ppt-ai-assistant/
├── apps/
│   ├── desktop/              # Electron desktop application
│   └── office-plugin/        # Office COM add-in
├── packages/
│   ├── core/                 # Shared business logic
│   │   ├── ai-providers/    # LLM provider implementations
│   │   ├── knowledge-base/   # RAG integrations
│   │   ├── ppt-engine/      # PPT generation
│   │   └── storage/         # SQLite operations
│   ├── ui/                  # Shared Vue components
│   └── types/               # TypeScript types
├── openspec/                # OpenSpec documentation
└── turbo.json               # Turborepo config
```

### OpenSpec Workflow

This project follows **Spec-Driven Development (SDD)**:

```bash
# Create a new feature
/opsx:new feature-name

# Generate all planning docs
/opsx:ff

# Implement tasks
/opsx:apply

# Archive when done
/opsx:archive
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

See [LICENSE](./LICENSE) for the full text.

## 🙏 Acknowledgments

- [LangChain.js](https://github.com/langchain-ai/langchainjs) - AI framework
- [Vue.js](https://vuejs.org) - Frontend framework
- [Electron](https://www.electronjs.org) - Desktop framework
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) - Spec-driven development

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/wardbit">wardbit</a> and contributors
</p>
