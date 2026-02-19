# Design: PPT AI Assistant Core

## Context

This is a greenfield project to create an AI-powered presentation assistant. The target users are professionals who regularly create presentations and want to leverage AI to:
- Generate presentation content from natural language
- Translate and summarize existing presentations
- Improve layout and formatting
- Access custom knowledge bases

The application must work both as a standalone desktop app and as an integrated Office plugin (PowerPoint/WPS), with a preference for local-first operation to ensure privacy and offline capability.

### Stakeholders
- **End Users**: Professionals creating presentations
- **IT Admins**: Deploying and managing the application in enterprise environments

### Constraints
- Windows primary platform (PowerPoint/WPS COM integration)
- Must work offline with local AI (Ollama)
- Zero external database dependency (SQLite embedded)

## Goals / Non-Goals

**Goals:**
- Create a unified codebase for desktop app and Office plugin
- Support 10+ LLM providers with pluggable architecture
- Enable RAG capabilities with popular knowledge base systems
- Provide seamless Office integration with ribbon and sidebar
- Local-first with SQLite for data persistence
- Fast iteration using Vue 3 + TypeScript + Electron stack

**Non-Goals:**
- macOS PowerPoint plugin (COM is Windows-only, WebExtension future consideration)
- Real-time collaboration features
- Cloud sync (optional future enhancement)
- Mobile applications

## Decisions

### 1. Monorepo Architecture with Turborepo
**Decision**: Use Turborepo to manage multiple packages in a single repository.

**Rationale**: 
- Shared code between desktop app and Office plugin
- Unified AI provider and knowledge base logic
- Simplified dependency management
- Better CI/CD pipeline

**Alternatives Considered**:
- Separate repos: Too much code duplication
- Single package: Difficult to manage different build targets

### 2. Vue 3 + TypeScript + Composition API
**Decision**: Use Vue 3 with `<script setup lang="ts">` and Composition API.

**Rationale**:
- Team familiarity (per requirements)
- Excellent TypeScript support
- Smaller bundle size than React
- Native Electron integration via electron-vite

**Alternatives Considered**:
- React: Larger ecosystem but larger bundle
- Svelte: Smaller but less ecosystem support

### 3. SQLite with better-sqlite3
**Decision**: Use better-sqlite3 for synchronous SQLite operations.

**Rationale**:
- Embedded database, no server required
- Synchronous API simplifies code (no async callback hell)
- Excellent performance
- Works well with Electron's main process

**Alternatives Considered**:
- sql.js: Pure JS but slower and larger bundle
- IndexedDB: Browser-only, not suitable for desktop app

### 4. LangChain.js + LangGraph.js
**Decision**: Use LangChain.js for LLM abstraction and LangGraph.js for workflow orchestration.

**Rationale**:
- Unified interface for multiple LLM providers
- Built-in conversation memory and RAG support
- Graph-based workflow for complex AI tasks
- Active community and TypeScript support

**Alternatives Considered**:
- Custom abstraction: More control but more maintenance
- AI SDK (Vercel): Less flexible for complex workflows

### 5. Office Integration Strategy
**Decision**: Primary: COM Add-in (Windows). Future: WebExtension (Cross-platform).

**Rationale**:
- COM add-ins have full access to PowerPoint/WPS object model
- Required for deep integration (ribbon, task pane)
- WebExtension can be added later for cross-platform support

**Alternatives Considered**:
- WebExtension only: Limited PowerPoint API access
- VBA macros: Security concerns, limited UI options

### 6. IPC Architecture for Electron
**Decision**: Use electron-vite with secure IPC between main and renderer.

**Rationale**:
- Type-safe IPC with TypeScript
- Hot reload during development
- Optimized production builds

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PPT AI Assistant                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │ Desktop App │    │ Office Plugin│    │   Shared Core      │  │
│  │  (Electron) │    │   (COM)      │    │   (Vue 3 + TS)     │  │
│  └──────┬──────┘    └──────┬──────┘    └──────────┬──────────┘  │
│         │                  │                       │             │
│         └──────────────────┼───────────────────────┘             │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │                    AI Provider System                      │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │  │
│  │  │GPT  │ │GLM  │ │Kimi │ │Mini-│ │Dash-│ │Ollama│ │... │  │  │
│  │  │     │ │     │ │     │ │max  │ │Scope│ │     │ │    │  │  │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │                   Knowledge Base System                    │  │
│  │         ┌────────┐  ┌──────┐  ┌────────┐                  │  │
│  │         │ Qdrant │  │ Dify │  │ RAGflow│  (RAG Engine)    │  │
│  │         └────────┘  └──────┘  └────────┘                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │                     Data Layer                             │  │
│  │         ┌─────────────┐  ┌──────────────────┐             │  │
│  │         │   SQLite    │  │   File System    │             │  │
│  │         │ (better-    │  │   (PPT/Config)   │             │  │
│  │         │  sqlite3)   │  │                  │             │  │
│  │         └─────────────┘  └──────────────────┘             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Package Structure

```
ppt-ai-assistant/
├── apps/
│   ├── desktop/                 # Electron desktop application
│   │   ├── src/
│   │   │   ├── main/           # Electron main process
│   │   │   ├── preload/        # Preload scripts
│   │   │   └── renderer/       # Vue 3 application
│   │   └── electron.vite.config.ts
│   └── office-plugin/          # Office COM add-in
│       ├── src/
│       │   ├── ribbon/         # Ribbon XML and handlers
│       │   ├── taskpane/       # Sidebar task pane (Vue)
│       │   └── native/         # C++/C# COM components
│       └── manifest.xml
├── packages/
│   ├── core/                   # Shared business logic
│   │   ├── ai-providers/       # LLM provider implementations
│   │   ├── knowledge-base/     # RAG integrations
│   │   ├── ppt-engine/         # PPT generation logic
│   │   └── storage/            # SQLite operations
│   ├── ui/                     # Shared Vue components
│   └── types/                  # Shared TypeScript types
├── openspec/                   # OpenSpec documentation
└── turbo.json                  # Turborepo configuration
```

## Risks / Trade-offs

### Risk 1: COM Add-in Complexity
**Risk**: COM add-ins are complex and can cause stability issues.
**Mitigation**: 
- Implement robust error handling
- Use isolated process for AI operations
- Provide fallback to desktop app mode

### Risk 2: LLM API Rate Limits
**Risk**: Free tier APIs have rate limits that may frustrate users.
**Mitigation**:
- Implement request queuing
- Show clear error messages
- Support local models (Ollama) for unlimited usage

### Risk 3: PowerPoint Object Model Changes
**Risk**: Microsoft may change PowerPoint APIs.
**Mitigation**:
- Use stable, documented APIs only
- Implement version detection
- Maintain compatibility layer

### Risk 4: Large Bundle Size
**Risk**: Electron + AI libraries may result in large bundle.
**Mitigation**:
- Lazy load AI providers
- Use tree-shaking
- Consider dynamic imports for heavy libraries

## Migration Plan

N/A - This is a new project. No migration required.

## Open Questions

1. **WPS Compatibility**: How much testing is needed for WPS Office compatibility?
2. **Enterprise Deployment**: Should we support MSI installer and Group Policy?
3. **Offline Models**: Which Ollama models should be pre-configured?
4. **Knowledge Base Priority**: Which RAG system should be the default?

## Success Metrics

- Application starts in < 3 seconds
- PPT generation completes in < 30 seconds (simple presentation)
- Memory usage < 500MB idle
- Zero data loss on crash (SQLite WAL mode)
