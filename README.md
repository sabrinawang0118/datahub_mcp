# DataHub MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to DataHub metadata, enabling them to search datasets, retrieve schema information, explore lineage, and more.

## Features

- 🔍 **Search Datasets**: Find datasets by keyword or query
- 📊 **Dataset Information**: Get detailed metadata about datasets
- 🗂️ **Schema Retrieval**: Access schema information and field details
- 🔗 **Lineage Tracking**: Explore upstream and downstream dependencies
- 🌐 **Entity Search**: Search for any type of entity (datasets, dashboards, charts, etc.)
- 📈 **Entity Information**: Retrieve detailed information about any entity

## Prerequisites

- Node.js 18 or higher
- A running DataHub instance (self-hosted or DataHub Cloud)
- DataHub Personal Access Token

## Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd datahub-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
DATAHUB_GMS_URL=http://localhost:8080  # or https://<tenant>.acryl.io for DataHub Cloud
DATAHUB_GMS_TOKEN=your_personal_access_token_here
PORT=3000
```

## Getting Your DataHub Token

### For Self-Hosted DataHub:
1. Log in to your DataHub instance
2. Go to Settings → Access Tokens
3. Click "Generate Personal Access Token"
4. Copy the token and add it to your `.env` file

### For DataHub Cloud:
1. Log in to your DataHub Cloud account at `https://<tenant>.acryl.io`
2. Go to Settings → Access Tokens
3. Generate a new token
4. Use `https://<tenant>.acryl.io` as your `DATAHUB_GMS_URL`

## Development

Run the server in development mode:
```bash
npm run dev
```

Build the TypeScript code:
```bash
npm run build
```

Run the built server:
```bash
npm start
```

## Available Tools

The MCP server provides the following tools:

### 1. search_datasets
Search for datasets in DataHub by keyword or query.

**Parameters:**
- `query` (string, required): Search query to find datasets
- `limit` (number, optional): Maximum number of results (default: 10)

### 2. get_dataset_info
Get detailed information about a specific dataset.

**Parameters:**
- `urn` (string, required): The URN of the dataset

### 3. get_dataset_schema
Get the schema information for a dataset.

**Parameters:**
- `urn` (string, required): The URN of the dataset

### 4. get_dataset_lineage
Get lineage information (upstream and downstream dependencies) for a dataset.

**Parameters:**
- `urn` (string, required): The URN of the dataset
- `direction` (string, optional): Direction of lineage - `UPSTREAM`, `DOWNSTREAM`, or `BOTH` (default: `BOTH`)

### 5. search_entities
Search for any type of entity in DataHub.

**Parameters:**
- `query` (string, required): Search query
- `entityType` (string, optional): Type of entity (e.g., DATASET, DASHBOARD, CHART, DATA_FLOW)
- `limit` (number, optional): Maximum number of results (default: 10)

### 6. get_entity_info
Get detailed information about any entity by its URN.

**Parameters:**
- `urn` (string, required): The URN of the entity

## Deploying to Render

### Option 1: Using Render Dashboard

1. **Create a Render Account**: Sign up at [render.com](https://render.com)

2. **Create a New Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository

3. **Configure the Service**:
   - **Name**: `datahub-mcp-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose your preferred plan)

4. **Set Environment Variables**:
   - Go to the "Environment" tab
   - Add the following variables:
     - `DATAHUB_GMS_URL`: Your DataHub GMS URL
     - `DATAHUB_GMS_TOKEN`: Your DataHub personal access token
     - `PORT`: `10000` (Render's default)

5. **Deploy**: Click "Create Web Service"

### Option 2: Using render.yaml (Infrastructure as Code)

This repository includes a `render.yaml` file for automated deployment:

1. Push your code to GitHub
2. In Render dashboard, click "New" → "Blueprint"
3. Connect your repository
4. Render will automatically detect the `render.yaml` file
5. Set the required environment variables:
   - `DATAHUB_GMS_URL`
   - `DATAHUB_GMS_TOKEN`
6. Click "Apply"

### Option 3: Using Docker

Build and run with Docker:

```bash
# Build the image
docker build -t datahub-mcp-server .

# Run the container
docker run -p 3000:3000 \
  -e DATAHUB_GMS_URL=http://your-datahub-url:8080 \
  -e DATAHUB_GMS_TOKEN=your_token_here \
  datahub-mcp-server
```

## Using with AI Tools

### Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "datahub": {
      "command": "node",
      "args": ["/path/to/datahub-mcp-server/dist/index.js"],
      "env": {
        "DATAHUB_GMS_URL": "http://localhost:8080",
        "DATAHUB_GMS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "datahub": {
      "command": "node",
      "args": ["/path/to/datahub-mcp-server/dist/index.js"],
      "env": {
        "DATAHUB_GMS_URL": "http://localhost:8080",
        "DATAHUB_GMS_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Health Check

The server includes a health check endpoint at `/health` that returns:

```json
{
  "status": "healthy",
  "service": "datahub-mcp-server",
  "timestamp": "2025-10-07T12:00:00.000Z"
}
```

This is useful for deployment platforms like Render to monitor the service.

## Troubleshooting

### Connection Issues

If you can't connect to DataHub:
- Verify your `DATAHUB_GMS_URL` is correct
- Check that your DataHub instance is running and accessible
- Ensure your token has the necessary permissions

### Authentication Errors

If you get authentication errors:
- Verify your `DATAHUB_GMS_TOKEN` is valid
- Check that the token hasn't expired
- Ensure the token has the required permissions for the operations you're trying to perform

### Build Errors

If you encounter build errors:
- Make sure you're using Node.js 18 or higher
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check that all dependencies are properly installed

## Architecture

The server consists of:

- **index.ts**: Main MCP server implementation with tool definitions and handlers
- **datahub-client.ts**: DataHub API client using GraphQL and REST endpoints
- **health.ts**: Health check HTTP server for deployment platforms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions:
- DataHub Documentation: https://datahubproject.io/docs
- MCP Documentation: https://modelcontextprotocol.io
- Create an issue in this repository
