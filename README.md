# Deploy NodeJS to GKE

## Installing Jenkins on GKE
From MarketPlace: https://console.cloud.google.com/marketplace/product/google/jenkins
From Scratch: https://cloud.google.com/architecture/jenkins-on-kubernetes-engine-tutorial

### Create External Access for Jenkins

```bash
apiVersion: v1
kind: Service
metadata:
  name: jenkins-svc
spec:
  type: LoadBalancer
  selector:
    statefulset.kubernetes.io/pod-name: cd-jenkins-0
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080

```
### Create Artifact registry
#### Docker Login to Artifact registry

```bash
cat KEY-FILE | docker login -u KEY-TYPE --password-stdin \
https://LOCATION-docker.pkg.dev
```
### Get Endpoint Address for Jenkins
```bash
kubectl describe service cd-jenkins  | grep Endpoint 
```
#### Update endpoint address in Kubernetes Cloud on Jenkins

### Workload Idenity setup

Kubernetes service account to impersonate the Google service account 
```bash
gcloud iam service-accounts add-iam-policy-binding GSA_NAME@PROJECT_ID.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:PROJECT_ID.svc.id.goog[K8S_NAMESPACE/KSA_NAME]"
```

Add the iam.gke.io/gcp-service-account=GSA_NAME@PROJECT_ID annotation to the Kubernetes service account
```bash
kubectl annotate serviceaccount KSA_NAME \
    --namespace K8S_NAMESPACE \
    iam.gke.io/gcp-service-account=GSA_NAME@PROJECT_ID.iam.gserviceaccount.com
```

### Create Secret for Kaniko
```bash
kubectl create secret generic kaniko-secret -n default --from-file=cred.json 
```

### Create a service account & create role binding
```bash
kubectl create serviceaccount jenkins-sa -n jenkins
```

```bash
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: Role
metadata:
 name: jenkins-agent
 namespace: jenkins
rules:
  - apiGroups: ["*"]
    resources: ["*"]
    verbs: ["*"]


---

apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
 name: jenkins-agent
 namespace: jenkins
roleRef:
 apiGroup: rbac.authorization.k8s.io
 kind: Role
 name: jenkins-agent
subjects:
  - kind: ServiceAccount
    name: jenkins-sa
```
### Build Docker Image

Build Image Locally

```bash
docker tag SOURCE-IMAGE LOCATION-docker.pkg.dev/PROJECT-ID/REPOSITORY/IMAGE
```

Example:
Docker tag  LOCALIMAGENAME asia-south1-docker.pkg.dev/model-axe-117106/my-repository/NODEIM:1.0 .


gcloud projects add-iam-policy-binding model-axe-117106 \
--member=terra-dev@model-axe-117106.iam.gserviceaccount.com \
--role=roles/artifactregistry.reader


## Deploying App onto Multiple Clusters

### We need kubeconfig file so that our agents can comminicate to diff clusters

Kuberconfig file is situated on /home/.kube/config
We need to delete existing kubeconfig and then autheticate to the cluster to generate the new kubeconfig file.
Then we need to upload the kubeconfig file as secret text on jenkins

Our Jenkins Slave agent must have Gcloud installed

```bash
ENV CLOUDSDK_INSTALL_DIR /usr/lib
RUN curl -sSL https://sdk.cloud.google.com | bash
```

Our Pipeline config would be like this below

```bash
 stage('Deploy to GKE PROD') {
            steps {
                           withCredentials([file(credentialsId: 'mykubeconfig', variable: 'KUBECONFIG')]) {
                            container(name: 'jenkinspod', shell: '/bin/bash') {
                     // change context with related namespace
                        sh """
                        export KUBECONFIG=\${KUBECONFIG}
                        helm install -n default myfirsthelmapp mychart/

                            """
                    }
                }
            }
 
        }
```






