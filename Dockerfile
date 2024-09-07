# Use Python 3.10 image as a base
FROM python:3.10

# Install Node.js v18
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the requirements file and install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy the entire project to the container (including the frontend folder)
COPY . .

# Set the working directory to the frontend folder for Node.js commands
WORKDIR /usr/src/app/frontend

# Check if the .env file exists in the root directory
# If it exists, copy it to the frontend directory
RUN if [ -f /usr/src/app/.env ]; then \
        echo ".env file found, copying to frontend folder" && \
        cp /usr/src/app/.env /usr/src/app/frontend/.env; \
    else \
        echo "No .env file found, using ARG instead"; \
    fi

# Build the React app using environment variables
ARG REACT_APP_DEVELOPMENT_API_URL
ENV REACT_APP_DEVELOPMENT_API_URL=$REACT_APP_DEVELOPMENT_API_URL
RUN npm install && npm run build

# Set the working directory back to the root of the project for Django commands
WORKDIR /usr/src/app

# Run Django migrations and collect static files
RUN python manage.py migrate && python manage.py collectstatic --noinput

# Expose the Django port
EXPOSE 80

# Start the Django app with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "hangman.wsgi:application"]
