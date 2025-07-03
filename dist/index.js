import dotenv from "dotenv";
import { PostmanClient } from "./postman-client.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { schemas, TOOL_NAMES, TOOLS } from "./tools.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
dotenv.config();
const API_KEY = process.env.POSTMAN_API_KEY;
if (!API_KEY) {
    console.error("Error: POSTMAN_API_KEY environment variable is required");
    process.exit(1);
}
const postmanClient = new PostmanClient(API_KEY);
const server = new Server({
    name: "postman-mcp",
    version: "1.0.0",
    title: "Postman MCP",
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    let result;
    try {
        switch (name) {
            case TOOL_NAMES.LIST_COLLECTIONS: {
                const { workspaceId } = schemas.listCollections.parse(args);
                result = await postmanClient.listCollections(workspaceId);
                break;
            }
            case TOOL_NAMES.GET_COLLECTION: {
                const { collectionUid } = schemas.getCollection.parse(args);
                result = await postmanClient.getCollection(collectionUid);
                break;
            }
            case TOOL_NAMES.LIST_WORKSPACES: {
                result = await postmanClient.listWorkspaces();
                break;
            }
            case TOOL_NAMES.GET_WORKSPACE: {
                const { workspaceId } = schemas.getWorkspace.parse(args);
                result = await postmanClient.getWorkspace(workspaceId);
                break;
            }
            case TOOL_NAMES.CREATE_WORKSPACE: {
                const { name, type, description } = schemas.createWorkspace.parse(args);
                result = await postmanClient.createWorkspace(name, type, description);
                break;
            }
            case TOOL_NAMES.UPDATE_WORKSPACE: {
                const { workspaceId, name, description } = schemas.updateWorkspace.parse(args);
                result = await postmanClient.updateWorkspace(workspaceId, name, description);
                break;
            }
            case TOOL_NAMES.CREATE_COLLECTION: {
                const { name, description, workspaceId } = schemas.createCollection.parse(args);
                result = await postmanClient.createCollection(name, workspaceId, description);
                break;
            }
            case TOOL_NAMES.UPDATE_COLLECTION: {
                const { collectionUid, info, variables } = schemas.updateCollection.parse(args);
                // First, get the current collection
                const currentCollection = await postmanClient.getCollection(collectionUid);
                // Update only the fields that were provided
                if (info) {
                    if (info.name !== undefined) {
                        currentCollection.info.name = info.name;
                    }
                    if (info.description !== undefined) {
                        currentCollection.info.description = info.description;
                    }
                }
                if (variables !== undefined) {
                    currentCollection.variable = variables;
                }
                // Now update with the complete collection object
                result = await postmanClient.updateCollection(collectionUid, currentCollection);
                break;
            }
            case TOOL_NAMES.DELETE_COLLECTION: {
                const { collectionUid } = schemas.deleteCollection.parse(args);
                result = await postmanClient.deleteCollection(collectionUid);
                break;
            }
            case TOOL_NAMES.ADD_REQUEST: {
                const request = schemas.addRequest.parse(args);
                result = await postmanClient.addRequest(request.collectionUid, {
                    name: request.name,
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    body: request.body,
                    folder: request.folder,
                    description: request.description,
                });
                break;
            }
            case TOOL_NAMES.UPDATE_REQUEST: {
                const { collectionUid, requestName, updates } = schemas.updateRequest.parse(args);
                result = await postmanClient.updateRequest(collectionUid, requestName, updates);
                break;
            }
            case TOOL_NAMES.DELETE_REQUEST: {
                const { collectionUid, requestName } = schemas.deleteRequest.parse(args);
                result = await postmanClient.deleteRequest(collectionUid, requestName);
                break;
            }
            case TOOL_NAMES.LIST_ENVIRONMENTS: {
                const { workspaceId } = schemas.listEnvironments.parse(args);
                result = await postmanClient.listEnvironments(workspaceId);
                break;
            }
            case TOOL_NAMES.GET_ENVIRONMENT: {
                const { environmentUid } = schemas.getEnvironment.parse(args);
                result = await postmanClient.getEnvironment(environmentUid);
                break;
            }
            case TOOL_NAMES.CREATE_ENVIRONMENT: {
                const { name, values, workspaceId } = schemas.createEnvironment.parse(args);
                result = await postmanClient.createEnviromnt(name, values || [], workspaceId);
                break;
            }
            case TOOL_NAMES.UPDATE_ENVIRONMENT: {
                const { environmentUid, name, values } = schemas.updateEnvironment.parse(args);
                result = await postmanClient.updateEnvironment(environmentUid, name, values);
                break;
            }
            case TOOL_NAMES.DELETE_ENVIRONMENT: {
                const { environmentUid } = schemas.deleteEnvironment.parse(args);
                result = await postmanClient.deleteEnvironment(environmentUid);
                break;
            }
            case TOOL_NAMES.CREATE_FOLDER: {
                const { collectionUid, folderName, parentFolder } = schemas.createFolder.parse(args);
                result = await postmanClient.createFolder(collectionUid, folderName, parentFolder);
                break;
            }
            default: {
                throw new Error(`Unknown tool: ${name}`);
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occured.";
        return {
            content: [
                {
                    type: "text",
                    text: `Error calling tool ${name}: ${errorMessage}`,
                },
            ],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Postman MCP server is running...");
}
main().catch((error) => {
    console.error("Fatal error starting server:", error);
    process.exit(1);
});
