# 📚 literando-api

![Static Badge](https://img.shields.io/badge/language-typescript-blue)
![Static Badge](https://img.shields.io/badge/framework-express-brown)
![Static Badge](https://img.shields.io/badge/database-mongodb-green)
![Static Badge](https://img.shields.io/badge/libs-nodemailer_bcrypt_jwt-purple)



> Api criada para o projeto <a href="https://github.com/Jefferson-Guirra/e-commerce"> Literando.</a>





<br>

## 🚀 Instalando

Para a instalação primeiro faça o fork desse repositório e execute os seguintes comandos: 

Linux e Windows

```
npm run install
```





<br>

## ☕ Usando

Para iniciar o servidor use o seguinte comando :

```
npm start
```





<br>

## Variáveis de ambiente:

### Para implementação correta é necessário criar na raiz do projeto um arquivo .env e setar as seguintes variáveis:

Obs: Na função envio de email foi utilizado a biblioteca nodemailer em conjunto com Gmail, para que tudo funcione é necessário tokens de autorização do gmail,
siga as etapas <a href="https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/"> aqui </a> e <a href="https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/"> aqui</a> para conseguir.


```

APP_URL: "URL_APLICATIVO_INTEGRAÇÃO"
JWT_SECRET="SEGREDO_JWT_TOKEN"
GOOGLE_CLIENT_ID: "GOOGLE_CLOUD_API_CLIENT_ID"
GOOGLE_SECRET="SEGREDO_JWT_TOKEN"
GOOGLE_REFRESH_TOKEN="REFRESH_TOKEN_GMAIL"
SERVICE_EMAIL="EMAIL_DE_ENVIO"
MONGO_URL: "URL_MONGODB"
port: "NUMERO_DA_PORTA"
```
