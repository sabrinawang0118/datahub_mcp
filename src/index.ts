#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import { DataHubClient } from './datahub-client.js';
import { startHealthCheckServer } from './health.js';

// Load environment variables
dotenv.config();

const DATAHUB_GMS_URL = process.env.DATAHUB_GMS_URL || 'http://localhost:8080';
const DATAHUB_GMS_TOKEN = process.env.DATAHUB_GMS_TOKEN || '';

if (!DATAHUB_GMS_TOKEN) {
  console.error('Error: DATAHUB_GMS_TOKEN environment variable is required');
  process.exit(1);
}

// Initialize DataHub client
const datahubClient = new DataHubClient(DATAHUB_GMS_URL, DATAHUB_GMS_TOKEN);

// Define available tools
const TOOLS: Tool[] = [
  {
    name: 'search_datasets',
    description: 'Search for datasets in DataHub by keyword or query',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query to find datasets',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_dataset_info',
    description: 'Get detailed information about a specific dataset',
    inputSchema: {
      type: 'object',
      properties: {
        urn: {
          type: 'string',
          description: 'The URN (Uniform Resource Name) of the dataset',
        },
      },
      required: ['urn'],
    },
  },
  {
    name: 'get_dataset_schema',
    description: 'Get the schema information for a dataset',
    inputSchema: {
      type: 'object',
      properties: {
        urn: {
          type: 'string',
          description: 'The URN of the dataset',
        },
      },
      required: ['urn'],
    },
  },
  {
    name: 'get_dataset_lineage',
    description: 'Get lineage information (upstream and downstream dependencies) for a dataset',
    inputSchema: {
      type: 'object',
      properties: {
        urn: {
          type: 'string',
          description: 'The URN of the dataset',
        },
        direction: {
          type: 'string',
          enum: ['UPSTREAM', 'DOWNSTREAM', 'BOTH'],
          description: 'Direction of lineage to retrieve',
          default: 'BOTH',
        },
      },
      required: ['urn'],
    },
  },
  {
    name: 'search_entities',
    description: 'Search for any type of entity in DataHub (datasets, dashboards, charts, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        entityType: {
          type: 'string',
          description: 'Type of entity to search for (e.g., DATASET, DASHBOARD, CHART, DATA_FLOW)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default: 10)',
          default: 10,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_entity_info',
    description: 'Get detailed information about any entity by its URN',
    inputSchema: {
      type: 'object',
      properties: {
        urn: {
          type: 'string',
          description: 'The URN of the entity',
        },
      },
      required: ['urn'],
    },
  },
];

// Create MCP server
const server = new Server(
  {
    name: 'datahub-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_datasets': {
        const { query, limit = 10 } = args as { query: string; limit?: number };
        const results = await datahubClient.searchDatasets(query, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_dataset_info': {
        const { urn } = args as { urn: string };
        const info = await datahubClient.getDatasetInfo(urn);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      }

      case 'get_dataset_schema': {
        const { urn } = args as { urn: string };
        const schema = await datahubClient.getDatasetSchema(urn);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(schema, null, 2),
            },
          ],
        };
      }

      case 'get_dataset_lineage': {
        const { urn, direction = 'BOTH' } = args as {
          urn: string;
          direction?: string;
        };
        const lineage = await datahubClient.getDatasetLineage(urn, direction);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(lineage, null, 2),
            },
          ],
        };
      }

      case 'search_entities': {
        const { query, entityType, limit = 10 } = args as {
          query: string;
          entityType?: string;
          limit?: number;
        };
        const results = await datahubClient.searchEntities(query, entityType, limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'get_entity_info': {
        const { urn } = args as { urn: string };
        const info = await datahubClient.getEntityInfo(urn);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  // Start health check server for deployment platforms
  const port = parseInt(process.env.PORT || '10000', 10);
  startHealthCheckServer(port);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DataHub MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
