import axios from "axios";
export class PostmanClient {
    api;
    constructor(apiKey) {
        this.api = axios.create({
            baseURL: "https://api.getpostman.com",
            headers: {
                "X-Api-Key": apiKey,
                "Content-Type": "application/json",
                Accept: "application/vnd.api.v10+json",
            },
        });
    }
    async listWorkspaces() {
        const response = await this.api.get("/workspaces");
        return response.data;
    }
    async getWorkspace(workspaceId) {
        const response = await this.api.get(`/workspaces/${workspaceId}`);
        return response.data.workspace;
    }
    async createWorkspace(name, type, description) {
        const response = await this.api.post("/workspaces", {
            workspace: {
                name,
                type,
                description,
            },
        });
        return response.data;
    }
    async updateWorkspace(workspaceId, name, description) {
        const updatedWorkspace = {};
        if (name)
            updatedWorkspace.name = name;
        if (description)
            updatedWorkspace.description = description;
        const response = await this.api.put(`/workspaces/${workspaceId}`, {
            workspace: updatedWorkspace,
        });
        return response.data;
    }
    async listCollections(workspaceId) {
        const response = await this.api.get("/collections", {
            params: { workspace: workspaceId },
        });
        return response.data;
    }
    async getCollection(collectionUid) {
        const response = await this.api.get(`/collections/${collectionUid}`);
        return response.data.collection;
    }
    async createCollection(name, workspaceId, description) {
        const collectionData = {
            collection: {
                info: {
                    name,
                    description: description || "",
                    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
                },
                item: [],
            },
        };
        const response = await this.api.post("/collections", collectionData, {
            params: { workspace: workspaceId },
        });
        return response.data;
    }
    async updateCollection(collectionUid, collection) {
        const response = await this.api.put(`/collections/${collectionUid}`, {
            collection,
        });
        return response.data;
    }
    async deleteCollection(collectionUid) {
        const response = await this.api.delete(`/collections/${collectionUid}`);
        return response.data;
    }
    async addRequest(collectionUid, request) {
        try {
            const collection = await this.getCollection(collectionUid);
            if (!collection) {
                throw new Error("Collection not found");
            }
            const postmanRequest = {
                name: request.name,
                request: {
                    method: request.method,
                    url: request.url,
                    header: request.headers
                        ? Array.isArray(request.headers)
                            ? request.headers.map((h) => ({
                                key: h.key,
                                value: h.value,
                                type: "text",
                            }))
                            : Object.entries(request.headers).map(([key, value]) => ({
                                key,
                                value,
                                type: "text",
                            }))
                        : [],
                    description: request.description,
                    body: request.body
                        ? typeof request.body === "object" && request.body.mode
                            ? {
                                ...request.body,
                                // Add default options for raw mode if not provided
                                options: request.body.mode === "raw" && !request.body.options
                                    ? { raw: { language: "json" } }
                                    : request.body.options,
                            }
                            : {
                                // Default to raw JSON if body format not specified
                                mode: "raw",
                                raw: typeof request.body === "string"
                                    ? request.body
                                    : JSON.stringify(request.body, null, 2),
                                options: {
                                    raw: {
                                        language: "json",
                                    },
                                },
                            }
                        : undefined,
                },
            };
            if (request.folder) {
                this.addToFolder(collection, postmanRequest, request.folder);
            }
            else {
                collection.item.push(postmanRequest);
            }
            await this.updateCollection(collectionUid, collection);
            return { success: true, message: "Request added successfully" };
        }
        catch (error) {
            throw new Error(`Failed to add request: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async updateRequest(collectionUid, requestName, updates) {
        try {
            const collection = await this.getCollection(collectionUid);
            const item = this.findItemByName(collection.item, requestName);
            if (!item || !item.request) {
                throw new Error(`Request "${requestName}" not found`);
            }
            // Update request properties
            if (updates.name)
                item.name = updates.name;
            if (updates.method)
                item.request.method = updates.method;
            if (updates.url)
                item.request.url = updates.url;
            if (updates.description !== undefined)
                item.request.description = updates.description;
            if (updates.headers) {
                item.request.header = Array.isArray(updates.headers)
                    ? updates.headers.map((h) => ({
                        key: h.key,
                        value: h.value,
                        type: "text",
                    }))
                    : Object.entries(updates.headers).map(([key, value]) => ({
                        key,
                        value,
                        type: "text",
                    }));
            }
            if (updates.body !== undefined) {
                item.request.body = updates.body
                    ? typeof updates.body === "object" && updates.body.mode
                        ? {
                            ...updates.body,
                            // Add default options for raw mode if not provided
                            options: updates.body.mode === "raw" && !updates.body.options
                                ? { raw: { language: "json" } }
                                : updates.body.options,
                        }
                        : {
                            // Default to raw JSON if body format not specified
                            mode: "raw",
                            raw: typeof updates.body === "string"
                                ? updates.body
                                : JSON.stringify(updates.body, null, 2),
                            options: {
                                raw: {
                                    language: "json",
                                },
                            },
                        }
                    : undefined;
            }
            await this.updateCollection(collectionUid, collection);
            return { success: true, message: "Request updated successfully" };
        }
        catch (error) {
            throw new Error(`Failed to update request: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
    }
    async deleteRequest(collectionId, requestName) {
        const collection = await this.getCollection(collectionId);
        const deleteFromItems = (items) => {
            for (let i = 0; i < items.length; i++) {
                if (items[i].name === requestName && items[i].request) {
                    items.splice(i, 1);
                    return true;
                }
                // Check in folders
                if (!items[i].item)
                    continue;
                if (deleteFromItems(items[i].item)) {
                    return true;
                }
            }
            return false;
        };
        if (!deleteFromItems(collection.item)) {
            throw new Error(`Request "${requestName}" not found`);
        }
        await this.updateCollection(collectionId, collection);
        return { success: true, message: "Request deleted successfully" };
    }
    async listEnvironments(workspaceId) {
        const response = await this.api.get("/environments", {
            params: { workspace: workspaceId },
        });
        return response.data;
    }
    async getEnvironment(environmentUid) {
        const response = await this.api.get(`/environments/${environmentUid}`);
        return response.data.environment;
    }
    async createEnviromnt(name, values, workspaceId) {
        const response = await this.api.post("/environments", {
            environment: {
                name,
                values,
            },
        }, {
            params: { workspace: workspaceId },
        });
        return response.data;
    }
    async updateEnvironment(environmentUid, name, values) {
        const updatedEnviroment = {};
        if (name)
            updatedEnviroment.name = name;
        if (values)
            updatedEnviroment.values = values;
        const response = await this.api.put(`/environments/${environmentUid}`, {
            environment: updatedEnviroment,
        });
        return response.data;
    }
    async deleteEnvironment(environmentUid) {
        const response = await this.api.delete(`/environments/${environmentUid}`);
        return response.data;
    }
    async createFolder(collectionId, folderName, parentFolder) {
        const collection = await this.getCollection(collectionId);
        const newFolder = {
            name: folderName,
            item: [],
        };
        if (parentFolder) {
            this.addToFolder(collection, newFolder, parentFolder);
        }
        else {
            collection.item.push(newFolder);
        }
        await this.updateCollection(collectionId, collection);
        return { success: true, message: "Folder created successfully" };
    }
    findItemByName(items, name) {
        for (const item of items) {
            if (item.name === name)
                return item;
            if (item.item) {
                const found = this.findItemByName(item.item, name);
                if (found)
                    return found;
            }
        }
        return null;
    }
    addToFolder(collection, item, folderPath) {
        const folders = folderPath.split("/");
        let currentItems = collection.item;
        for (const folderName of folders) {
            const folder = currentItems.find((i) => i.name === folderName && i.item);
            if (!folder) {
                throw new Error(`Folder "${folderName}" not found`);
            }
            currentItems = folder.item;
        }
        currentItems.push(item);
    }
}
