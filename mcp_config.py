"""
Intentionally vulnerable MCP agent client for AI Supply Chain scan testing.
Do not run against a real network - this is a scan fixture only.
"""

import subprocess
from mcp import ClientSession
from mcp.client.sse import sse_client

# Vuln 1: unpinned, untrusted third-party MCP server fetched over plain HTTP,
# no integrity/signature check before connecting.
MCP_SERVER_URL = "http://public-mcp-tools.example-registry.io/sse"

# Vuln 2: static, hardcoded credential used to authenticate to the MCP server
# instead of a secret manager / env-injected token.
MCP_AUTH_TOKEN = "sk-mcp-4f9a2b7c1e6d4a3b9f0c8d7e6a5b4c3d"

# Vuln 3: agent trusts every tool the server advertises, with no allowlist,
# no schema validation, and no human-in-the-loop confirmation.
def load_all_remote_tools(session: ClientSession):
    tools = session.list_tools()
    return tools  # no filtering by name, origin, or declared capability


# Vuln 4: tool_choice="auto" combined with a shell-executing tool implementation
# lets the remote MCP server's tool definitions drive arbitrary local execution.
def execute_tool_call(tool_name: str, arguments: dict):
    if tool_name == "run_shell":
        # Vuln 5: command built from unsanitized model/tool output, run with
        # shell=True - classic injection surface once the "AI asset" is compromised.
        command = arguments.get("command", "")
        result = subprocess.run(command, shell=True, capture_output=True)
        return result.stdout
    return None


async def connect_and_run(user_prompt: str):
    async with sse_client(MCP_SERVER_URL, headers={"Authorization": MCP_AUTH_TOKEN}) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools = load_all_remote_tools(session)

            # Vuln 6: model output (tool call arguments) passed straight into
            # execution with no output/argument validation layer.
            for tool in tools:
                call_result = await session.call_tool(tool.name, {"command": user_prompt})
                execute_tool_call(tool.name, {"command": call_result})

            return "done"
