/**
 * MCP Server using FastMCP Framework with SSE Transport
 * Exposes HTTP endpoint instead of stdio for remote connections.
 */

const { FastMCP } = require('fastmcp');
const { z } = require('zod');

// Create FastMCP app instance
const app = new FastMCP({
  name: 'simple-mcp-fastmcp-sse',
  version: '2.0.0',
});

// ============================================================================
// TOOLS - Registered functions automatically converted to MCP tools
// ============================================================================

app.addTool({
  name: 'add',
  description: 'Add two numbers together.',
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async ({ a, b }) => {
    const result = a + b;
    return `${a} + ${b} = ${result}`;
  },
});

app.addTool({
  name: 'multiply',
  description: 'Multiply two numbers together.',
  parameters: z.object({
    x: z.number(),
    y: z.number(),
  }),
  execute: async ({ x, y }) => {
    const result = x * y;
    return `${x} * ${y} = ${result}`;
  },
});

app.addTool({
  name: 'greet',
  description: 'Greet someone by name.',
  parameters: z.object({
    name: z.string(),
  }),
  execute: async ({ name }) => {
    return `Hello, ${name}! Welcome to the FastMCP SSE Server.`;
  },
});

app.addTool({
  name: 'concatenate',
  description: 'Concatenate two text strings.',
  parameters: z.object({
    text1: z.string(),
    text2: z.string(),
  }),
  execute: async ({ text1, text2 }) => {
    const result = text1 + text2;
    return `'${text1}' + '${text2}' = '${result}'`;
  },
});

app.addTool({
  name: 'power',
  description: 'Raise a number to a power.',
  parameters: z.object({
    base: z.number(),
    exponent: z.number(),
  }),
  execute: async ({ base, exponent }) => {
    const result = Math.pow(base, exponent);
    return `${base} ^ ${exponent} = ${result}`;
  },
});

// ============================================================================
// RESOURCES - Static data accessible via URI
// ============================================================================

app.addResource({
  uri: 'greeting://welcome',
  name: 'greeting_welcome',
  description: 'Welcome greeting message.',
  mimeType: 'text/plain',
  load: async () => ({
    text: 'Hello! Welcome to the FastMCP SSE Server.\n\nThis server uses HTTP/SSE transport instead of stdio.',
  }),
});

app.addResource({
  uri: 'config://server',
  name: 'server_config',
  description: 'Server configuration and metadata.',
  mimeType: 'application/json',
  load: async () => ({
    text: JSON.stringify(
      {
        server_name: 'Simple MCP FastMCP SSE Server',
        version: '2.0.0',
        framework: 'FastMCP',
        transport: 'SSE (Server-Sent Events over HTTP)',
        description: 'A lightweight MCP server using FastMCP framework with SSE transport',
        tools: {
          add: 'Add two numbers',
          multiply: 'Multiply two numbers',
          greet: 'Greet someone by name',
          concatenate: 'Concatenate two text strings',
          power: 'Raise a number to a power',
        },
        resources: ['greeting://welcome', 'config://server', 'docs://tools', 'docs://framework'],
      },
      null,
      2
    ),
  }),
});

app.addResource({
  uri: 'docs://tools',
  name: 'tools_documentation',
  description: 'Documentation of all available tools.',
  mimeType: 'text/markdown',
  load: async () => ({
    text: `
# Available Tools

## add(a: number, b: number) -> string
Add two numbers together.

## multiply(x: number, y: number) -> string
Multiply two numbers together.

## greet(name: string) -> string
Greet someone by name.

## concatenate(text1: string, text2: string) -> string
Concatenate two text strings.

## power(base: number, exponent: number) -> string
Raise a number to a power.
`,
  }),
});

app.addResource({
  uri: 'docs://framework',
  name: 'framework_documentation',
  description: 'Information about FastMCP framework.',
  mimeType: 'text/markdown',
  load: async () => ({
    text: `
# FastMCP Framework

FastMCP is a lightweight framework for building Model Context Protocol servers.

## Key Features:
- Simple registration-based API (app.addTool(), app.addResource())
- Automatic schema generation from Zod types
- Built on top of the official MCP SDK
- Support for both stdio and SSE transports
- Minimal boilerplate code

## Transport Options:
- stdio: For local subprocess communication
- SSE: For HTTP-based remote connections

This server uses SSE transport for web-based clients.
`,
  }),
});

// ============================================================================
// MAIN
// ============================================================================

// Run the server with SSE transport on HTTP endpoint
// Default: http://localhost:8000/sse
app.start({
  transportType: 'sse',
  sse: {
    endpoint: '/sse',
    port: 8000,
  },
});

// You can customize the port:
// app.start({ transportType: 'sse', sse: { endpoint: '/sse', port: 8080 } });

// Or specify host and port:
// app.start({ transportType: 'sse', sse: { endpoint: '/sse', port: 8000, host: '0.0.0.0' } });
