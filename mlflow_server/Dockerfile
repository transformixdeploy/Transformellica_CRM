# Use same base as your Flask app for consistency
FROM python:3.12.6-slim

# Set working directory
WORKDIR /app

ARG PORT

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy server script
COPY server.py .

# Expose MLflow UI port
EXPOSE ${PORT}

# Use volume mounts in docker-compose (defined later)
VOLUME ["/app/mlruns", "/app/mlartifacts"]

# Run the server
CMD ["python", "server.py"]