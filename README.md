# 🏗️ Cloudflare Work + D1 - Guia Completo

### 🚀 Ambiente online
```sh
https://thenews-front.pages.dev/
```
### E-mail que tem permissões
```sh teste10@exemplo.com ```

### 🚀 Introdução

Antes de tudo, obrigado por proporcionar essa experiência de aprendizado! Trabalhar com **Cloudflare Work** tem sido incrível. Claro que não usei nem metade das funcionalidades, mas acredito que já aprendi bastante. Vamos nessa! 😃

## 📦 Instalação e Configuração

Antes de iniciar, instale as dependências do projeto com:

```sh
npm install
```

Para rodar o projeto localmente, use:

```sh
npm run dev
```

Antes de enviar requisições para a API, siga os passos abaixo para configurar o banco de dados **D1**, o banco SQL do **Cloudflare** que estamos utilizando no projeto.

---

## 🏗️ Criando e Configurando o Banco D1

### 1️⃣ Instalar o Wrangler (CLI do Cloudflare)

Para facilitar nossa vida, instalamos o **Wrangler**, a CLI do Cloudflare:

```sh
npm install -g wrangler
```

### 2️⃣ Fazer Login no Cloudflare

Execute o seguinte comando para fazer login na sua conta do Cloudflare:

```sh
wrangler login
```

Isso abrirá uma guia no navegador para autenticação.

### 3️⃣ Criar um Banco D1

Agora, criamos um banco de dados no **Cloudflare D1**:

```sh
wrangler d1 create {nome-do-banco}
```

Isso gerará credenciais como essas:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "teste",
      "database_id": "bd1a9ae7-4101-4183-8d65-d5d85884877a"
    }
  ]
}
```

Guarde esses dados, pois os utilizaremos em breve! 🎯

### 4️⃣ Configurar o `wrangler.json`

Abra o arquivo **`wrangler.json`** e configure as credenciais obtidas na etapa anterior. Ele deve ficar parecido com:

```json
{
  "name": "meu-projeto",
  "compatibility_date": "2024-02-23",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "teste",
      "database_id": "bd1a9ae7-4101-4183-8d65-d5d85884877a"
    }
  ]
}
```

### 5️⃣ Criar as Tabelas do Banco

Agora, vamos rodar a **migração** para criar as tabelas no banco:

```sh
wrangler d1 execute {nome-do-banco} --env dev --file schema.sql
```

Isso criará todas as tabelas necessárias para o funcionamento da aplicação. 🔥

### 6️⃣ Resetar o Banco (Opcional)

Se precisar resetar o banco de dados e apagar todas as tabelas, execute:

```sh
wrangler d1 execute {nome-do-banco} --env dev --file script-delete-tables.sql
```

Isso removerá todas as tabelas existentes no banco.

---

## 🚀 Comandos Úteis

### 📌 Rodar o Projeto em Produção

```sh
npm run deploy
```

### 📌 Rodar uma Migração Manualmente

```sh
wrangler d1 execute the-news-production --env production --remote --file dump.sql

⚠️ **Atenção**: Antes de subir a aplicação, certifique-se de que:
1. Você configurou corretamente as credenciais do banco de dados de **produção** em `wrangler.json`.
2. Se ainda estiver usando o banco de **desenvolvimento**, passe os parâmetros adequados ou altere o ambiente para `production`.
3. A aplicação será publicada na conta do **Cloudflare** em que você fez login na primeira etapa (`wrangler login`).
```

### 📌 Executar um Comando SQL via Terminal

```sh
wrangler d1 execute the-news-dev --env dev --command "SELECT * FROM newsLetter_openings WHERE user_id = ? ORDER BY id DESC;"
```

### 📌 Rodar Testes Unitários

Para executar os testes unitários do projeto, utilize um dos seguintes comandos:

```sh
npm run test
```

ou

```sh
npm test
```

Isso garantirá que todas as funcionalidades da aplicação estejam funcionando corretamente antes do deploy. ✅

---

## 🎯 Conclusão

Agora você tem tudo pronto para rodar seu projeto com **Cloudflare Work + D1**! 🚀

Caso tenha alguma dúvida ou queira expandir mais o projeto, sinta-se à vontade para explorar as documentações do **Cloudflare** e testar novas implementações.

Bons códigos! 💻🔥

