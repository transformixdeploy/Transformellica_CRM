# Use an official Python base image
FROM python:3.12.6-slim

# Set the working directory inside the container
WORKDIR /app

ARG PORT

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose the port your Flask app listens on
EXPOSE ${PORT}

# Command to run your Flask application using Gunicorn (recommended for production)
# note about (app:app) the flask app file should be named app.py as we will use it as entry point
CMD gunicorn -w 4 -b 0.0.0.0:${PORT} --timeout 0 app:app