# Task 2: Deploying CloudMart Application Using Kubernetes

## Overview

In this task, we will **Dockerize** the CloudMart application and deploy it on **AWS EKS** (Elastic Kubernetes Service). This includes:

- **Building Docker Images** for Backend & Frontend.
- **Setting up AWS EKS** and deploying the application.
- **Configuring Kubernetes Deployments & Services**.

## Sub-Task 2.1: Docker

### **Step 1. Install and Configure Docker on EC2**

```bash
# Update the system packages to ensure we have the latest updates
sudo yum update -y

# Install Docker on the EC2 instance
sudo yum install docker -y

# Start the Docker service
sudo systemctl start docker

# Verify that Docker is installed correctly by running a test container
sudo docker run hello-world

# Enable Docker to start automatically on system boot
sudo systemctl enable docker

# Check Docker version to confirm successful installation
docker --version

# Add the current user to the Docker group to run Docker without sudo
sudo usermod -a -G docker $(whoami)

# Apply the new group permissions without logging out
newgrp docker
```

### **Step 2. Create Docker Images for CloudMart**

#### **Backend**
```bash
# Create a directory for the backend and navigate into it
mkdir -p application_source_code/backend && cd application_source_code/backend
# Put your backend code here.

# Create an environment configuration file for the backend service
nano .env
```

**Content of `.env`:**
```bash
# Keep placeholders for AI Assistant IDs for both BEDROCK and OPENAI

PORT=5000
AWS_REGION=us-east-1
BEDROCK_AGENT_ID=<your-bedrock-agent-id>
BEDROCK_AGENT_ALIAS_ID=<your-bedrock-agent-alias-id>
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_ASSISTANT_ID=<your-openai-assistant-id>

# Create a Dockerfile to containerize the backend service
nano Dockerfile
```

#### **Frontend**

```bash
# Navigate out of the backend directory and create a frontend directory
cd ..
mkdir frontend && cd frontend

# Put your backend code here.

# Create a Dockerfile for the frontend service
nano Dockerfile
```

---

## Sub-Task 2.1: Kubernetes

AWS Kubernetes service is not free.

### **Step 3. Deploy CloudMart Application on AWS EKS**
- Install Kubernetes CLI Tools
```bash
# Create a user named eksuser with Admin privileges and authenticate with it
aws configure

# Install the CLI tool eksctl
# Download and install eksctl, a CLI tool for managing Amazon EKS clusters
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo cp /tmp/eksctl /usr/bin

# Verify eksctl installation
eksctl version

# Install the CLI tool kubectl
# Download and install kubectl, the Kubernetes command-line tool
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.18.9/2020-11-02/bin/linux/amd64/kubectl
chmod +x ./kubectl
mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$PATH:$HOME/bin

# Persist the PATH change
echo 'export PATH=$PATH:$HOME/bin' >> ~/.bashrc

# Verify kubectl installation
kubectl version --short --client
```

- Create an EKS cluster named 'cloudmart' with one worker node
```bash
eksctl create cluster \
  --name cloudmart \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 1 \
  --with-oidc \
  --managed

# Connect to the EKS Cluster - update kubeconfig to interact with the newly created cluster
aws eks update-kubeconfig --name cloudmart

# Verify Cluster Connectivity - check if the cluster and nodes are running successfully
kubectl get svc
kubectl get nodes
```

- Create a Role & Service Account for Kubernetes Pods, to provide pods access to services used by the application (DynamoDB, Bedrock, etc)
```bash
eksctl create iamserviceaccount \
  --cluster=cloudmart \
  --name=cloudmart-pod-execution-role \
  --role-name CloudMartPodExecutionRole \
  --attach-policy-arn=arn:aws:iam::aws:policy/AdministratorAccess\
  --region us-east-1 \
  --approve
```

- We should always follow the principle to provide least privilege in production environments.

### **Step 4. Backend Deployment on Kubernetes**

```bash
# Create an ECR Repository for the Backend and Upload Docker Image
# Create an ECR repository for the backend
Repository name: cloudmart-backend
```

#### Follow the ECR steps to build your Docker image

- Create a Kubernetes Deployment File (YAML) for the Backend
```bash
# Switch to backend folder
cd ../..
cd application_source_code/backend
nano cloudmart-backend.yaml
```

### **Step 5. Frontend Deployment on Kubernetes**

- Update Frontend .env Configuration
- Change the Frontend's .env file to point to the API URL created within Kubernetes obtained by the kubectl get service command.

```bash
cd application_source_code/frontend
nano .env

# Content of .env:
VITE_API_BASE_URL=http://<your_url_kubernetes_api>:5000/api

# Create an ECR Repository for the Frontend and Upload Docker Image to it
Repository name: cloudmart-frontend

#Create a Kubernetes Deployment File (YAML) for the Frontend
nano cloudmart-frontend.yaml
```

- Deploy the Frontend on Kubernetes
- Monitor Frontend Deployment

```bash 
kubectl apply -f cloudmart-frontend.yaml

# Monitor the status of objects being created and obtain the public IP generated for the API
kubectl get pods
kubectl get deployment
kubectl get service
```

## Completion Checklist

✔ **Dockerized Backend & Frontend**\
✔ **Pushed Docker Images to Amazon ECR**\
✔ **Deployed Kubernetes Cluster on AWS EKS**\
✔ **Deployed Backend & Frontend using Kubernetes**

## 📖 References

- [Docker Documentation](https://docs.docker.com/)
- [Amazon EKS Guide](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
- [AWS ECR Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html)