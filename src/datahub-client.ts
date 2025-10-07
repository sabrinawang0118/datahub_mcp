import axios, { AxiosInstance } from 'axios';

export class DataHubClient {
  private client: AxiosInstance;
  private gmsUrl: string;

  constructor(gmsUrl: string, token: string) {
    this.gmsUrl = gmsUrl;
    this.client = axios.create({
      baseURL: `${gmsUrl}/api/graphql`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Search for datasets in DataHub
   */
  async searchDatasets(query: string, limit: number = 10) {
    const graphqlQuery = `
      query searchDatasets($input: SearchInput!) {
        search(input: $input) {
          start
          count
          total
          searchResults {
            entity {
              urn
              type
              ... on Dataset {
                name
                description
                platform {
                  name
                }
                properties {
                  name
                  description
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      input: {
        type: 'DATASET',
        query,
        start: 0,
        count: limit,
      },
    };

    const response = await this.client.post('', {
      query: graphqlQuery,
      variables,
    });

    return response.data.data.search;
  }

  /**
   * Get detailed information about a dataset
   */
  async getDatasetInfo(urn: string) {
    const graphqlQuery = `
      query getDataset($urn: String!) {
        dataset(urn: $urn) {
          urn
          name
          description
          platform {
            name
          }
          properties {
            name
            description
            customProperties {
              key
              value
            }
          }
          ownership {
            owners {
              owner {
                ... on CorpUser {
                  username
                  info {
                    displayName
                    email
                  }
                }
              }
              type
            }
          }
          tags {
            tags {
              tag {
                name
                description
              }
            }
          }
          glossaryTerms {
            terms {
              term {
                name
                description
              }
            }
          }
        }
      }
    `;

    const variables = { urn };

    const response = await this.client.post('', {
      query: graphqlQuery,
      variables,
    });

    return response.data.data.dataset;
  }

  /**
   * Get schema information for a dataset
   */
  async getDatasetSchema(urn: string) {
    const graphqlQuery = `
      query getDatasetSchema($urn: String!) {
        dataset(urn: $urn) {
          urn
          name
          schemaMetadata {
            name
            version
            fields {
              fieldPath
              type
              nativeDataType
              description
              nullable
              isPartOfKey
            }
          }
        }
      }
    `;

    const variables = { urn };

    const response = await this.client.post('', {
      query: graphqlQuery,
      variables,
    });

    return response.data.data.dataset;
  }

  /**
   * Get lineage information for a dataset
   */
  async getDatasetLineage(urn: string, direction: string = 'BOTH') {
    const graphqlQuery = `
      query getLineage($urn: String!, $input: LineageInput!) {
        dataset(urn: $urn) {
          urn
          name
          upstream: lineage(input: $input) {
            ... on EntityLineageResult {
              relationships {
                entity {
                  urn
                  type
                  ... on Dataset {
                    name
                    platform {
                      name
                    }
                  }
                }
                type
              }
            }
          }
        }
      }
    `;

    const variables = {
      urn,
      input: {
        direction,
        start: 0,
        count: 100,
      },
    };

    const response = await this.client.post('', {
      query: graphqlQuery,
      variables,
    });

    return response.data.data.dataset;
  }

  /**
   * Search for any type of entity in DataHub
   */
  async searchEntities(query: string, entityType?: string, limit: number = 10) {
    const graphqlQuery = `
      query searchEntities($input: SearchInput!) {
        search(input: $input) {
          start
          count
          total
          searchResults {
            entity {
              urn
              type
            }
          }
        }
      }
    `;

    const variables = {
      input: {
        type: entityType || 'DATASET',
        query,
        start: 0,
        count: limit,
      },
    };

    const response = await this.client.post('', {
      query: graphqlQuery,
      variables,
    });

    return response.data.data.search;
  }

  /**
   * Get information about any entity by URN
   */
  async getEntityInfo(urn: string) {
    // Use REST API for generic entity retrieval
    const restClient = axios.create({
      baseURL: `${this.gmsUrl}/entities`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.client.defaults.headers.Authorization as string,
      },
    });

    const response = await restClient.get(`/${encodeURIComponent(urn)}`);
    return response.data;
  }
}
