# Task 1: Setup AWS Resources with Terraform

## Overview
This task focuses on setting up AWS infrastructure for CloudMart using **Terraform**. We will:
- Launch an **EC2 instance** as a DevOps workstation.
- Assign the required **IAM Role**.
- Install **Terraform**.
- Deploy **DynamoDB tables** to store CloudMart’s data - product, order, and ticket management using Terraform.

### **Step 1. Create IAM Role for EC2**
1. Navigate to AWS IAM Console
2. Create Role -> AWS Service -> EC2
3. Attach AdministratorAccess Policy or limited access in production
4. Name: EC2Admin
5. Create Role


### **Step 2. Launch EC2 Instance**

1. Navigate to AWS EC2 Console
2. Launch Instance -> Amazon Linux 2 AMI
3. Instance Type: t2.micro
4. Assign IAM Role: EC2Admin
4. Configure Security Group: Allow SSH
5. Review and launch, selecting or creating a key pair.

### **Step 3. Connect to EC2 Instance and Install Terraform**

- Connect to EC2 instance using EC2 Instance Connect
```bash
# Update system packages
sudo yum update -y

# Install yum-utils
sudo yum install -y yum-utils

# Add HashiCorp repository
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo

# Install Terraform
sudo yum -y install terraform

# Verify installation
terraform version
```

### **Step 4. Create Cloud DynamoDB Tables and Apply Terraform Configuration**

```bash
# Create a new directory for Terraform project
mkdir terraform-project && cd terraform-project

# Create and open main.tf
nano main.tf

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Apply configuration
terraform apply

# Confirm creation by typing 'yes'
```

### This will create the DynamoDB with 3 tables:
- Products Table
- Orders Table 
- Customer Service Tickets

## Checklist

✔ **EC2 instance launched & configured**  
✔ **IAM role assigned to EC2 instance**  
✔ **Terraform installed & initialized**  
✔ **DynamoDB tables provisioned using Terraform**  

## 📖 References
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [AWS EC2 User Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html)