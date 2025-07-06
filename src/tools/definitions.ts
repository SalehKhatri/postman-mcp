import { z } from "zod";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { PostmanClient } from "../postman-client.js";
import { zodToMCPInputSchema } from "../utils/schema-converter.js";

interface ToolDefinition<TSchema extends z.ZodSchema, TResult> {
  name: string;
  description: string;
  schema: TSchema;
  handler: (client: PostmanClient, args: z.infer<TSchema>) => Promise<TResult>;
}

function defineTool<TSchema extends z.ZodSchema, TResult>(
  definition: ToolDefinition<TSchema, TResult>
): ToolDefinition<TSchema, TResult> {
  return definition;
}

export const toolDefinitions = {
  // Workspace Tools
  listWorkspaces: defineTool({
    name: "list_workspaces",
    description: "List all workspaces",
    schema: z.object({}),
    handler: async (client) => client.listWorkspaces(),
  }),

  getWorkspace: defineTool({
    name: "get_workspace",
    description: "Get detailed information about a specific workspace",
    schema: z.object({
      workspaceId: z.string().describe("The ID of the workspace"),
    }),
    handler: async (client, args) => {
      return client.getWorkspace(args.workspaceId);
    },
  }),

  createWorkspace: defineTool({
    name: "create_workspace",
    description: "Create a new workspace",
    schema: z.object({
      name: z.string().describe("The name of the workspace"),
      type: z.enum(["personal", "team"]).describe("The type of the workspace"),
      description: z.string().describe("The description of the workspace"),
    }),
    handler: async (client, args) => {
      return client.createWorkspace(args.name, args.type, args.description);
    },
  }),

  updateWorkspace: defineTool({
    name: "update_workspace",
    description: "Update an existing workspace",
    schema: z.object({
      workspaceId: z.string().describe("The ID of the workspace to update"),
      name: z.string().optional().describe("New name for the workspace"),
      description: z
        .string()
        .optional()
        .describe("New description for the workspace"),
    }),
    handler: async (client, args) => {
      return client.updateWorkspace(
        args.workspaceId,
        args.name,
        args.description
      );
    },
  }),

  // Collection Tools
  listCollections: defineTool({
    name: "list_collections",
    description: "List all collections in a workspace",
    schema: z.object({
      workspaceId: z.string().describe("The ID of the workspace"),
    }),
    handler: async (client, args) => {
      return client.listCollections(args.workspaceId);
    },
  }),

  getCollection: defineTool({
    name: "get_collection",
    description: "Get detailed information about a specific collection",
    schema: z.object({
      collectionUid: z.string().describe("The UID of the collection."),
    }),
    handler: async (client, args) => {
      return client.getCollection(args.collectionUid);
    },
  }),

  createCollection: defineTool({
    name: "create_collection",
    description: "Create a new collection",
    schema: z.object({
      name: z.string().describe("The name of the collection"),
      description: z.string().describe("The description of the collection"),
      workspaceId: z.string().describe("The ID of the workspace"),
    }),
    handler: async (client, args) => {
      return client.createCollection(
        args.name,
        args.workspaceId,
        args.description
      );
    },
  }),

  updateCollection: defineTool({
    name: "update_collection",
    description: "Update collection metadata (name, description, variables)",
    schema: z.object({
      collectionUid: z.string().describe("The UID of the collection to update"),
      info: z
        .object({
          name: z.string().optional().describe("New name for the collection"),
          description: z
            .string()
            .optional()
            .describe("New description for the collection"),
        })
        .optional()
        .describe("Collection info"),
      variables: z
        .array(
          z.object({
            key: z.string().describe("Variable key"),
            value: z.string().describe("Variable value"),
            type: z.string().optional().describe("Variable type"),
            description: z.string().optional().describe("Variable description"),
            disabled: z.boolean().optional().describe("Variable disabled"),
          })
        )
        .optional()
        .describe("Collection variables"),
    }),
    handler: async (client, args) => {
      const currentCollection = await client.getCollection(args.collectionUid);
      const updatedCollection = { ...currentCollection };
      if (args.info) {
        if (args.info.name !== undefined) {
          updatedCollection.info.name = args.info.name;
        }
        if (args.info.description !== undefined) {
          updatedCollection.info.description = args.info.description;
        }
      }

      if (args.variables !== undefined) {
        updatedCollection.variable = args.variables;
      }

      return client.updateCollection(args.collectionUid, updatedCollection);
    },
  }),

  deleteCollection: defineTool({
    name: "delete_collection",
    description: "Delete a Postman collection",
    schema: z.object({
      collectionUid: z.string().describe("The UID of the collection to delete"),
    }),
    handler: async (client, args) => {
      return client.deleteCollection(args.collectionUid);
    },
  }),

  // Request Tools
  addRequest: defineTool({
    name: "add_request",
    description: "Add a new request to a collection",
    schema: z.object({
      collectionUid: z.string().describe("The UID of the collection"),
      name: z.string().describe("Name of the request"),
      method: z
        .enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
        .describe("HTTP method"),
      url: z.string().describe("Request URL"),
      headers: z
        .record(z.string())
        .optional()
        .describe("Request headers as key-value pairs"),
      body: z
        .any()
        .optional()
        .describe("Request body (will be stringified if object)"),
      folder: z
        .string()
        .optional()
        .describe('Folder path (e.g., "folder1/folder2")'),
      description: z.string().optional().describe("Request description"),
    }),
    handler: async (client, args) =>
      client.addRequest(args.collectionUid, {
        name: args.name,
        method: args.method,
        url: args.url,
        headers: args.headers,
        body: args.body,
        folder: args.folder,
        description: args.description,
      }),
  }),

  updateRequest: defineTool({
    name: "update_request",
    description: "Update an existing request in a collection",
    schema: z.object({
      collectionUid: z.string().describe("The UID of the collection"),
      requestName: z.string().describe("Current name of the request to update"),
      updates: z
        .object({
          name: z.string().optional(),
          method: z
            .enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
            .optional(),
          url: z.string().optional(),
          headers: z.record(z.string()).optional(),
          body: z.any().optional(),
          description: z.string().optional(),
          folder: z.string().optional(),
        })
        .describe("Fields to update"),
    }),
    handler: async (client, args) =>
      client.updateRequest(args.collectionUid, args.requestName, args.updates),
  }),

  deleteRequest: defineTool({
    name: "delete_request",
    description: "Delete a request from a collection",
    schema: z.object({
      collectionUid: z.string().describe("The UID of the collection"),
      requestName: z.string().describe("Name of the request to delete"),
    }),
    handler: async (client, args) =>
      client.deleteRequest(args.collectionUid, args.requestName),
  }),

  // Environment tools
  listEnvironments: defineTool({
    name: "list_environments",
    description: "List all environments",
    schema: z.object({
      workspaceId: z.string().describe("The ID of the workspace"),
    }),
    handler: async (client, args) => client.listEnvironments(args.workspaceId),
  }),

  getEnvironment: defineTool({
    name: "get_environment",
    description: "Get detailed information about a specific environment",
    schema: z.object({
      environmentUid: z.string().describe("The UID of the environment"),
    }),
    handler: async (client, args) => client.getEnvironment(args.environmentUid),
  }),

  createEnvironment: defineTool({
    name: "create_environment",
    description: "Create a new environment",
    schema: z.object({
      name: z.string().describe("Name of the environment"),
      values: z
        .array(
          z.object({
            key: z.string().describe("Variable key"),
            value: z.string().describe("Variable value"),
            enabled: z.boolean().optional().describe("Variable enabled"),
            type: z
              .enum(["secret", "default", "any"])
              .optional()
              .describe("Variable type"),
          })
        )
        .optional()
        .describe("Values for the environment"),
      workspaceId: z.string().describe("The ID of the workspace"),
    }),
    handler: async (client, args) =>
      client.createEnvironment(args.name, args.values || [], args.workspaceId),
  }),

  updateEnvironment: defineTool({
    name: "update_environment",
    description: "Update an existing environment",
    schema: z.object({
      environmentUid: z
        .string()
        .describe("The UID of the environment to update"),
      name: z.string().optional().describe("Name of the environment"),
      values: z
        .array(
          z.object({
            key: z.string().describe("Variable key"),
            value: z.string().describe("Variable value"),
            enabled: z.boolean().optional().describe("Variable enabled"),
            type: z
              .enum(["secret", "default", "any"])
              .optional()
              .describe("Variable type"),
          })
        )
        .optional()
        .describe("Updated values for the environment"),
    }),
    handler: async (client, args) =>
      client.updateEnvironment(args.environmentUid, args.name, args.values),
  }),

  deleteEnvironment: defineTool({
    name: "delete_environment",
    description: "Delete an existing environment",
    schema: z.object({
      environmentUid: z
        .string()
        .describe("The UID of the environment to delete"),
    }),
    handler: async (client, args) =>
      client.deleteEnvironment(args.environmentUid),
  }),

  // Folder tools
  createFolder: defineTool({
    name: "create_folder",
    description: "Create a new folder in a collection",
    schema: z.object({
      collectionUid: z.string().describe("The UID of the collection"),
      folderName: z.string().describe("Name of the folder to create"),
      parentFolder: z
        .string()
        .optional()
        .describe("Parent folder path (optional)"),
    }),
    handler: async (client, args) =>
      client.createFolder(
        args.collectionUid,
        args.folderName,
        args.parentFolder
      ),
  }),

  deleteFolder: defineTool({
    name: "delete_folder",
    description: "Delete a folder from a collection",
    schema: z.object({
      collectionUid: z.string().describe("The UID of the collection"),
      folderName: z.string().describe("Name of the folder to delete"),
      parentFolder: z
        .string()
        .optional()
        .describe("Parent folder path (optional)"),
    }),
    handler: async (client, args) =>
      client.deleteFolder(
        args.collectionUid,
        args.folderName,
        args.parentFolder
      ),
  }),
} as const;

export const tools: Tool[] = Object.values(toolDefinitions).map((def) => ({
  name: def.name,
  description: def.description,
  inputSchema: zodToMCPInputSchema(def.schema),
}));

// Create a map for easy handler lookup
export const toolHandlers = Object.fromEntries(
  Object.values(toolDefinitions).map((def) => [def.name, def])
);

// Export tool names for type safety
export const toolNames = Object.fromEntries(
  Object.entries(toolDefinitions).map(([key, def]) => [
    key.toUpperCase(),
    def.name,
  ])
) as Record<string, string>;

// Type helpers
export type ToolName =
  (typeof toolDefinitions)[keyof typeof toolDefinitions]["name"];
export type ToolArgs<T extends ToolName> = z.infer<
  (typeof toolDefinitions)[keyof typeof toolDefinitions]["schema"]
>;
