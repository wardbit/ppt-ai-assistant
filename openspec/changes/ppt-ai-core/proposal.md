# Proposal: PPT AI Assistant Core

## Why

Creating presentations is time-consuming and requires both design skills and content expertise. Users need an AI-powered assistant that integrates directly into their existing workflow (PowerPoint/WPS) while also offering a standalone application for flexible content generation. This project bridges the gap between AI capabilities and presentation software, enabling users to generate, edit, and enhance presentations through natural language interaction.

## What Changes

This is a new project initialization with the following core capabilities:

- **Desktop Application**: Electron-based standalone app for PPT generation via chat interface
- **Office Plugin**: PowerPoint/WPS add-in with ribbon toolbar and sidebar panel
- **Multi-LLM Support**: Integration with 10+ AI providers (OpenAI, Gemini, GLM, Kimi, Minimax, etc.)
- **Knowledge Base Integration**: RAG support via Qdrant, Dify, RAGflow
- **AI Features**: Translation, layout optimization, summarization, proofreading, content generation
- **Plugin Management**: Install/uninstall Office plugins from desktop app
- **Local-First**: SQLite database for offline capability, no server required

## Capabilities

### New Capabilities

- `desktop-app`: Electron desktop application with Vue 3 frontend, chat interface, and file management
- `office-plugin`: PowerPoint/WPS COM add-in with ribbon toolbar and task pane sidebar
- `ai-provider-system`: Pluggable architecture for multiple LLM providers with unified interface
- `knowledge-base`: RAG integration for custom knowledge sources
- `ppt-generation`: AI-driven presentation creation from natural language prompts
- `ai-features`: Translation, layout, summarization, proofreading, and content generation tools
- `plugin-manager`: Install/uninstall Office plugins from desktop application
- `data-storage`: SQLite-based local storage for settings, history, and cache

### Modified Capabilities

(None - this is a new project)

## Impact

### Affected Systems
- **Desktop Application**: New Electron app with Vue 3 + TypeScript
- **Office Integration**: COM add-in for PowerPoint/WPS (Windows), potential WebExtension for cross-platform
- **AI Services**: API integrations with OpenAI, Gemini, Zhipu (GLM), Moonshot (Kimi), Minimax, DashScope, OpenRouter, Volcano Engine, Ollama
- **Knowledge Systems**: Qdrant, Dify, RAGflow integrations
- **Local Storage**: SQLite database for offline-first operation

### Dependencies
- Vue 3 + TypeScript + Composition API
- Electron for desktop wrapper
- LangChain.js / LangGraph.js for AI orchestration
- better-sqlite3 or sql.js for local database
- Office.js / COM for Office integration

### Breaking Changes
(None - new project)
