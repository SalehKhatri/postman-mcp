# Contributing to Postman MCP

Thank you for your interest in contributing to Postman MCP! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A Postman account with API key

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/SalehKhatri/postman-mcp.git
   cd postman-mcp
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment**:

   ```bash
   cp .env.example .env
   # Add your POSTMAN_API_KEY to .env
   ```

5. **Build the project**:

   ```bash
   npm run build
   ```

6. **Run in development mode**:
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Ensure code is properly typed (avoid `any` when possible)

### Project Structure

```
src/
├── index.ts              # Main server entry point
├── postman-client.ts     # Postman API client
├── tools/
│   └── definitions.ts    # MCP tool definitions
├── types/
│   └── index.ts         # TypeScript type definitions
└── utils/
    └── schema-converter.ts # Zod to MCP schema conversion
```

### Adding New Tools

1. **Define the tool** in `src/tools/definitions.ts`:

   ```typescript
   export const toolDefinitions = {
     // ... existing tools
     newTool: defineTool({
       name: "new_tool",
       description: "Description of what the tool does",
       schema: z.object({
         param1: z.string().describe("Parameter description"),
         param2: z.number().optional().describe("Optional parameter"),
       }),
       handler: async (client, args) => {
         return client.newOperation(args.param1, args.param2);
       },
     }),
   };
   ```

2. **Implement the client method** in `src/postman-client.ts`:

   ```typescript
   async newOperation(param1: string, param2?: number) {
     const response = await this.request('GET', `/new-endpoint/${param1}`);
     return response.data;
   }
   ```

3. **Add TypeScript types** if needed in `src/types/index.ts`

4. **Update documentation** in README.md

### Testing

- Write unit tests for new functionality
- Test with real Postman API (use test workspace)
- Verify MCP integration works correctly
- Test error handling and edge cases

### Validation

- Use Zod schemas for input validation
- Validate all user inputs
- Provide clear error messages
- Handle API errors gracefully

## 🐛 Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the bug
- **Expected behavior** vs actual behavior
- **Environment details** (Node.js version, OS, etc.)
- **Error messages** or logs
- **MCP client** being used (Claude Desktop, Cursor, Warp, etc.)

Use the bug report template:

```markdown
**Bug Description**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Configure MCP with '...'
2. Call tool '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**

- OS: [e.g. macOS 14.0]
- Node.js: [e.g. 18.17.0]
- Package version: [e.g. 1.0.0]
- MCP Client: [e.g. Claude Desktop]

**Additional Context**
Any other context about the problem.
```

## ✨ Feature Requests

For feature requests, please include:

- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives**: What alternatives have you considered?
- **Additional context**: Any other relevant information

## 🔄 Pull Request Process

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test your changes**:

   ```bash
   npm run build
   npm run test  # if tests exist
   ```

4. **Commit your changes**:

   ```bash
   git commit -m "feat: add new feature description"
   ```

   Use conventional commit format:

   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Pull Request Requirements

- Clear description of changes
- Reference any related issues
- Include tests for new functionality
- Update documentation if needed
- Ensure CI passes
- Get approval from maintainers

## 📚 Documentation

- Update README.md for new features
- Add examples for new tools
- Update CHANGELOG.md
- Include JSDoc comments in code
- Update type definitions

## 🔐 Security

- Never commit API keys or secrets
- Use environment variables for configuration
- Follow security best practices
- Report security issues privately

## 📄 License

By contributing to Postman MCP, you agree that your contributions will be licensed under the ISC License.

## 🆘 Need Help?

- Check existing issues and discussions
- Create an issue for questions
- Join community discussions
- Follow the project for updates

## 🙏 Recognition

Contributors will be recognized in:

- CHANGELOG.md for significant contributions
- GitHub contributors list
- Release notes for major features

Thank you for contributing to Postman MCP! 🎉
