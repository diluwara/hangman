# Hangman Game - Local and Development Setup

This repository contains the Hangman game, which can be configured to run in both local (SQLite) and development (PostgreSQL) environments.

## Prerequisites

Before starting, ensure you have the following:

- Docker installed on your system.
- AWS EC2 instance set up (for development).
- PostgreSQL RDS set up (for development).

## Local Setup

### 1. Clone the Repository

First, clone this repository:

```bash
git clone https://github.com/diluwara/hangman.git
cd hangman
```

### 2. Configure Environment Variables

Rename the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

In the `.env` file, set the `ENV` variable:

- For **local** development (using SQLite), set `ENV=local`.
- For **development** (using PostgreSQL), set `ENV=development` and fill in the PostgreSQL details.

### 3. Running the Application Locally

#### Backend and React (both)

To run both the backend and React application using Docker locally:

1. Build the Docker image:

   ```bash
   docker build -t hangman-backend:latest .
   ```

2. Run the Docker container:

   ```bash
   docker run -d --name hangman-backend -p 8000:8000 hangman-backend:latest
   ```

This will start both the backend and frontend React application, and you can access it locally at `http://localhost`.

### 4. React Configuration

For the React frontend:

- Set `REACT_APP_ENVIRONMENT=local` to run the frontend locally.
- Set `REACT_APP_ENVIRONMENT=development` to point the frontend to the development URL.

In the `.env` file, ensure to correctly fill in the Facebook OAuth and API URLs:

- For local: `REACT_APP_API_URL=http://localhost:8000/game/`
- For development: `REACT_APP_DEVELOPMENT_API_URL=http://your-development-url/game/`

## Development Setup

### 1. AWS EC2 and RDS Setup

For the development environment:

1. **AWS EC2 Instance**: Set up an EC2 instance to host your backend and frontend. Generate a PEM file for SSH access and deploy the Docker container.

2. **RDS PostgreSQL**: Create an RDS instance for PostgreSQL and use the following environment variables:

   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_HOST`
   - `POSTGRES_PORT`

3. **Environment Variables**: Update the following GitHub Secrets for deployment:

   - `DJANGO_SECRET_KEY`
   - `DJANGO_ALLOWED_HOSTS`
   - `AWS_EC2_IP`
   - `AWS_EC2_KEY`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`

These secrets will ensure proper configuration during the deployment process. For detailed steps, refer to the [AWS EC2 and RDS Setup Guide on Github](Workflow.pdf).

### 2. Running in Development

To run the full stack on AWS EC2 with PostgreSQL:

1. Build the Docker image as shown above.
2. Deploy the Docker container to your EC2 instance.
3. The application will be accessible via your EC2 public IP address.

### Live URL: http://ec2-13-61-4-238.eu-north-1.compute.amazonaws.com

---

## Additional Information

For any issues or further details, refer to the official documentation or reach out to the repository maintainer.