# Toolmen Server Backend

## 📝 About The Service
The `toolmen-server-backend` serves as the core orchestrator for the Toolmen 2.0 system. It acts as the bridge between the frontend user interface and the underlying Kubernetes infrastructure. This service is responsible for handling API requests from the frontend, managing user states, processing core business logic, and forwarding execution commands to the `toolmen-server-api-k8s` microservice to spin up AI and machine learning training environments.

## 🛠️ Tech Stack
* **Main Language**: Python
* **Framework**: *(e.g. Flask)*
* **Containerization**: Docker
* **Key Integrations**: Communicates via http with the `toolmen-server-api-k8s` service.

## 🏗️ Core Responsibilities
* **API Gateway**: Provides a stable set of endpoints for the frontend (React) to interact with.
* **Service Coordination**: Sends validated environment configuration payloads to the Kubernetes API service.

## 🚀 Getting Started

### 1. Create and Activate a Virtual Environment (Recommended)
```bash
python -m venv venv

source venv/bin/activate
```
### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the root of this directory to store your configuration. You will likely need to define the URL of your K8s API service:

```env
# Example .env configuration
FRONTEND_BASE_URL=http://localhost:3000  # frontend url for cors setting
API_K8S_BASE_URL=http://localhost:3476  # api-k8s url for communicating with kubernetes
DATABASE_URL=postgresql://<account>:<password>@<ip>:<port>/<db_name> # postgres for storing data

SECRET_KEY=super-long-random-string # jwt key
JWT_SECRET_KEY=another-super-long-random-string # jwt key
JWT_ACCESS_TOKEN_EXPIRES=604800 # jwt token expiered time 7Days * 24hr * 60min * 60sec = 604800 sec

GMAIL_USER= 'XXXXXXXXXXXXX@gmail.com' # Mail user account 
GMAIL_PASS= 'XXXXXXXXXXXXXX' # Mail user password

# redis setting for blacklist
REDIS_URL = localhost  
REDIS_PORT=6379
REDIS_PASSWORD = XXXXXXXXXXXXXXXXXXXX

```

### 4. Start the Backend Server

Run the startup command:

```bash
python app.py
```
