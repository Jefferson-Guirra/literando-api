# 🗺 literando-api

Api criada para o projeto <a href="https://github.com/Jefferson-Guirra/e-commerce"> Literando.</a>


## 🚀 Instalando

Para a instalação primeiro faça o fork desse repositorio e execute os seguintes comandos: 

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

## Variaveis de ambiente:

### Para implementação correta é necessario criar na raiz do projeto um arquivo .env e setar as seguintes variaveis:

Obs: para serviço de envio de email foi utilizado a biblioteca nodemailer em conjunto com Gmail, para que tudo funcione é necessario tokens de autorização do gmail,
para consegui-los siga as etapas <a href="https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/"> aqui </a> e <a href="https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/"> aqui.</a>.


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
