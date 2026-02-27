
# Toolmen Server API K8s

## 📝 About The Service
`toolmen-server-api-k8s` is the core microservice within the Toolmen project dedicated to interacting with the Kubernetes cluster. It receives commands from the main backend service and calls the Kubernetes API to dynamically allocate resources, create, and manage isolated containerized training environments on the cluster.

## 🛠️ Tech Stack
* **Main Language**: Python
* **Infrastructure & Containerization**: Kubernetes (K8s), Docker
* **Core Packages**: `kubernetes Python client`, `Flask`

## 🚀 Deployment Workflow

Since this service is designed to run within the Kubernetes cluster to manage resources, the standard deployment workflow involves packaging it, configuring cluster permissions, and deploying it as a Kubernetes resource.

### 1. Package the Service (Docker)
First, build the application into a Docker container.

```bash
# Build the Docker Image
docker build -t toolmen-server-api-k8s:latest .

# (Optional) If you are not using a local cluster like Minikube, push to your registry
# docker push your-registry/toolmen-server-api-k8s:latest

```

### 2. Configure Permissions (RBAC)

To allow this Pod to communicate with the K8s API server and manage training environments, you must configure **Role-Based Access Control (RBAC)**.

You need to create a `ServiceAccount` and bind it to a `Role` (or `ClusterRole`) that grants permissions list below. Apply your RBAC manifests before deploying the service:

```yaml
rules:
- apiGroups: [""]
  resources: ["pods","services"]
  verbs: ["get","list", "create", "delete"]
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["get","list", "create", "delete"]
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get","list"]
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
- apiGroups: ["sshpiper.com"]
  resources: ["pipes"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]

```

### 3. Deploy to the Cluster

Once the image is built and the RBAC permissions are established, deploy the API service. 

## 🔄 Core API Features

* **Dynamic Environment Deployment**: Receives training task parameters and dynamically generates/applies K8s resource manifests (e.g., Pods, Jobs).
* **Environment Status Monitoring**: Real-time querying of the training environment's running status (Pending, Running, Succeeded, Failed).
* **Resource Reclamation & Cleanup**: Automatically deletes corresponding K8s resources to free up compute capacity when training finishes or a termination command is received.

