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



### Build Docker Image

Build Image Locally

```bash
docker tag SOURCE-IMAGE LOCATION-docker.pkg.dev/PROJECT-ID/REPOSITORY/IMAGE
```

Example:
Docker tag  LOCALIMAGENAME asia-south1-docker.pkg.dev/model-axe-117106/my-repository/NODEIM:1.0 .


