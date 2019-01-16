node {
    def app
    def project = 'axiata'
    def appName = 'svc-merchant'

    stage('Clone repository') {
      checkout scm
    }

    stage('Build Image') {
      if (env.BRANCH_NAME == 'origin/kube-dev') {
        sh 'mv config.template.json config.json'
        sh 'sed -i "s|__DB_HOST__|$MYSQL_DEV|g" config.json'
        sh 'sed -i "s|__DB_PORT__|3306|g" config.json'
        sh 'sed -i "s|__DB_NAME__|mandiri_mutation|g" config.json'
        sh 'sed -i "s|__DB_USER__|$MYSQL_DEV_USER|g" config.json'
        sh 'sed -i "s|__DB_PASS__|$MYSQL_DEV_PASSWD|g" config.json'
        sh 'sed -i "s|__MANDIRI_USERNAME__|someusername|g" config.json'
        sh 'sed -i "s|__MANDIRI_PASSWORD__|somepassword|g" config.json'
        sh 'sed -i "s|__NODE_ENV__|development|g" config.json'
        sh 'sed -i "s|__MANDIRI_INTERNET_URL__|https://ibank.bankmandiri.co.id/retail3/|g" config.json'
        sh 'sed -i "s|__TOPUP_SERVICE__|https://gateway.dev.boost.id/bank-mutation/|g" config.json'
        app = docker.build("${project}/boost-dev-${appName}")
      } else {
        sh 'mv config.template.json config.json'
        sh 'sed -i "s|__DB_HOST__|$MYSQL_DEV|g" config.json'
        sh 'sed -i "s|__DB_PORT__|3306|g" config.json'
        sh 'sed -i "s|__DB_NAME__|mandiri_mutation|g" config.json'
        sh 'sed -i "s|__DB_USER__|$MYSQL_DEV_USER|g" config.json'
        sh 'sed -i "s|__DB_PASS__|$MYSQL_DEV_PASSWD|g" config.json'
        sh 'sed -i "s|__MANDIRI_USERNAME__|someusername|g" config.json'
        sh 'sed -i "s|__MANDIRI_PASSWORD__|somepassword|g" config.json'
        sh 'sed -i "s|__NODE_ENV__|production|g" config.json'
        sh 'sed -i "s|__MANDIRI_INTERNET_URL__|https://ibank.bankmandiri.co.id/retail3/|g" config.json'
        sh 'sed -i "s|__TOPUP_SERVICE__|https://gateway.boost.id/bank-mutation/|g" config.json'
         app = docker.build("${project}/boost-prod-${appName}")
      }
    }

    stage('Push image') {
      docker.withRegistry('https://karimunjawa.boost.id/axiata', 'karimunjawa-credentials') {
        app.push("${env.BUILD_NUMBER}")
        app.push("latest")
      }
    }
}
