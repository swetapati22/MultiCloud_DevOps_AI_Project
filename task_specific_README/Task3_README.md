# Task 3: CI/CD Pipeline Configuration for CloudMart

## Overview
This task focuses on automating the **build, test, and deployment** process of the CloudMart application using **AWS CodePipeline**. The pipeline will automatically pull code from GitHub, build Docker images, and deploy the application on **AWS EKS**.

## Sub-Task 3.1: CI/CD Pipeline Configuration

### **Step 1. Pushing source code to GitHub**
```bash
# Create a new repository on GitHub called cloudmart
cd application_source_code/frontend
<Run GitHub steps>

# Start by pushing the changes in the CloudMart application source code to GitHub
git status
git add -A
git commit -m "app sent to repo"
git push
```

### **Step 2. Configure AWS CodePipeline**
- Create a New Pipeline.
- Configure AWS CodeBuild to Build the Docker Image.
- Create a Build Project.

#### **i. Create a New Pipeline:**
1. Access AWS CodePipeline.
2. Start the 'Create pipeline' process.
    - Name: `cloudmart-cicd-pipeline`
3. Use the GitHub repository `cloudmart-application` as the source.
4. Add the 'cloudmartBuild' project as the build stage.
5. Add the 'cloudmartDeploy' project as the deployment stage.

#### **ii. Create a Build Project:**
1. Give the project a name (for example, `cloudmartBuild`).
2. Connect it to your existing GitHub repository (`cloudmart-application`).
    - Image: amazonlinux2-x86_64-standard:4.0
3. Configure the environment to support Docker builds. Enable "Enable this flag if you want to build Docker images or want your builds to get elevated privileges"
4. Add the environment variable `ECR_REPO` with the ECR repository URI.
5. For the build specification, use the `buildspec.yml`.
- Contents of the buildspec.yml
```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      docker: 20
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws --version
      - REPOSITORY_URI=$ECR_REPO
      **- aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/l4c0j8h9**
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $REPOSITORY_URI:latest .
      - docker tag $REPOSITORY_URI:latest $REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker image...
      - docker push $REPOSITORY_URI:latest
      - docker push $REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION
      - export imageTag=$CODEBUILD_RESOLVED_SOURCE_VERSION
      - printf '[{\"name\":\"cloudmart-app\",\"imageUri\":\"%s\"}]' $REPOSITORY_URI:$imageTag > imagedefinitions.json
      - cat imagedefinitions.json
      - ls -l

env:
  exported-variables: ["imageTag"]

artifacts:
  files:
    - imagedefinitions.json
    - cloudmart-frontend.yaml
```

#### **iii. Add the AmazonElasticContainerRegistryPublicFullAccess permission to ECR in the service role.**
1. Access the IAM console > Roles.
2. Look for the role created "cloudmartBuild" for CodeBuild.
3. Add the permission `AmazonElasticContainerRegistryPublicFullAccess`.

## Sub-Task 3.2: Configure AWS CodeBuild for Application Deployment

#### **i. Create a Deployment Project:**
1. Repeat the process of creating projects in CodeBuild.
2. Give this project a different name (for example, `cloudmartDeployToProduction`).
3. Configure the environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY for the credentials of the user `eks-user` in Cloud Build, so it can authenticate to the Kubernetes cluster.
4. For real-world production environment, it is recommended to use an IAM role for this purpose. In this practical exercise, I directly using the credentials of the `eks-user` to facilitate the process. 
5. Here my focus is on CI/CD and not on user authentication. Refer "Enabling IAM principal access to your cluster" in AWS documentation if IAM role is needed.

#For the deployment specification, use the following `buildspec.yml`:
- Contents of the `buildspec.yml
```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      docker: 20
    commands:
      - curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.18.9/2020-11-02/bin/linux/amd64/kubectl
      - chmod +x ./kubectl
      - mv ./kubectl /usr/local/bin
      - kubectl version --short --client
  post_build:
    commands:
      - aws eks update-kubeconfig --region us-east-1 --name cloudmart
      - kubectl get nodes
      - ls
      - IMAGE_URI=$(jq -r '.[0].imageUri' imagedefinitions.json)
      - echo $IMAGE_URI
      - sed -i "s|CONTAINER_IMAGE|$IMAGE_URI|g" cloudmart-frontend.yaml
      - kubectl apply -f cloudmart-frontend.yaml
```

- Replace the image URI on line 18 of the `cloudmart-frontend.yaml` files with CONTAINER_IMAGE.
```bash
# Commit and push the changes.
git add -A
git commit -m "replaced image uri with CONTAINER_IMAGE"
git push
```

## Sub-Task 3.3: Test your CI/CD Pipeline

1. Update the application code in the `cloudmart-application` repository like changing the heading in the index.jsx: File `src/components/MainPage/index.jsx` line 93

```bash
# Make a Change on GitHub, Commit and push the changes.
git add -A
git commit -m "changed to Featured Products on CloudMart"
git push
```
    
2. Observe the Pipeline Execution:
- CodePipeline automatically triggers the build and after the build, the deployment phase should begin.

3. Verify the Deployment:
- Check Kubernetes using `kubectl` commands to confirm the application update.

## Completion Checklist
✔ **Configured AWS CodePipeline**  
✔ **Set Up AWS CodeBuild for Docker Image Creation**  
✔ **Automated Deployment to AWS EKS**  
✔ **Tested and Validated CI/CD Pipeline**  

## 📖 References
- [AWS CodePipeline Documentation](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)
- [AWS CodeBuild Documentation](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
- [AWS EKS Guide](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)