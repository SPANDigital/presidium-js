// To run this Jenkinsfile, you need to have the following plugins installed:
// - NodeJS
// - CloudBees AWS Credentials
// - Pipeline: AWS Steps
pipeline {
    agent any
    tools {nodejs "19.4"}
    environment {
        CI = 'true'
        github_repository = "github.com/SPANDigital/presidium-js"
        github_key        =   credentials('github-pat')
    }
    stages {
        stage("Install") {
            steps {
                 sh 'npm install'
            }
        }
        stage("Build") {
            steps {
                sh 'npm run build'
            }
        }
        stage("Tag") {
            environment {
                github_url = 'https://$github_key@${github_repository}'
            }
            stages {
                stage("Tag develop") {
                    when {
                        branch 'develop'
                    }
                    steps {
                        script {
                            TAG=sh(returnStdout: true, script: 'docker run --rm -v "$(pwd):/repo" gittools/gitversion:5.6.4-debian.9-x64-5.0 /repo -output json -showvariable MajorMinorPatch')
                        }
                    }
                }
                stage("Tag main") {
                    when {
                        branch 'main'
                    }
                    steps {
                        script {
                            TAG=sh(returnStdout: true, script: 'docker run --rm -v "$(pwd):/repo" gittools/gitversion:5.6.4-debian.9-x64-5.0 /repo -output json -showvariable FullSemVer')
                            // Delete all old rfv tags
                            sh 'git push -q $github_url -d origin $(git tag -l "*-rfs.*")'
                        }
                    }
                }
                stage("Push Tag") {
                    when {
                        expression { TAG != null }
                    }
                    steps {
                        script {
                            sh "git tag v$TAG"
                            sh "git push -q $github_url --tags"
                        }
                    }
                }
            }
        }
        stage("S3 Upload") {
            when{
                buildingTag()
            }
            steps {
                script {
                    withAWS(credentials: 'aws-credentials', region: 'us-east-2') {
                        s3Upload(file:'dist', bucket:'span-presidium', path:"presidium-js/$TAG_NAME")
                    }
                }
            }
        }
        stage("Github Release") {
            when{
                buildingTag()
            }
            steps {
                script {
                    sh "curl -v -d \"{\"tag_name\": \"$TAG_NAME\"}\" -H \"Authorization: token $github_key\" -X POST \"https://api.github.com/repos/presidium-js/releases\""
                }
            }
        }
    }
}
