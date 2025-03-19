# Task 4: Configuring Amazon Bedrock Agent and OpenAI Assistant Configuration

## Overview
This task involves integrating AI capabilities into CloudMart by configuring:
- **Amazon Bedrock Agent** for product recommendations.
- **OpenAI Assistant** for customer support.
- **AWS Lambda functions** using Terraform for automation.

## Sub-Task 4.1: Configuring Amazon Bedrock Agent

### **Step 1: Creating resources using Terraform**

- Navigate to the folder containing the main.tf file and place the file containing the Lambda function that will be used by Bedrock.
```bash
cd application_source_code/backend/src/lambda

# Copy the Lambda zip file to the Terraform project directory
cp list_products.zip 

# Move to the Terraform project directory
cd ../../../../terraform-project
```

- Update the main.tf file:
  - to add the resource `aws_iam_role` `lambda_role`.
  - IAM Role for Lambda Execution.
  - Lambda Function for Listing Products
  - Grant Bedrock Permission to Invoke Lambda Function.
  - Output the ARN of the Lambda Function.

### **Step 2: Configuring the Amazon Bedrock Agent**

#### **i. Enable Model Access**
1. Navigate to the Amazon Bedrock Console.
2. Select "Model access" from the navigation panel.
3. Enable Claude 3.5 Sonnet.
4. Wait for status change to "Access granted".

#### **ii. Create the Bedrock Agent**
1. Navigate to "Agents" in the Bedrock console.
2. Click "Create agent".
3. Name it cloudmart-product-recommendation-agent.
4. Select Claude 3.5 Sonnet as the base model.
5. Add instructions for the agent to follow in the "Instructions for the Agent" section:

### **Step 3: Configure the IAM Role for Bedrock Agent**

1. In the Bedrock Agent overview, locate the 'Permissions' section.
2. Click on the IAM role link. This will take you to the IAM console with the correct role selected.
3. In the IAM console, choose "Add permissions" and then "Create inline policy".
4. In the JSON tab, paste the following policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "lambda:InvokeFunction",
      "Resource": "arn:aws:lambda:*:*:function:cloudmart-list-products"
    },
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0"
    }
  ]
}
```
5. Replace cloudmart-list-products with the actual name of your Lambda function, if different.
6. Name the policy (for example, "BedrockAgentLambdaAccess") and create it.
7. Verify that the new policy is attached to the role.

### **Step 4: Configure Action Group**
1. In the "Action groups" section, create a new group called "Get-Product-Recommendations".
2. Set the action group type as "Define with API schemas".
3. Select the Lambda function "cloudmart-list-products" as the action group executor.
4. In the "Action group schema" section, choose "Define via in-line schema editor".
5. Paste the OpenAPI schema below into the schema editor.

```json
{
    "openapi": "3.0.0",
    "info": {
        "title": "Product Details API",
        "version": "1.0.0",
        "description": "This API retrieves product information. Filtering parameters are passed as query strings. If query strings are empty, it performs a full scan and retrieves the full product list."
    },
    "paths": {
        "/products": {
            "get": {
                "summary": "Retrieve product details",
                "description": "Retrieves a list of products based on the provided query string parameters. If no parameters are provided, it returns the full list of products.",
                "parameters": [
                    {
                        "name": "name",
                        "in": "query",
                        "description": "Retrieve details for a specific product by name",
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {
                                                "type": "string"
                                            },
                                            "description": {
                                                "type": "string"
                                            },
                                            "price": {
                                                "type": "number"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorResponse"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "components": {
        "schemas": {
            "ErrorResponse": {
                "type": "object",
                "properties": {
                    "error": {
                        "type": "string",
                        "description": "Error message"
                    }
                },
                "required": [
                    "error"
                ]
            }
        }
    }
}
```

### **Step 5: Review, Create and Test Agent**
1. Click "Prepare agent" to finalize creation.
2. Test using "Test Agent" panel to have conversations with the chatbot.
3. Verify product recommendations based on API responses.

### **Step 6: Create an Alias for the Agent**
1. Navigate to "Aliases" on the agent details page.
2. Click "Create alias".
3. Name the alias cloudmart-prod.
4. Assign it to the most recent agent version.

- Note: Make sure that the Lambda function name in the IAM policy matches the actual name of your function and adjust the region in the ARNs if you're not using us-east-1.

## Sub-Task 4.2: OpenAI Assistant Configuration

- This section covers configuring an OpenAI assistant to enhance CloudMart's customer support system.

### **Step 1: OpenAI Access**
1. Access the OpenAI platform at [OpenAI Platform](https://platform.openai.com/).
2. Log in or create an account if you don't have one yet.
> **Note:** You will need to add at least **\$5.00 credit** for API access to function properly.

### **Step 2: Create the Assistant**
1. Navigate to the `Assistants` section.
2. Click on `Create New Assistant`.
3. Name the assistant `CloudMart Customer Support`.
4. Select the model `gpt-4o`.

### **Step 3: Configure the Assistant**
1. In the `Instructions` section, paste the instructions you want your AI assistant to follow.
2. In `Capabilities`, enable `Code Interpreter` if you want the assistant to assist with technical aspects of the platform.

### **Step 4: Save the Assistant**
1. After creating the assistant, it `automatically saves`.
2. `Note down the Assistant ID`, as you'll need it for environment variables.

### **Step 5: Generate API Key**
1. Go to the `API Keys` section in your OpenAI account.
2. Generate a new `API key`.
3. `Copy this key`, as you'll need it for environment variables.

## Sub-Task 4.3: Redeploy the Backend with AI Assistants

### **Step 1: Update **`cloudmart-backend.yaml`** with AI Assistant Information**

- Open the `cloudmart-backend.yaml` file:
```bash
nano cloudmart-backend.yaml
```
- Add the `OpenAI API Key` and `Assistant ID` in the environment variables:

### **Step 2: Update the Deployment in Kubernetes**

- Apply the changes in Kubernetes:
```bash
kubectl apply -f cloudmart-backend.yaml
```

## Sub-Task 4.4: Test the AI Assistant
1. After redeploying, test the assistant in your CloudMart backend.
2. Ensure it correctly handles customer queries and provides relevant responses.

## Completion Checklist
✔ **Deployed AWS Lambda function via Terraform**
✔ **Created IAM roles and policies for Lambda**.   
✔ **Configured Amazon Bedrock Agent for product recommendations**
✔ **Integrated Lambda with Bedrock to fetch and return product recommendations**  
✔ **Set up OpenAI Assistant for customer support**  
✔ **Updated backend deployment with AI Assistant environment variables.**  
✔ **Successfully redeployed CloudMart backend with AI assistant integration**  

## 📖 References
- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)
- [OpenAI Assistants API](https://platform.openai.com/docs/assistants)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)