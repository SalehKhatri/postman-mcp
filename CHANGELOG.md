# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Postman MCP server
- Comprehensive workspace management features
- Full collection CRUD operations
- Request management with folder organization
- Environment management with variable support
- Nested folder creation and organization
- Support for all HTTP methods
- MCP integration for AI assistants

### Security
- Secure API key handling through environment variables
- HTTPS-only communication with Postman API

## [1.0.0] - 2025-01-05

### Added
- **Workspace Operations**
  - List all workspaces
  - Get workspace details
  - Create new workspaces (personal/team)
  - Update workspace metadata

- **Collection Operations**
  - List collections in workspace
  - Get collection details with full structure
  - Create new collections
  - Update collection metadata and variables
  - Delete collections

- **Request Operations**
  - Add HTTP requests to collections
  - Update existing requests (method, URL, headers, body)
  - Move requests between folders
  - Delete requests
  - Support for GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

- **Environment Operations**
  - List environments in workspace
  - Get environment variables
  - Create new environments
  - Update environment variables
  - Delete environments
  - Support for secret, default, and custom variable types

- **Folder Operations**
  - Create nested folder structures
  - Organize requests within folders
  - Support for hierarchical folder paths

- **MCP Integration**
  - Full Model Context Protocol compliance
  - TypeScript implementation with Zod validation
  - Comprehensive error handling
  - Support for Claude Desktop, Cursor, and Warp

### Technical
- Built with TypeScript and @modelcontextprotocol/sdk
- Input validation using Zod schemas
- Axios for HTTP client operations
- Environment variable configuration support
- Comprehensive test coverage

### Documentation
- Complete README with setup instructions
- API documentation for all tools
- Usage examples and best practices
- Security guidelines
- Contributing guidelines

---

## Release Notes

### Version 1.0.0
This is the initial stable release of Postman MCP, providing complete integration between MCP-compatible AI assistants and the Postman API. The package offers comprehensive workspace, collection, request, environment, and folder management capabilities.

**Key Features:**
- 16 MCP tools covering all major Postman operations
- Type-safe implementation with full TypeScript support
- Comprehensive input validation
- Support for multiple MCP clients (Claude Desktop, Cursor, Warp)
- Secure API key management
- Production-ready error handling

**Getting Started:**
1. Install with `npm install postman-mcp`
2. Get your Postman API key from your account settings
3. Configure your MCP client with the server
4. Start managing your Postman resources through AI assistants!

For detailed setup instructions, see the [README.md](README.md) file.
