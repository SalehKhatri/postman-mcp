import axios, { AxiosInstance } from "axios";
import {
  PostmanCollection,
  PostmanCollectionsListResponse,
  PostmanEnvironment,
  PostmanEnvironmentsListResponse,
  PostmanItem,
  PostmanVariable,
  PostmanWorkspace,
  PostmanWorkspacesListResponse,
} from "./types/index.js";

export class PostmanClient {
  private api: AxiosInstance;

  constructor(apiKey: string) {
    this.api = axios.create({
      baseURL: "https://api.getpostman.com",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/vnd.api.v10+json",
      },
    });
  }

  async listWorkspaces(): Promise<PostmanWorkspacesListResponse> {
    const response = await this.api.get("/workspaces");
    return response.data;
  }

  async getWorkspace(workspaceId: string): Promise<PostmanWorkspace> {
    const response = await this.api.get(`/workspaces/${workspaceId}`);
    return response.data.workspace;
  }

  async createWorkspace(
    name: string,
    type: "personal" | "team",
    description?: string
  ) {
    const response = await this.api.post("/workspaces", {
      workspace: {
        name,
        type,
        description,
      },
    });
    return response.data;
  }

  async updateWorkspace(
    workspaceId: string,
    name?: string,
    description?: string
  ) {
    const updatedWorkspace: Partial<PostmanWorkspace> = {};
    if (name) updatedWorkspace.name = name;
    if (description) updatedWorkspace.description = description;
    const response = await this.api.put(`/workspaces/${workspaceId}`, {
      workspace: updatedWorkspace,
    });
    return response.data;
  }

  async listCollections(
    workspaceId: string
  ): Promise<PostmanCollectionsListResponse> {
    const response = await this.api.get("/collections", {
      params: { workspace: workspaceId },
    });
    return response.data;
  }

  async getCollection(collectionUid: string): Promise<PostmanCollection> {
    const response = await this.api.get(`/collections/${collectionUid}`);
    return response.data.collection;
  }

  async createCollection(
    name: string,
    workspaceId: string,
    description?: string
  ): Promise<{ collection: { id: string; uid: string; name: string } }> {
    const collectionData = {
      collection: {
        info: {
          name,
          description: description || "",
          schema:
            "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        item: [],
      },
    };
    const response = await this.api.post("/collections", collectionData, {
      params: { workspace: workspaceId },
    });
    return response.data;
  }

  async updateCollection(
    collectionUid: string,
    collection: PostmanCollection
  ): Promise<{ collection: { id: string; uid: string } }> {
    const response = await this.api.put(`/collections/${collectionUid}`, {
      collection,
    });
    return response.data;
  }

  async deleteCollection(
    collectionUid: string
  ): Promise<{ collection: { id: string; uid: string } }> {
    const response = await this.api.delete(`/collections/${collectionUid}`);
    return response.data;
  }
  async addRequest(
    collectionUid: string,
    request: {
      name: string;
      method: string;
      url: string;
      headers?: Record<string, string> | Array<{ key: string; value: string }>;
      body?: any;
      folder?: string;
      description?: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const collection = await this.getCollection(collectionUid);

      if (!collection) {
        throw new Error("Collection not found");
      }

      const postmanRequest: PostmanItem = {
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
                  options:
                    request.body.mode === "raw" && !request.body.options
                      ? { raw: { language: "json" } }
                      : request.body.options,
                }
              : {
                  // Default to raw JSON if body format not specified
                  mode: "raw",
                  raw:
                    typeof request.body === "string"
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
      } else {
        collection.item.push(postmanRequest);
      }

      await this.updateCollection(collectionUid, collection);
      return { success: true, message: "Request added successfully" };
    } catch (error) {
      throw new Error(
        `Failed to add request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateRequest(
    collectionUid: string,
    requestName: string,
    updates: Partial<{
      name: string;
      method: string;
      url: string;
      headers?: Record<string, string> | Array<{ key: string; value: string }>;
      body?: any;
      description?: string;
    }>
  ): Promise<{ success: boolean; message: string }> {
    try {
      const collection = await this.getCollection(collectionUid);
      const item = this.findItemByName(collection.item, requestName);

      if (!item || !item.request) {
        throw new Error(`Request "${requestName}" not found`);
      }

      // Update request properties
      if (updates.name) item.name = updates.name;
      if (updates.method) item.request.method = updates.method;
      if (updates.url) item.request.url = updates.url;
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
                options:
                  updates.body.mode === "raw" && !updates.body.options
                    ? { raw: { language: "json" } }
                    : updates.body.options,
              }
            : {
                // Default to raw JSON if body format not specified
                mode: "raw",
                raw:
                  typeof updates.body === "string"
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
    } catch (error) {
      throw new Error(
        `Failed to update request: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteRequest(collectionId: string, requestName: string) {
    const collection = await this.getCollection(collectionId);

    const deleteFromItems = (items: PostmanItem[]): boolean => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].name === requestName && items[i].request) {
          items.splice(i, 1);
          return true;
        }
        // Check in folders
        if (!items[i].item) continue;
        if (deleteFromItems(items[i].item!)) {
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

  async listEnvironments(
    workspaceId: string
  ): Promise<PostmanEnvironmentsListResponse> {
    const response = await this.api.get("/environments", {
      params: { workspace: workspaceId },
    });
    return response.data;
  }

  async getEnvironment(environmentUid: string): Promise<PostmanEnvironment> {
    const response = await this.api.get(`/environments/${environmentUid}`);
    return response.data.environment;
  }

  async createEnviromnt(
    name: string,
    values: PostmanVariable[],
    workspaceId: string
  ) {
    const response = await this.api.post(
      "/environments",
      {
        environment: {
          name,
          values,
        },
      },
      {
        params: { workspace: workspaceId },
      }
    );
    return response.data;
  }

  async updateEnvironment(
    environmentUid: string,
    name?: string,
    values?: PostmanVariable[]
  ) {
    const updatedEnviroment: Partial<PostmanEnvironment> = {};
    if (name) updatedEnviroment.name = name;
    if (values) updatedEnviroment.values = values;
    const response = await this.api.put(`/environments/${environmentUid}`, {
      environment: updatedEnviroment,
    });
    return response.data;
  }

  async deleteEnvironment(environmentUid: string) {
    const response = await this.api.delete(`/environments/${environmentUid}`);
    return response.data;
  }

  async createFolder(
    collectionId: string,
    folderName: string,
    parentFolder?: string
  ) {
    const collection = await this.getCollection(collectionId);

    const newFolder: PostmanItem = {
      name: folderName,
      item: [],
    };

    if (parentFolder) {
      this.addToFolder(collection, newFolder, parentFolder);
    } else {
      collection.item.push(newFolder);
    }

    await this.updateCollection(collectionId, collection);
    return { success: true, message: "Folder created successfully" };
  }

  private findItemByName(
    items: PostmanItem[],
    name: string
  ): PostmanItem | null {
    for (const item of items) {
      if (item.name === name) return item;
      if (item.item) {
        const found = this.findItemByName(item.item, name);
        if (found) return found;
      }
    }
    return null;
  }

  private addToFolder(
    collection: PostmanCollection,
    item: PostmanItem,
    folderPath: string
  ) {
    const folders = folderPath.split("/");
    let currentItems = collection.item;

    for (const folderName of folders) {
      const folder = currentItems.find((i) => i.name === folderName && i.item);
      if (!folder) {
        throw new Error(`Folder "${folderName}" not found`);
      }
      currentItems = folder.item!;
    }

    currentItems.push(item);
  }
}
