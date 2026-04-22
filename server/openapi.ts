export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Suit Tracker API",
    version: "1.0.0",
    description: "API for managing brand insights",
  },
  servers: [{ url: "http://localhost:8081" }],
  paths: {
    "/insights": {
      get: {
        summary: "List all insights",
        operationId: "listInsights",
        responses: {
          "200": {
            description: "Array of insights",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Insight" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new insight",
        operationId: "createInsight",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateInsightBody" },
            },
          },
        },
        responses: {
          "201": {
            description: "Created insight",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Insight" },
              },
            },
          },
          "400": { description: "Invalid request body" },
        },
      },
    },
    "/insights/{id}": {
      get: {
        summary: "Get an insight by ID",
        operationId: "lookupInsight",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": {
            description: "The insight",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Insight" },
              },
            },
          },
          "404": { description: "Insight not found" },
        },
      },
      delete: {
        summary: "Delete an insight by ID",
        operationId: "deleteInsight",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "204": { description: "Deleted successfully" },
          "400": { description: "Invalid ID" },
          "404": { description: "Insight not found" },
        },
      },
    },
  },
  components: {
    schemas: {
      Insight: {
        type: "object",
        properties: {
          id: { type: "integer" },
          brand: { type: "integer", minimum: 1, maximum: 6 },
          createdAt: { type: "string", format: "date-time" },
          text: { type: "string" },
        },
        required: ["id", "brand", "createdAt", "text"],
      },
      CreateInsightBody: {
        type: "object",
        properties: {
          brand: { type: "integer", minimum: 1 },
          createdAt: { type: "string", format: "date-time" },
          text: { type: "string", minLength: 1 },
        },
        required: ["brand", "createdAt", "text"],
      },
    },
  },
};

export const swaggerUiHtml = (specUrl: string) =>
  `<!DOCTYPE html>
<html>
  <head>
    <title>Suit Tracker API Docs</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
      SwaggerUIBundle({ url: "${specUrl}", dom_id: '#swagger-ui' });
    </script>
  </body>
</html>`;
