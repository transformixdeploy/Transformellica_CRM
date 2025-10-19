# Use an official Python base image
FROM python:3.12.6-slim

RUN apt-get update && apt-get install -y wget gnupg unzip curl \
 && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
 && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' \
 && apt-get update && apt-get install -y google-chrome-stable \
 && rm -rf /var/lib/apt/lists/*

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

# Environment variable to reuse cached drivers
ENV WDM_LOCAL=1

# Command to run your Flask application using Gunicorn (recommended for production)
# note about (app:app) the flask app file should be named app.py as we will use it as entry point
CMD gunicorn -w 4 -b 0.0.0.0:${PORT} --timeout 0 app:app