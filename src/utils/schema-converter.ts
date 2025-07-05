import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export function zodToMCPInputSchema(schema: z.ZodSchema): {
  type: "object";
  properties?: Record<string, any>;
  required?: string[];
  description?: string;
} {
  try {
    const jsonSchema = zodToJsonSchema(schema, {
      target: "jsonSchema7",
      $refStrategy: "none",
      definitions: {},
    });

    let actualSchema = jsonSchema;

    // If it has a $ref, extract the actual schema from definitions
    if (typeof jsonSchema === "object" && jsonSchema !== null) {
      if ("$ref" in jsonSchema && jsonSchema.definitions) {
        const refPath = jsonSchema.$ref as string;
        const definitionKey = refPath.replace("#/definitions/", "");

        if (jsonSchema.definitions[definitionKey]) {
          actualSchema = jsonSchema.definitions[definitionKey];
        }
      }
    }

    // Ensure it's an object schema (MCP requirement)
    if (
      typeof actualSchema === "object" &&
      actualSchema !== null &&
      (actualSchema as any).type === "object"
    ) {
      const objectSchema = actualSchema as any;
      return {
        type: "object",
        properties: objectSchema.properties || {},
        required: Array.isArray(objectSchema.required)
          ? objectSchema.required
          : [],
        ...(objectSchema.description && {
          description: objectSchema.description,
        }),
      } as Tool["inputSchema"];
    }

    // Fallback for non-object schemas
    return {
      type: "object",
      properties: {},
      required: [],
    } as Tool["inputSchema"];
  } catch (error) {
    console.warn(`Failed to convert schema for tool, using fallback:`, error);
    return {
      type: "object",
      properties: {},
      required: [],
    } as Tool["inputSchema"];
  }
}
