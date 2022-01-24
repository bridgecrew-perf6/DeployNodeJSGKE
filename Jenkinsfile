pipeline {
     agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
metadata:
  namespace: jenkins
  name: 'jenkinspod'

spec:
  serviceAccountName: jenkins-sa
  volumes:
      - name: kaniko-secret
        secret:
         secretName: kaniko-secret
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
        - sleep
    args:
        - '9999999'
    volumeMounts:
        - name: kaniko-secret
          mountPath: /secret
    env:
        - name: GOOGLE_APPLICATION_CREDENTIALS
          value: /secret/cred.json
    
  - name: jenkinspod
    image: asia-south1-docker.pkg.dev/model-axe-117106/my-repository/jenkinspod:1.0
    command:
        - sleep
    args:
        - '9999999'
        '''
    }
  }
stages {
stage('Git Fetch'){
            steps{
                git branch: 'dev', credentialsId: '2707e53c-886a-4af7-a94c-a9d30e5ca8b0', url: 'https://github.com/deep1993nov/DeployNodeJSGKE.git'
                    
                }
            }
        

       

        stage('Build'){
            steps{
                container(name: 'kaniko', shell: '/busybox/sh') {
                sh '''#!/busybox/sh
            ls
            cd app
            ls
            /kaniko/executor --context `pwd` --destination asia-south1-docker.pkg.dev/model-axe-117106/my-repository/nodeimage:$BUILD_NUMBER
          '''
        }
            }
        }

         

         stage('Deploy in PRE-PROD'){
            steps{
                container(name: 'jenkinspod', shell: '/bin/bash') {
                sh '''
            ls
            helm install myfirsthelmapppp mychart/ 
          '''
        }
            }
        }

        stage('Deploy to GKE PROD') {
            steps {
                           withCredentials([file(credentialsId: 'mykubeconfig', variable: 'KUBECONFIG')]) {
                            container(name: 'jenkinspod', shell: '/bin/bash') {
                     // change context with related namespace
                        sh """
                        export KUBECONFIG=\${KUBECONFIG}
                        helm install myfirsthelmapp mychart/

                            """
                    }
                }
            }
 
        }

      
}

}
    

