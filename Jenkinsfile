pipeline {
    agent any

    environment {
        REPO = "spandigital/presidium-js"
    }

    stages {
        stage('Tag') {
            when {
                changeRequest()
                branch 'master' || branch 'develop'
            }
            steps {
                git depth: false
                sh './build/tag_code.sh'
            }
        }
        stage('Bundle JS') {
            when {
                buildingTag()
            }
            steps {
                sh 'npm install'
                sh 'npm run build'
                sh './build/github_release.sh'
                withAWS(credentials: 'aws-s3-credentials', region:'us-west-2') {
                    sh 'aws s3 cp --recursive dist s3://span-presidium/presidium-js/$TAG_NAME'
                }
            }
        }
    }
}
