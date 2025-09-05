# backend/app.py
from flask import Flask, jsonify, request
from fetchers.context7_fetcher import fetch_context7_docs

app = Flask(__name__)

@app.get("/api/health")
def health():
    return jsonify(ok=True)

@app.get("/api/context7")
def get_context7_docs():
    # Example: /api/context7?library=react&version=18&limit=5
    lib   = request.args.get("library", "react")
    ver   = request.args.get("version")  # e.g. "18"
    limit = int(request.args.get("limit", "5"))

    docs = fetch_context7_docs(library=lib, version=ver, limit=limit)
    return jsonify({"count": len(docs), "docs": docs})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
