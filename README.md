# Postman MCP

A **Model Context Protocol (MCP)** server that provides seamless integration with the Postman API. This package enables AI assistants and applications to interact with Postman workspaces, collections, requests, environments, and folders programmatically.

[![NPM Version](https://img.shields.io/npm/v/postman-mcp)](https://www.npmjs.com/package/postman-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

### 📁 Workspace Management

- List all workspaces
- Get detailed workspace information
- Create new workspaces (personal/team)
- Update workspace metadata

### 📚 Collection Management

- List collections within workspaces
- Get collection details with full structure
- Create new collections
- Update collection metadata and variables
- Delete collections

### 🔧 Request Management

- Add new HTTP requests to collections
- Update existing requests (method, URL, headers, body)
- Move requests between folders
- Delete requests
- Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS)

### 🌍 Environment Management

- List environments in workspaces
- Get environment details and variables
- Create new environments with variables
- Update environment variables
- Delete environments
- Support for secret, default, and custom variable types

### 📂 Folder Organization

- Create nested folder structures
- Organize requests within folders
- Support for hierarchical folder paths

## ⚙️ Setup

### 1. Get Your Postman API Key

1. Go to [Postman Account Settings](https://go.postman.co/settings/me/api-keys)
2. Click "Generate API Key"
3. Give it a name and copy the generated key

### 2. MCP Configuration

#### For Claude Desktop

Add to your Claude Desktop configuration file (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "postman": {
      "command": "npx",
      "args": ["postman-mcp"],
      "env": {
        "POSTMAN_API_KEY": "your_postman_api_key_here"
      }
    }
  }
}
```

#### For Cursor

Add the configuration to your Cursor settings:

```json
{
  "mcp": {
    "servers": {
      "postman": {
        "command": "npx postman-mcp",
        "env": {
          "POSTMAN_API_KEY": "your_postman_api_key_here"
        }
      }
    }
  }
}
```

#### For Warp

Add the following to your Warp session setup:

```json
{
  "postman": {
    "command": "npx",
    "args": ["postman-mcp"],
    "env": {
      "POSTMAN_API_KEY": "your_postman_api_key_here"
    },
    "working_directory": null,
    "start_on_launch": true
  }
}
```

#### For Other MCP Clients

Use the standard MCP server connection with:

- **Command**: `npx postman-mcp` or `node path/to/postman-mcp/dist/index.js`
- **Transport**: stdio
- **Environment**: Set `POSTMAN_API_KEY`

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Postman API key

### Local Development

1. **Clone the repository**:

   ```bash
   git clone https://github.com/SalehKhatri/postman-mcp.git
   cd postman-mcp
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment**:

   ```bash
   cp .env.example .env
   # Edit .env and add your POSTMAN_API_KEY
   ```

4. **Build the project**:

   ```bash
   npm run build
   ```

5. **Run in development mode**:
   ```bash
   npm run dev
   ```

## 🔍 Available Tools

### Workspace Operations

- `list_workspaces` - Get all workspaces
- `get_workspace` - Get workspace details
- `create_workspace` - Create new workspace
- `update_workspace` - Update workspace info

### Collection Operations

- `list_collections` - Get collections in workspace
- `get_collection` - Get full collection structure
- `create_collection` - Create new collection
- `update_collection` - Update collection metadata
- `delete_collection` - Remove collection

### Request Operations

- `add_request` - Add HTTP request to collection
- `update_request` - Modify existing request
- `delete_request` - Remove request from collection

### Environment Operations

- `list_environments` - Get environments in workspace
- `get_environment` - Get environment variables
- `create_environment` - Create new environment
- `update_environment` - Modify environment variables
- `delete_environment` - Remove environment

### Folder Operations

- `create_folder` - Create folder in collection

## 💡 Usage Examples

### Basic Workflow

```javascript
// List all workspaces
const workspaces = await mcp.callTool("list_workspaces", {});

// Get collections in a workspace
const collections = await mcp.callTool("list_collections", {
  workspaceId: "workspace-id",
});

// Create a new request
await mcp.callTool("add_request", {
  collectionUid: "collection-uid",
  name: "Get Users",
  method: "GET",
  url: "https://api.example.com/users",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer {{token}}",
  },
  folder: "API/Users",
});

// Create an environment
await mcp.callTool("create_environment", {
  name: "Production",
  workspaceId: "workspace-id",
  values: [
    {
      key: "base_url",
      value: "https://api.production.com",
      type: "default",
    },
    {
      key: "api_key",
      value: "secret-key",
      type: "secret",
    },
  ],
});
```

## 🔐 Security

- **API Key Protection**: Store your Postman API key securely using environment variables
- **Scope Limitation**: The API key should have minimal required permissions
- **Network Security**: All requests use HTTPS to communicate with Postman API

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Postman API Documentation](https://www.postman.com/postman/postman-public-workspace/collection/i2uqzpp/postman-api)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)

## 📞 Support

- Create an issue for bug reports or feature requests
- Check existing issues before creating new ones
- Provide detailed information including error messages and environment details

---

Made with ❤️ for the developer community
