# Spec: Knowledge Base

RAG (Retrieval-Augmented Generation) integration for custom knowledge sources.

## ADDED Requirements

### Requirement: Supported Knowledge Bases
The system SHALL support the following knowledge base systems:
- Qdrant (vector database)
- Dify
- RAGflow

#### Scenario: Configure knowledge base
- **WHEN** user opens knowledge base settings
- **THEN** they can select and configure any supported system
- **AND** connection is validated before saving

### Requirement: Document Upload
The system SHALL allow users to upload documents to the knowledge base.

#### Scenario: Upload document
- **WHEN** user uploads a PDF, DOCX, or TXT file
- **THEN** document is processed and chunked
- **AND** embeddings are generated and stored

#### Scenario: Bulk upload
- **WHEN** user uploads multiple documents
- **THEN** all documents are processed in queue
- **AND** progress is displayed

### Requirement: Knowledge Retrieval
The system SHALL retrieve relevant knowledge for AI queries.

#### Scenario: Auto-retrieval
- **WHEN** user sends a message to AI
- **THEN** relevant knowledge chunks are retrieved
- **AND** included in the AI context automatically

#### Scenario: Manual retrieval
- **WHEN** user explicitly requests knowledge search
- **THEN** matching documents are displayed
- **AND** user can select which to include

### Requirement: Knowledge Base Management
The system SHALL provide management interface for knowledge bases.

#### Scenario: List documents
- **WHEN** user views knowledge base
- **THEN** all uploaded documents are listed with metadata
- **AND** user can delete individual documents

#### Scenario: Update document
- **WHEN** user re-uploads a document with same name
- **THEN** existing document is replaced
- **AND** embeddings are updated

### Requirement: Embedding Configuration
The system SHALL allow configuration of embedding models.

#### Scenario: Select embedding model
- **WHEN** user configures knowledge base
- **THEN** they can select embedding model (OpenAI, local, etc.)
- **AND** dimension size is auto-detected

### Requirement: Chunk Configuration
The system SHALL allow configuration of document chunking.

#### Scenario: Configure chunking
- **WHEN** user opens advanced knowledge settings
- **THEN** they can configure: chunk_size, chunk_overlap
- **AND** changes apply to newly uploaded documents

### Requirement: Qdrant Integration
The system SHALL integrate with Qdrant vector database.

#### Scenario: Connect Qdrant
- **WHEN** user configures Qdrant connection
- **THEN** they can specify: host, port, api_key, collection_name
- **AND** connection is tested before saving

### Requirement: Dify Integration
The system SHALL integrate with Dify knowledge base API.

#### Scenario: Connect Dify
- **WHEN** user configures Dify connection
- **THEN** they can specify: api_endpoint, api_key, dataset_id
- **AND** available datasets are listed

### Requirement: RAGflow Integration
The system SHALL integrate with RAGflow API.

#### Scenario: Connect RAGflow
- **WHEN** user configures RAGflow connection
- **THEN** they can specify: api_endpoint, api_key, knowledgebase_id
- **AND** connection is validated
