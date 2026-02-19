# Spec: Data Storage

SQLite-based local storage for settings, history, and cache.

## ADDED Requirements

### Requirement: SQLite Database
The system SHALL use SQLite as the embedded database.

#### Scenario: Database initialization
- **WHEN** application starts for the first time
- **THEN** SQLite database file is created at app data directory
- **AND** all required tables are initialized

#### Scenario: Database location
- **WHEN** database is created
- **THEN** it is stored at: %APPDATA%/PPT-AI-Assistant/data.db
- **AND** path is configurable in settings

### Requirement: Settings Storage
The system SHALL persist user settings in the database.

#### Scenario: Save settings
- **WHEN** user changes any setting
- **THEN** setting is immediately saved to database
- **AND** no data loss on application crash

#### Scenario: Load settings
- **WHEN** application starts
- **THEN** all saved settings are loaded
- **AND** defaults are used for missing settings

### Requirement: Chat History
The system SHALL store chat conversation history.

#### Scenario: Save conversation
- **WHEN** user sends a message
- **THEN** message and AI response are saved to database
- **AND** timestamp and metadata are recorded

#### Scenario: Load history
- **WHEN** user opens chat
- **THEN** recent conversations are loaded
- **AND** user can scroll through history

#### Scenario: Search history
- **WHEN** user searches chat history
- **THEN** matching conversations are displayed
- **AND** search includes message content

### Requirement: Presentation History
The system SHALL track generated presentations.

#### Scenario: Save presentation record
- **WHEN** presentation is generated
- **THEN** record is saved with: timestamp, prompt, file path, provider used
- **AND** user can view generation history

#### Scenario: Open recent
- **WHEN** user clicks "Recent Presentations"
- **THEN** list of recent generations is displayed
- **AND** user can open or regenerate

### Requirement: API Key Encryption
The system SHALL encrypt sensitive data like API keys.

#### Scenario: Encrypt API key
- **WHEN** API key is saved
- **THEN** it is encrypted using OS-level encryption (DPAPI on Windows)
- **AND** only current user can decrypt

#### Scenario: Decrypt API key
- **WHEN** API key is needed for request
- **THEN** it is decrypted in memory only
- **AND** never written to disk in plain text

### Requirement: Cache Management
The system SHALL cache frequently accessed data.

#### Scenario: Cache embeddings
- **WHEN** documents are processed for knowledge base
- **THEN** embeddings are cached locally
- **AND** reused for similar queries

#### Scenario: Cache AI responses
- **WHEN** identical request is made
- **THEN** cached response is returned
- **AND** user is informed it's from cache

#### Scenario: Clear cache
- **WHEN** user clicks "Clear Cache"
- **THEN** all cached data is deleted
- **AND** cache size is displayed before clearing

### Requirement: Data Export
The system SHALL allow users to export their data.

#### Scenario: Export all data
- **WHEN** user clicks "Export Data"
- **THEN** all user data is exported as JSON file
- **AND** includes: settings, history, presentations

#### Scenario: Export settings only
- **WHEN** user selects "Export Settings"
- **THEN** settings file is created
- **AND** can be imported on another machine

### Requirement: Data Import
The system SHALL allow users to import data.

#### Scenario: Import settings
- **WHEN** user imports settings file
- **THEN** settings are applied
- **AND** user is notified of any conflicts

### Requirement: Database Backup
The system SHALL automatically backup the database.

#### Scenario: Auto backup
- **WHEN** application is closed
- **THEN** database is backed up to backup directory
- **AND** last 5 backups are retained

#### Scenario: Restore backup
- **WHEN** user clicks "Restore Backup"
- **THEN** list of backups is shown
- **AND** user can select which to restore

### Requirement: Database Maintenance
The system SHALL perform database maintenance.

#### Scenario: Auto vacuum
- **WHEN** database size exceeds threshold
- **THEN** VACUUM operation is performed
- **AND** database is optimized

#### Scenario: Integrity check
- **WHEN** application starts
- **THEN** database integrity is checked
- **AND** corruption is repaired automatically if possible

### Requirement: WAL Mode
The system SHALL use Write-Ahead Logging for better performance.

#### Scenario: Enable WAL
- **WHEN** database is initialized
- **THEN** WAL mode is enabled
- **AND** concurrent reads are allowed during writes

#### Scenario: Checkpoint
- **WHEN** WAL file exceeds size threshold
- **THEN** checkpoint is performed
- **AND** WAL file is merged into main database
