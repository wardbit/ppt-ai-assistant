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

> 🤖 AI-powered PowerPoint/WPS plugin with desktop application. Supports any LLM and image generation API that follows standard protocols.

## ✨ Features

### Dual Mode

- **Desktop Application**: Standalone Electron app for generating presentations via chat
- **Office Plugin**: Seamless integration with PowerPoint and WPS Office

### AI Capabilities

- 📝 **Smart Generation**: Create presentations from natural language
- 🖼️ **Image Generation**: Generate images for PPT materials using AI
- 🌐 **Translation**: Translate presentation content between languages
- 📋 **Summarization**: Generate executive summaries and key points
- ✏️ **Proofreading**: Smart grammar and style checking
- 🎨 **Layout Optimization**: Suggest and apply better layouts
- 💡 **Content Expansion**: Expand brief points into detailed content

### 🔌 Flexible API Protocol Support

This project supports **any LLM** and **any Image Generation API** that conforms to standard protocols:

#### Text Generation (LLM)

| Protocol | Compatible Providers |
|----------|---------------------|
| **OpenAI Chat Completions** | OpenAI, Azure OpenAI, Cloudflare Workers AI, Cohere, Fireworks AI, Together AI, Replicate, and **any OpenAI-compatible API** |
| **Anthropic Messages** | Anthropic Claude, and **any Claude-compatible API** |
| **Google Gemini** | Google Gemini, and **any Gemini-compatible API** |
| **Grok** | xAI Grok, and **any Grok-compatible API** |
| **Ollama** | Ollama (all local models), and **any Ollama-compatible API** |

#### Image Generation

| Protocol | Compatible Providers |
|----------|---------------------|
| **OpenAI Images** | OpenAI DALL-E |
| **Anthropic Images** | Anthropic (via API) |
| **Google Images** | Google Imagen |
| **fal.ai** | fal.ai (Leonardo, Stable Diffusion, etc.), and **any fal.ai-compatible API** |
| **Custom** | Any image generation API following above protocols |

#### 🎯 Custom Model Endpoints

You can add **any custom model endpoint** as long as it follows one of these protocols:

```typescript
// Example: Add a custom LLM provider
{
  type: 'custom',
  name: 'My Custom Model',
  apiKey: 'your-api-key',
  baseUrl: 'https://your-custom-api.com/v1',  // OpenAI compatible
  model: 'your-model-name'
}

// Example: Add a custom image generation provider
{
  type: 'image-custom',
  name: 'My Image API',
  apiKey: 'your-api-key',
  baseUrl: 'https://your-image-api.com/v1',
  model: 'your-image-model'
}
```

#### Supported Model Examples

| Type | Model Series | Latest Models |
|------|--------------|---------------|
| **LLM** | **OpenAI** | GPT-5.3, GPT-5.2, o4-mini, GPT-4o |
| | **Anthropic** | Claude Opus 4.6, Claude Sonnet 4.6, Claude Haiku |
| | **Google** | Gemini 3.5 Pro, Gemini 3.0 Flash |
| | **xAI** | Grok 3, Grok 2 |
| | **Local (Ollama)** | Qwen 3, Mistral, Phi 4, DeepSeek |
| | **Chinese** | 智谱 GLM-5, Kimi 2.5, 阿里 Qwen 3.5, Minimax 2.5 |
| **Image** | **OpenAI** | DALL-E 3, DALL-E 2 |
| | **Google** | Imagen 3, Imagen 2 |
| | **fal.ai** | Leonardo, Stable Diffusion XL, Playground v2 |
| | **Custom** | Any compatible API |

### Knowledge Base

- 🔍 **Qdrant**: Vector database for semantic search
- 📚 **Dify**: LLMOps platform integration
- 🧠 **RAGflow**: RAG engine integration
- 💾 **Local Embeddings**: Support for local embedding models

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
2. Add your custom API endpoints (any LLM/Image API following standard protocols)
3. Start chatting to generate presentations and images!

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
│   │   ├── image-providers/ # Image generation providers
│   │   ├── knowledge-base/  # RAG integrations
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
