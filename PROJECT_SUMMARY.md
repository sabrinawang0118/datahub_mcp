# DataHub MCP Server - Project Summary

## 📋 Overview

This project is a **Model Context Protocol (MCP) server** that enables AI assistants (like Claude, Cursor, etc.) to interact with DataHub's metadata management platform. It provides a standardized interface for AI tools to search datasets, retrieve schema information, explore data lineage, and more.

## 🏗️ Architecture

### Components

1. **MCP Server (`src/index.ts`)**
   - Implements the Model Context Protocol
   - Defines 6 tools for DataHub interaction
   - Handles tool execution and error handling
   - Runs on stdio for MCP communication

2. **DataHub Client (`src/datahub-client.ts`)**
   - Wraps DataHub's GraphQL and REST APIs
   - Handles authentication with personal access tokens
   - Provides typed methods for common operations
   - Manages API requests and responses

3. **Health Check Server (`src/health.ts`)**
   - HTTP server for deployment platform health checks
   - Runs on port 10000 (configurable)
   - Returns JSON health status
   - Required for Render and similar platforms

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **MCP SDK**: @modelcontextprotocol/sdk
- **HTTP Client**: Axios
- **Build Tool**: TypeScript Compiler (tsc)
- **Deployment**: Render (with Docker support)

## 🛠️ Available Tools

| Tool | Description | Key Parameters |
|------|-------------|----------------|
| `search_datasets` | Search for datasets by keyword | query, limit |
| `get_dataset_info` | Get detailed dataset metadata | urn |
| `get_dataset_schema` | Retrieve dataset schema and fields | urn |
| `get_dataset_lineage` | Get upstream/downstream dependencies | urn, direction |
| `search_entities` | Search any entity type | query, entityType, limit |
| `get_entity_info` | Get info about any entity | urn |

## 📁 Project Structure

```
datahub-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server implementation
│   ├── datahub-client.ts     # DataHub API client
│   └── health.ts             # Health check HTTP server
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD pipeline
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── render.yaml               # Render deployment config
├── Dockerfile                # Docker container definition
├── .dockerignore             # Docker ignore patterns
├── .gitignore                # Git ignore patterns
├── .env.example              # Environment variable template
├── README.md                 # Main documentation
├── QUICKSTART.md             # Quick start guide
├── DEPLOYMENT.md             # Detailed deployment guide
├── PROJECT_SUMMARY.md        # This file
└── LICENSE                   # MIT License
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATAHUB_GMS_URL` | Yes | DataHub GMS endpoint | `http://localhost:8080` |
| `DATAHUB_GMS_TOKEN` | Yes | Personal access token | `eyJhbGc...` |
| `PORT` | No | Health check server port | `3000` (default: 10000) |
| `NODE_ENV` | No | Environment mode | `production` |

### DataHub Requirements

- DataHub version: 0.10.0+
- Required permissions:
  - Read access to datasets
  - Read access to entity metadata
  - GraphQL API access

## 🚀 Deployment Options

### 1. Local Development
```bash
npm install
npm run dev
```

### 2. Render (Recommended for Production)
- Automatic deployments from GitHub
- Free tier available
- Built-in SSL certificates
- Health check monitoring
- See `DEPLOYMENT.md` for details

### 3. Docker
```bash
docker build -t datahub-mcp-server .
docker run -p 3000:3000 \
  -e DATAHUB_GMS_URL=http://localhost:8080 \
  -e DATAHUB_GMS_TOKEN=your_token \
  datahub-mcp-server
```

### 4. Other Platforms
Compatible with:
- Heroku
- Railway
- Fly.io
- AWS ECS
- Google Cloud Run
- Azure Container Instances

## 🔌 Integration

### Claude Desktop

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "datahub": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "DATAHUB_GMS_URL": "http://localhost:8080",
        "DATAHUB_GMS_TOKEN": "your_token"
      }
    }
  }
}
```

### Cursor

Add to MCP settings:
```json
{
  "mcpServers": {
    "datahub": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "DATAHUB_GMS_URL": "http://localhost:8080",
        "DATAHUB_GMS_TOKEN": "your_token"
      }
    }
  }
}
```

### Other MCP Clients

Any MCP-compatible client can use this server by:
1. Running the server with appropriate environment variables
2. Connecting via stdio transport
3. Calling the available tools

## 📊 API Examples

### Search Datasets
```json
{
  "tool": "search_datasets",
  "arguments": {
    "query": "user",
    "limit": 10
  }
}
```

### Get Dataset Schema
```json
{
  "tool": "get_dataset_schema",
  "arguments": {
    "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,user_table,PROD)"
  }
}
```

### Get Lineage
```json
{
  "tool": "get_dataset_lineage",
  "arguments": {
    "urn": "urn:li:dataset:(urn:li:dataPlatform:hive,sales,PROD)",
    "direction": "BOTH"
  }
}
```

## 🔒 Security Considerations

1. **Token Management**
   - Never commit tokens to version control
   - Use environment variables
   - Rotate tokens regularly
   - Use read-only tokens when possible

2. **Network Security**
   - Use HTTPS for DataHub connections
   - Consider VPN for private DataHub instances
   - Implement rate limiting if exposing publicly

3. **Access Control**
   - Token permissions determine available data
   - Server inherits token's access level
   - Consider separate tokens per environment

## 📈 Monitoring

### Health Checks
- Endpoint: `/health`
- Returns: `{ status: "healthy", service: "datahub-mcp-server", timestamp: "..." }`
- Used by: Render, Docker, Kubernetes

### Logging
- Server logs to stderr (MCP convention)
- Includes startup messages
- Error messages with stack traces
- Request/response logging (in development)

### Metrics (Future Enhancement)
- Request count per tool
- Response times
- Error rates
- DataHub API latency

## 🧪 Testing

### Manual Testing
```bash
# Start server
npm run dev

# Test health endpoint
curl http://localhost:3000/health

# Test with MCP client
# (Use Claude Desktop or Cursor)
```

### Automated Testing (Future)
- Unit tests for DataHub client
- Integration tests with mock DataHub
- E2E tests with real DataHub instance

## 🛣️ Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic MCP server implementation
- [x] DataHub client with GraphQL
- [x] 6 essential tools
- [x] Render deployment support
- [x] Documentation

### Phase 2: Enhanced Features (Planned)
- [ ] Caching for frequently accessed data
- [ ] Batch operations support
- [ ] Advanced search filters
- [ ] Data quality metrics
- [ ] Usage analytics

### Phase 3: Advanced Capabilities (Future)
- [ ] Write operations (with permissions)
- [ ] Real-time updates via webhooks
- [ ] Multi-tenant support
- [ ] Custom tool plugins
- [ ] GraphQL query builder

## 🤝 Contributing

Contributions welcome! Areas for improvement:

1. **Features**
   - Additional DataHub tools
   - Advanced search capabilities
   - Caching layer
   - Metrics and monitoring

2. **Documentation**
   - More examples
   - Video tutorials
   - API reference
   - Troubleshooting guide

3. **Testing**
   - Unit tests
   - Integration tests
   - Performance tests

4. **DevOps**
   - CI/CD improvements
   - Multi-platform support
   - Kubernetes manifests

## 📚 Resources

### Documentation
- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide

### External Resources
- [DataHub Documentation](https://datahubproject.io/docs)
- [MCP Specification](https://modelcontextprotocol.io)
- [Render Documentation](https://render.com/docs)

### Related Projects
- [DataHub](https://github.com/datahub-project/datahub)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop](https://claude.ai/desktop)

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 👥 Support

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: [Your contact email]
- **DataHub Slack**: Join #mcp channel

## 🎯 Use Cases

1. **Data Discovery**
   - AI assistants help users find relevant datasets
   - Natural language search across metadata
   - Contextual recommendations

2. **Data Documentation**
   - AI generates documentation from schema
   - Explains complex data lineage
   - Suggests data quality improvements

3. **Data Governance**
   - AI checks compliance with policies
   - Identifies sensitive data
   - Suggests ownership and tags

4. **Data Engineering**
   - AI helps understand dependencies
   - Suggests optimization opportunities
   - Explains data transformations

5. **Analytics Support**
   - AI recommends relevant datasets
   - Explains data definitions
   - Helps with SQL query generation

## 🏆 Best Practices

1. **Development**
   - Use TypeScript for type safety
   - Follow MCP conventions
   - Handle errors gracefully
   - Log important events

2. **Deployment**
   - Use environment-specific configs
   - Enable health checks
   - Monitor logs and metrics
   - Set up alerts

3. **Security**
   - Never expose tokens
   - Use HTTPS in production
   - Rotate credentials regularly
   - Implement rate limiting

4. **Performance**
   - Cache frequently accessed data
   - Use connection pooling
   - Optimize GraphQL queries
   - Monitor response times

---

**Version**: 1.0.0  
**Last Updated**: October 7, 2025  
**Maintained By**: [Your Name/Team]
