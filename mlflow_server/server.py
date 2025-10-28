# server.py
import os
import mlflow
from mlflow.server import app
import threading
import time

def start_mlflow_server():
    """
    Start MLflow tracking server with file backend and artifact store using local directories.
    """
    backend_store_uri = os.getenv("MLFLOW_BACKEND_STORE_URI", "./mlruns")
    default_artifact_root = os.getenv("MLFLOW_DEFAULT_ARTIFACT_ROOT", "./mlartifacts")
    host = os.getenv("MLFLOW_HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5002"))

    # Ensure directories exist
    os.makedirs(backend_store_uri, exist_ok=True)
    os.makedirs(default_artifact_root, exist_ok=True)

    print(f"Starting MLflow Tracking Server...")
    print(f"  Backend Store: file://{backend_store_uri}")
    print(f"  Artifact Root: file://{default_artifact_root}")
    print(f"  UI: http://localhost:{port}")
    print(f"  Accessible from other containers at: http://mlflow_server:{port}")

    # Launch the Flask app (MLflow UI + API)
    app.run(host=host, port=port, threaded=True)

if __name__ == "__main__":
    start_mlflow_server()