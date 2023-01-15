pipeline {
    agent any
    stages {
        stage('Install') { 
            steps {
                 sh './build/jenkins/build.sh'
            }
        }
        // stage('Build') { 
        //     steps {
        //         sh 'npm run build'
        //     }
        // }
        // stage('Deploy') { 
        //     steps {
        //         echo 'deploy!!'
        //     }
        // }
    }
}