import { z } from "zod";
export const schemas = {
    listCollections: z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
    }),
    getWorkspace: z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
    }),
    createWorkspace: z.object({
        name: z.string().describe("Name of the workspace"),
        type: z.enum(["personal", "team"]).describe("Type of the workspace"),
        description: z.string().optional().describe("Description of the workspace"),
    }),
    updateWorkspace: z.object({
        workspaceId: z.string().describe("The ID of the workspace to update"),
        name: z.string().optional().describe("New name for the workspace"),
        description: z
            .string()
            .optional()
            .describe("New description for the workspace"),
    }),
    getCollection: z.object({
        collectionUid: z.string().describe("The UID of the collection."),
    }),
    createCollection: z.object({
        name: z.string().describe("Name of the collection"),
        description: z
            .string()
            .optional()
            .describe("Description of the collection"),
        workspaceId: z.string().describe("The ID of the workspace"),
    }),
    updateCollection: z.object({
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
            .array(z.object({
            key: z.string().describe("Variable key"),
            value: z.string().describe("Variable value"),
            type: z.string().optional().describe("Variable type"),
            description: z.string().optional().describe("Variable description"),
            disabled: z.boolean().optional().describe("Variable disabled"),
        }))
            .optional()
            .describe("Collection variables"),
    }),
    deleteCollection: z.object({
        collectionUid: z.string().describe("The UID of the collection to delete"),
    }),
    addRequest: z.object({
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
    updateRequest: z.object({
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
        })
            .describe("Fields to update"),
    }),
    deleteRequest: z.object({
        collectionUid: z.string().describe("The UID of the collection"),
        requestName: z.string().describe("Name of the request to delete"),
    }),
    listEnvironments: z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
    }),
    getEnvironment: z.object({
        environmentUid: z.string().describe("The UID of the environment"),
    }),
    createEnvironment: z.object({
        name: z.string().describe("Name of the environment"),
        values: z
            .array(z.object({
            key: z.string().describe("Variable key"),
            value: z.string().describe("Variable value"),
            enabled: z.boolean().optional().describe("Variable enabled"),
            type: z
                .enum(["secret", "default", "any"])
                .optional()
                .describe("Variable type"),
        }))
            .optional()
            .describe("Values for the environment"),
        workspaceId: z.string().describe("The ID of the workspace"),
    }),
    updateEnvironment: z.object({
        environmentUid: z.string().describe("The UID of the environment to update"),
        name: z.string().optional().describe("Name of the environment"),
        values: z
            .array(z.object({
            key: z.string().describe("Variable key"),
            value: z.string().describe("Variable value"),
            enabled: z.boolean().optional().describe("Variable enabled"),
            type: z
                .enum(["secret", "default", "any"])
                .optional()
                .describe("Variable type"),
        }))
            .optional()
            .describe("Updated values for the environment"),
    }),
    deleteEnvironment: z.object({
        environmentUid: z.string().describe("The UID of the environment to delete"),
    }),
    createFolder: z.object({
        collectionUid: z.string().describe("The UID of the collection"),
        folderName: z.string().describe("Name of the folder to create"),
        parentFolder: z
            .string()
            .optional()
            .describe("Parent folder path (optional)"),
    }),
};
export const TOOLS = [
    {
        name: "list_collections",
        description: "List all collections",
        inputSchema: {
            type: "object",
            properties: {
                workspaceId: {
                    type: "string",
                    description: "The ID of the workspace",
                },
            },
            required: ["workspaceId"],
        },
    },
    {
        name: "get_collection",
        description: "Get detailed information about a specific collection",
        inputSchema: {
            type: "object",
            properties: {
                collectionUid: {
                    type: "string",
                    description: "The UID of the collection",
                },
            },
            required: ["collectionUid"],
        },
    },
    {
        name: "update_workspace",
        description: "Update a workspace",
        inputSchema: {
            type: "object",
            properties: {
                workspaceId: {
                    type: "string",
                    description: "The ID of the workspace to update",
                },
                name: { type: "string", description: "New name for the workspace" },
                description: {
                    type: "string",
                    description: "New description for the workspace",
                },
            },
            required: ["workspaceId"],
        },
    },
    {
        name: "list_workspaces",
        description: "List all workspaces",
        inputSchema: {
            type: "object",
            properties: {},
            required: [],
        },
    },
    {
        name: "get_workspace",
        description: "Get detailed information about a specific workspace",
        inputSchema: {
            type: "object",
            properties: {
                workspaceId: { type: "string", description: "The ID of the workspace" },
            },
            required: ["workspaceId"],
        },
    },
    {
        name: "create_workspace",
        description: "Create a new workspace",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Name of the workspace" },
                type: {
                    type: "string",
                    enum: ["personal", "team"],
                    description: "Type of the workspace",
                },
                description: {
                    type: "string",
                    description: "Description of the workspace",
                },
            },
            required: ["name", "type"],
        },
    },
    {
        name: "create_collection",
        description: "Create a new Postman collection",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Name of the collection" },
                description: {
                    type: "string",
                    description: "Description of the collection",
                },
                workspaceId: {
                    type: "string",
                    description: "The ID of the workspace",
                },
            },
            required: ["name", "workspaceId"],
        },
    },
    {
        name: "update_collection",
        description: "Update collection metadata (name, description, variables)",
        inputSchema: {
            type: "object",
            properties: {
                collectionUid: {
                    type: "string",
                    description: "The UID of the collection to update",
                },
                info: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                    },
                },
                variables: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            key: { type: "string" },
                            value: { type: "string" },
                            type: { type: "string" },
                            description: { type: "string" },
                            disabled: { type: "boolean" },
                        },
                        required: ["key", "value"],
                    },
                },
            },
            required: ["collectionUid"],
        },
    },
    {
        name: "delete_collection",
        description: "Delete a Postman collection",
        inputSchema: {
            type: "object",
            properties: {
                collectionUid: {
                    type: "string",
                    description: "The UID of the collection to delete",
                },
            },
            required: ["collectionUid"],
        },
    },
    {
        name: "add_request",
        description: "Add a new request to a collection",
        inputSchema: {
            type: "object",
            properties: {
                collectionUid: {
                    type: "string",
                    description: "The UID of the collection",
                },
                name: { type: "string", description: "Name of the request" },
                method: {
                    type: "string",
                    enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
                    description: "HTTP method",
                },
                url: { type: "string", description: "Request URL" },
                headers: {
                    type: "object",
                    additionalProperties: { type: "string" },
                    description: "Request headers as key-value pairs",
                },
                body: { description: "Request body (will be stringified if object)" },
                folder: {
                    type: "string",
                    description: 'Folder path (e.g., "folder1/folder2")',
                },
                description: { type: "string", description: "Request description" },
            },
            required: ["collectionUid", "name", "method", "url"],
        },
    },
    {
        name: "update_request",
        description: "Update an existing request in a collection",
        inputSchema: {
            type: "object",
            properties: {
                collectionUid: {
                    type: "string",
                    description: "The UID of the collection",
                },
                requestName: {
                    type: "string",
                    description: "Current name of the request",
                },
                updates: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        method: {
                            type: "string",
                            enum: [
                                "GET",
                                "POST",
                                "PUT",
                                "PATCH",
                                "DELETE",
                                "HEAD",
                                "OPTIONS",
                            ],
                        },
                        url: { type: "string" },
                        headers: {
                            type: "object",
                            additionalProperties: { type: "string" },
                        },
                        body: {},
                        description: { type: "string" },
                    },
                    description: "Fields to update",
                },
            },
            required: ["collectionUid", "requestName", "updates"],
        },
    },
    {
        name: "delete_request",
        description: "Delete a request from a collection",
        inputSchema: {
            type: "object",
            properties: {
                collectionUid: {
                    type: "string",
                    description: "The UID of the collection",
                },
                requestName: {
                    type: "string",
                    description: "Name of the request to delete",
                },
            },
            required: ["collectionUid", "requestName"],
        },
    },
    {
        name: "list_environments",
        description: "List all environments",
        inputSchema: {
            type: "object",
            properties: {
                workspaceId: {
                    type: "string",
                    description: "The ID of the workspace",
                },
            },
            required: ["workspaceId"],
        },
    },
    {
        name: "get_environment",
        description: "Get detailed information about a specific environment",
        inputSchema: {
            type: "object",
            properties: {
                environmentUid: {
                    type: "string",
                    description: "The UID of the environment",
                },
            },
            required: ["environmentUid"],
        },
    },
    {
        name: "create_environment",
        description: "Create a new environment",
        inputSchema: {
            type: "object",
            properties: {
                name: { type: "string", description: "Name of the environment" },
                values: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            key: { type: "string" },
                            value: { type: "string" },
                            enabled: { type: "boolean" },
                            type: { type: "string" },
                        },
                    },
                },
                workspaceId: {
                    type: "string",
                    description: "The ID of the workspace",
                },
            },
            required: ["name", "workspaceId"],
        },
    },
    {
        name: "update_environment",
        description: "Update an existing environment",
        inputSchema: {
            type: "object",
            properties: {
                environmentUid: {
                    type: "string",
                    description: "The UID of the environment",
                },
                name: { type: "string", description: "Name of the environment" },
                values: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            key: { type: "string" },
                            value: { type: "string" },
                            enabled: { type: "boolean" },
                            type: { type: "string" },
                        },
                    },
                },
            },
            required: ["environmentUid"],
        },
    },
    {
        name: "delete_environment",
        description: "Delete an existing environment",
        inputSchema: {
            type: "object",
            properties: {
                environmentUid: {
                    type: "string",
                    description: "The UID of the environment",
                },
            },
            required: ["environmentUid"],
        },
    },
    {
        name: "create_folder",
        description: "Create a new folder in a collection",
        inputSchema: {
            type: "object",
            properties: {
                collectionUid: {
                    type: "string",
                    description: "The UID of the collection",
                },
                folderName: { type: "string", description: "Name of the folder" },
                parentFolder: {
                    type: "string",
                    description: "Parent folder path (optional)",
                },
            },
            required: ["collectionUid", "folderName"],
        },
    },
];
export const TOOL_NAMES = {
    LIST_COLLECTIONS: "list_collections",
    GET_COLLECTION: "get_collection",
    LIST_WORKSPACES: "list_workspaces",
    GET_WORKSPACE: "get_workspace",
    CREATE_WORKSPACE: "create_workspace",
    UPDATE_WORKSPACE: "update_workspace",
    CREATE_COLLECTION: "create_collection",
    UPDATE_COLLECTION: "update_collection",
    DELETE_COLLECTION: "delete_collection",
    ADD_REQUEST: "add_request",
    UPDATE_REQUEST: "update_request",
    DELETE_REQUEST: "delete_request",
    CREATE_FOLDER: "create_folder",
    LIST_ENVIRONMENTS: "list_environments",
    GET_ENVIRONMENT: "get_environment",
    CREATE_ENVIRONMENT: "create_environment",
    UPDATE_ENVIRONMENT: "update_environment",
    DELETE_ENVIRONMENT: "delete_environment",
};
