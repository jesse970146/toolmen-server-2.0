# Toolmen Server 2.0

## 📝 About The Project
Toolmen Server 2.0 is a full-stack system designed to provide automated deployment for machine learning and AI training environments. By calling the Kubernetes (K8s) API directly from the backend services, this project dynamically creates, manages, and isolates dedicated, containerized training environments for users.

## 🏗️ Architecture & Directory Structure
This project adopts a decoupled, modular architecture, consisting of three core directories:

* **`toolmen-server-frontend/`**
  * **Frontend UI**: A user-friendly web interface (built with React) that allows users to easily configure, launch, and monitor their training environments.
* **`toolmen-server-backend/`**
  * **Core Backend Service**: Handles incoming requests from the frontend, manages user states, and executes core business logic.
* **`toolmen-server-api-k8s/`**
  * **Kubernetes Integration Service**: A dedicated microservice for communicating with the Kubernetes cluster. It calls K8s APIs to dynamically allocate resources, create Pods, and spin up Docker-based training environments.

## 🛠️ Tech Stack
* **Frontend**: React
* **Backend**: Python
* **Infrastructure**: Kubernetes (K8s), Docker


# What need to configure
## Add node
Add lab=toolmen-bblab for allowing group toolmen,bblab access this node.
```
kubectl label nodes toolmen-server7 lab=toolmen-bblab --overwrite
```