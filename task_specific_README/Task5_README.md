## Task 5: Integrating Google Cloud BigQuery & Azure Text Analytics

## Overview
This task focuses on enhancing CloudMart's data analytics and AI capabilities by:
- **Setting up Google Cloud BigQuery** for order tracking.
- **Configuring Azure Text Analytics** for sentiment analysis.
- **Deploying the updates using Terraform and Kubernetes**.

## Sub-Task 5.1: Google Cloud BigQuery Setup

## **Step 1: Confuguring Google Cloud BigQuery**

### **1. Create a Google Cloud Project**
- Navigate to [Google Cloud Console](https://console.cloud.google.com/).
- Click on the project dropdown and select "New Project".
- Name the project **CloudMart** and create it.

### **2. Enable BigQuery API**
- Go to "APIs & Services" > "Dashboard".
- Click **"+ ENABLE APIS AND SERVICES"**.
- Search for **"BigQuery API"** and enable it.

### **3. Create a BigQuery Dataset**
- In the Google Cloud Console, go to **"BigQuery"**.
- In the Explorer pane, click on your project name.
- Click **"CREATE DATASET"**.
- Set the **Dataset ID to "cloudmart"**.
- Choose your data location and click "CREATE DATASET".

### **4. Create a BigQuery Table**
- In the dataset you just created, click "CREATE TABLE".
- Set the Table name to **"cloudmart-orders"**.
- Define the schema according to your order structure. For example:
    - id: STRING
    - items: JSON
    - userEmail: STRING
    - total: FLOAT
    - status: STRING
    - createdAt: TIMESTAMP
- Click **"CREATE TABLE"**.

### **5. Create a Service Account and Key**
- In the Google Cloud Console, go to **"IAM & Admin"** > **"Service Accounts"**.
- Click **"CREATE SERVICE ACCOUNT"**.
- Name it **"cloudmart-bigquery-sa"** and grant it the **"BigQuery Data Editor"** role.
- After creating, click on the service account, go to the **"Keys"** tab, and click **"ADD KEY" > "Create new key"**.
- Choose JSON as the key type and create.
- Save the downloaded JSON file as **`google_credentials.json`**.

### **6. Configure Lambda Function**
- Navigate to the root directory of your project.
- Enter the Lambda function directory:
```bash
cd application_source_code/backend/src/lambda/addToBigQuery
sudo yum install npm
npm install
```

- Edit the `google_credentials.json` file in this directory and place the content of your key.
- Create a zip file of the entire directory:
- This zip file will be used when creating or updating the Lambda function.

- Return to the root directory of your project:
```bash
nano google_credentials.json
zip -r dynamodb_to_bigquery.zip .
cd ../../..
```
- Update Lambda Function Environment Variables.

Remember to never commit the `google_credentials.json` file to version control. It should be added to your `.gitignore` file.

## **Step 2: Update Terraform Configuration**

### **1. Open and update `main.tf` file**
```bash
nano main.tf
```
- It should include the following:
  - Tables DynamoDB
  - AM Role for Lambda function
  - IAM Policy for Lambda function
  - Lambda function for listing products
  - Lambda permission for Bedrock
  - Output the ARN of the Lambda function
  - Lambda function for DynamoDB to BigQuery
  - Lambda event source mapping for DynamoDB stream

### **2. Apply Terraform changes**
```bash
terraform apply
```

## Sub-Task 5.2: Azure Text Analytics Setup

## **Step 1: Azure Text Analytics Setup**

- Follow these steps to set up Azure Text Analytics for sentiment analysis:

### **1. Create an Azure Account**
- Go to [Azure Portal](https://portal.azure.com/) and log in.

### **2. Create a Text Analytics Resource**
- Click **"Create a resource"**.
- Search for **"Text Analytics"** and select it.
- Configure **resource name - "cloudmart-text-analytics"**, **region**, and **pricing tier**.

### **3. Retrieve API Key and Endpoint**
- Navigate to the resource's **"Keys and Endpoint"** section.
- Copy the **API key** and **endpoint URL**.

## **Step 2: Deploy the Backend Changes**

### **1. Update `cloudmart-backend.yaml` with Azure credentials**
```bash
nano cloudmart-backend.yaml
```
- Build a new image
<Follow ECR steps>

### **2. Apply Kubernetes changes**
```bash
kubectl apply -f cloudmart-backend.yaml
```

## Completion Checklist
✔ **Updated CloudMart Backend & Frontend Code**  
✔ **Configured Google Cloud BigQuery for Order Tracking**  
✔ **Deployed AWS Lambda for BigQuery Integration**  
✔ **Set up Azure Text Analytics for Sentiment Analysis**  
✔ **Deployed updates to Kubernetes**  

## 📖 References
- [Google Cloud BigQuery](https://cloud.google.com/bigquery/docs)
- [Azure Text Analytics](https://learn.microsoft.com/en-us/azure/cognitive-services/text-analytics/)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)