# ☁️ CloudMart - MultiCloud, DevOps & AI Platform

## Overview
CloudMart is an AI-powered **eCommerce platform** designed to operate seamlessly across **AWS, Google Cloud, and Azure**. This project demonstrates expertise in **multi-cloud infrastructure**, **CI/CD automation**, **Kubernetes orchestration**, and **AI-powered integrations** leveraging **Amazon Bedrock, OpenAI Assistants, and Azure Text Analytics**.
Demo Video Link: [View here](https://youtu.be/_LvKL2LE5qU)  

---

## Features

- **Automated Multi-Cloud Infrastructure Deployment** via Terraform
- **Containerized CloudMart Application** with Docker & Kubernetes
- **End-to-End CI/CD Pipeline** powered by AWS CodePipeline & CodeBuild
- **AI-Driven Product Recommendations** using Amazon Bedrock
- **Customer Support AI Assistant** powered by OpenAI
- **Google BigQuery Integration** for Order Tracking & Analytics
- **Sentiment Analysis** with Azure Text Analytics

---

## Tech Stack

- **Cloud Providers:** AWS, Google Cloud, Azure
- **Infrastructure as Code (IaC):** Terraform
- **CI/CD Pipeline:** AWS CodePipeline, AWS CodeBuild
- **Containerization & Orchestration:** Docker, Kubernetes (EKS)
- **AI & ML Services:** Amazon Bedrock, OpenAI, Azure Text Analytics
- **Data Processing & Storage:** AWS DynamoDB, Google BigQuery
- **Backend:** Node.js (Express)
- **Frontend:** React.js

---

## 📂 Folder Structure

```
CloudMart_Project/
│-- application_source_code/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── lambda/  
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── server.js
│   │   ├── cloudmart-backend.yaml  
│   │   ├── Dockerfile  
│   │   ├── package.json  
│
│   ├── frontend/  
│   │   ├── src/
│   │   ├── cloudmart-frontend.yaml  
│   │   ├── Dockerfile  
│   │   ├── package.json  
│
│-- terraform-project/  # Infrastructure as Code (Terraform)
│   ├── main.tf
│   ├── terraform.tfstate
│   ├── index.mjs
```

---

## Deployment Guide

### **Task 1. Provision AWS Infrastructure using Terraform**
📄 [See Detailed Steps for Task 1 Here](https://github.com/swetapati22/MultiCloud_DevOps_AI_Project/blob/main/task_specific_README/Task1_README.md)
- Create IAM Role for EC2.
- Launch EC2 Instance.
- Navigate to the Terraform directory:
  ```bash
  cd terraform-project
  ```
- Initialize and deploy the AWS resources:
  ```bash
  terraform init
  terraform apply
  ```
- This step provisions **EC2**, **DynamoDB**, **IAM Roles**, and supporting infrastructure.

---

### **Task 2️. Build & Deploy CloudMart Application**
📄 [See Detailed Steps for Task 2 Here](https://github.com/swetapati22/MultiCloud_DevOps_AI_Project/blob/main/task_specific_README/Task2_README.md)
- **Dockerize the backend and frontend:**
  ```bash
  docker build -t cloudmart-backend application_source_code/backend/
  docker build -t cloudmart-frontend application_source_code/frontend/
  ```
- **Push images to AWS ECR** (Ensure you are authenticated with ECR):
  ```bash
  docker push <ECR_REPO_URI>/cloudmart-backend:latest
  docker push <ECR_REPO_URI>/cloudmart-frontend:latest
  ```

---

### **Task 3️. Deploy Kubernetes Cluster on AWS EKS**
📄 [See Detailed Steps for Task 3 Here](https://github.com/swetapati22/MultiCloud_DevOps_AI_Project/blob/main/task_specific_README/Task3_README.md)
- Create an EKS cluster:
  ```bash
  eksctl create cluster --name cloudmart --region us-east-1 --nodes 1
  aws eks update-kubeconfig --name cloudmart
  ```
- Deploy the backend and frontend services:
  ```bash
  kubectl apply -f application_source_code/backend/cloudmart-backend.yaml
  kubectl apply -f application_source_code/frontend/cloudmart-frontend.yaml
  ```

---

### **Task 4️. Set Up CI/CD Pipeline**
📄 [See Detailed Steps for Task 4 Here](https://github.com/swetapati22/MultiCloud_DevOps_AI_Project/blob/main/task_specific_README/Task4_README.md)
- Add `buildspec.yml` to both the **backend** and **frontend** repositories.
- Configure AWS CodePipeline to automate deployments.
- Push code changes to GitHub and validate the pipeline execution.

---

### **Task 5️. Integrate AI & Data Processing**
📄 [See Detailed Steps for Task 5 Here](https://github.com/swetapati22/MultiCloud_DevOps_AI_Project/blob/main/task_specific_README/Task5_README.md)
#### **Amazon Bedrock for AI-Driven Product Recommendations**
- Deploy AWS Lambda function: `application_source_code/backend/src/lambda/list_products.zip`
- Configure **Amazon Bedrock Agent** via Terraform in `terraform-project/main.tf`

#### **OpenAI Assistant for AI-Powered Customer Support**
- Store API Key in **`application_source_code/backend/.env`**
- Modify Kubernetes deployment file **`application_source_code/backend/cloudmart-backend.yaml`** to integrate the assistant.

#### **Google Cloud BigQuery for Order Tracking & Data Analytics**
- Set up a **BigQuery Dataset** and create an **orders table**.
- Deploy AWS Lambda: `application_source_code/backend/src/lambda/addToBigQuery.zip`

#### **Azure Text Analytics for Sentiment Analysis**
- Update `application_source_code/backend/cloudmart-backend.yaml` with Azure API credentials.

---

## 📖 References
- [AWS EKS Guide](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)
- [OpenAI Assistants API](https://platform.openai.com/docs/assistants)
- [Google BigQuery Guide](https://cloud.google.com/bigquery/docs)
- [Azure Text Analytics](https://learn.microsoft.com/en-us/azure/cognitive-services/text-analytics/)

