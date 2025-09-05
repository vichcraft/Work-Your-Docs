import os
import json
import asyncio
import ssl
import certifi
from typing import List, Dict, Optional
from pathlib import Path
from dotenv import load_dotenv
from mcp.client.websocket import websocket_client
from mcp.client.session import ClientSession

# Load backend/.env if present
try:
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
except Exception as e:
    print(f"Warning: Failed to load .env file: {e}")

# --- Config (edit .env or export in shell) ---
CTX_URL = os.getenv("CONTEXT7_MCP_URL", "").strip()
DEFAULT_LIBRARY = os.getenv("CONTEXT7_LIBRARY", "react").strip()
DEFAULT_VERSION = (os.getenv("CONTEXT7_VERSION") or "").strip() or None
DEFAULT_LIMIT = int(os.getenv("CONTEXT7_RESULTS_LIMIT", "10") or "10")

RESOLVE_TOOLS = [
    "resolve-library-id", "resolveLibraryId", "context7.resolveLibraryId",
    "search-library", "searchLibrary"
]
DOCS_TOOLS = [
    "get-library-docs", "getLibraryDocs", "context7.getLibraryDocs",
    "library-docs", "docs", "fetchDocs"
]
SEARCH_TOOLS = ["search", "searchDocs", "context7.search"]

def _choose(available: List[str], candidates: List[str]) -> Optional[str]:
    for c in candidates:
        if c in available:
            return c
    return None

def _get_text(item) -> str:
    return getattr(item, "text", None) if hasattr(item, "text") else str(item)

def _maybe_json(s: str):
    try:
        return json.loads(s)
    except Exception:
        return None

async def test_websocket_connection():
    """Test the WebSocket connection to the MCP server."""
    if not CTX_URL:
        print("Error: CONTEXT7_MCP_URL is missing. Set it in backend/.env.")
        return
    try:
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        async with websocket_client(CTX_URL, ssl=ssl_context) as (read, write):
            print(f"Successfully connected to WebSocket at {CTX_URL}")
    except Exception as e:
        print(f"Failed to connect to WebSocket at {CTX_URL}: {e}")

async def _fetch_async(library: str, version: Optional[str], limit: int) -> List[Dict[str, str]]:
    if not CTX_URL:
        raise RuntimeError("CONTEXT7_MCP_URL is missing. Put it in backend/.env or export it.")

    try:
        # Create SSL context with certifi certificates
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        # Optional: Disable SSL verification (uncomment for testing only, not secure)
        #ssl_context = False
        async with websocket_client(CTX_URL, ssl=ssl_context) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()

                # 1) Discover available tools
                tools = await session.list_tools()
                available = [t.name for t in tools.tools]
                print("[context7] Available tools:", available)

                resolve_tool = _choose(available, RESOLVE_TOOLS)
                docs_tool = _choose(available, DOCS_TOOLS)
                search_tool = _choose(available, SEARCH_TOOLS)
                print(f"[context7] Selected resolve tool: {resolve_tool}, docs tool: {docs_tool}, search tool: {search_tool}")

                lib_id = None

                # 2) Resolve library ID (if resolve tool exists)
                if resolve_tool:
                    args = {"name": library}
                    if version:
                        args["version"] = str(version)
                    try:
                        resolved = await session.call_tool(resolve_tool, args)
                        if resolved.content:
                            text = _get_text(resolved.content[0])
                            payload = _maybe_json(text) or {}
                            lib_id = (
                                payload.get("libraryId")
                                or payload.get("library_id")
                                or payload.get("id")
                            )
                            print(f"[context7] Resolved library ID: {lib_id}")
                    except Exception as e:
                        print(f"[context7] Warning: Failed to resolve library ID: {e}")
                        args = {"libraryName": library}
                        if version:
                            args["version"] = str(version)
                        try:
                            resolved = await session.call_tool(resolve_tool, args)
                            if resolved.content:
                                text = _get_text(resolved.content[0])
                                payload = _maybe_json(text) or {}
                                lib_id = (
                                    payload.get("libraryId")
                                    or payload.get("library_id")
                                    or payload.get("id")
                                )
                                print(f"[context7] Resolved library ID (retry): {lib_id}")
                        except Exception as e:
                            print(f"[context7] Warning: Failed to resolve library ID on retry: {e}")

                # 3) Fetch docs
                if docs_tool:
                    if lib_id:
                        args = {"libraryId": lib_id, "limit": limit}
                    else:
                        args = {"name": library, "limit": limit}
                        if version:
                            args["version"] = str(version)
                    print(f"[context7] Fetching docs with args: {args}")
                    try:
                        docs_res = await session.call_tool(docs_tool, args)
                    except Exception:
                        args = {"library_id": lib_id, "limit": limit} if lib_id else args
                        docs_res = await session.call_tool(docs_tool, args)
                elif search_tool:
                    query = f"{library} {version or ''}".strip()
                    args = {"query": query, "limit": limit}
                    print(f"[context7] Fallback search with args: {args}")
                    docs_res = await session.call_tool(search_tool, args)
                else:
                    raise RuntimeError(f"No suitable docs/search tools found. Available: {available}")

                # 4) Normalize results -> [{title, url, text}]
                out: List[Dict[str, str]] = []
                for item in (docs_res.content or []):
                    blob = _get_text(item) or ""
                    parsed = _maybe_json(blob)
                    if isinstance(parsed, dict):
                        title = parsed.get("title") or parsed.get("name") or ""
                        url = parsed.get("url") or parsed.get("source") or ""
                        text = parsed.get("content") or parsed.get("text") or blob
                    else:
                        title, url, text = "", "", blob
                    out.append({"title": title, "url": url, "text": text})
                return out

    except Exception as e:
        print(f"[context7] Error connecting to Context7 MCP at {CTX_URL}: {e}")
        return []

def fetch_context7_docs(library: Optional[str] = None,
                        version: Optional[str] = None,
                        limit: Optional[int] = None) -> List[Dict[str, str]]:
    lib = library or DEFAULT_LIBRARY
    ver = version if version is not None else DEFAULT_VERSION
    lim = limit or DEFAULT_LIMIT
    return asyncio.run(_fetch_async(lib, ver, lim))

if __name__ == "__main__":
    # Test WebSocket connection
    asyncio.run(test_websocket_connection())

    # Fetch and print docs
    docs = fetch_context7_docs()
    print(f"\nFetched {len(docs)} docs/snippets for '{DEFAULT_LIBRARY}@{DEFAULT_VERSION or 'latest'}'.")
    for i, d in enumerate(docs, 1):
        preview_lines = (d["text"] or "").strip().splitlines()
        preview = " ".join(preview_lines)[:160]
        if len(" ".join(preview_lines)) > 160:
            preview += "…"
        print(f"\n[{i}] {d['title'] or '(untitled)'}")
        if d["url"]:
            print(f"URL: {d['url']}")
        print(f"TEXT: {preview or '(no text)'}")