# Sistema para controlar a utilização dos automóveis

API desenvolvida em **NestJS** para controle da utilização dos automóveis de uma empresa.


## Principais Rotas da API

### Automóveis (`vehicle`)
- `POST /vehicle` — Cadastrar um novo automóvel
- `GET /vehicle` — Listar automóveis (com filtros opcionais: `color`, `brand`)
- `GET /vehicle/:id` — Recuperar automóvel pelo ID
- `PUT /vehicle/:id` — Atualizar automóvel pelo ID
- `DELETE /vehicle/:id` — Excluir automóvel pelo ID

### Motoristas (`driver`)
- `POST /driver` — Cadastrar um novo motorista
- `GET /driver` — Listar motoristas (com filtro opcional: `name`)
- `GET /driver/:id` — Recuperar motorista pelo ID
- `PUT /driver/:id` — Atualizar motorista pelo ID
- `DELETE /driver/:id` — Excluir motorista pelo ID

### Utilização de automóveis (`usages`)
- `POST /usages/start` — Criar um registro de utilização (data início, motorista, veículo, motivo)
- `PATCH /usages/end/:usageId` — Finalizar uma utilização (registrar data de término)
- `GET /usages` — Listar registros de utilização com dados do motorista e do veículo

---

## 📌 Tecnologias

- Node.js
- NestJS
- Swagger (para documentação da API)
- Persistência em memória (sem banco de dados)
- Jest (testes unitários)

---

## Como executar

### Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- npm

### 1. Instalar dependências:
 ```bash
$ npm install
```
1.1. Se preferir executar o projeto em uma porta alternativa a **3000**(porta padrão), basta criar o arquivo **.env** na raiz do projeto e setar a variável **PORT** com o valor desejado.

### 2. Inicie o servidor

- Execute normalmente (sem reinicialização automática):
```bash
$ npm run start
```
- Execute em modo de observação (reinicialização automática em caso de alterações):
```bash
$ npm run start:dev
```
### 3. Acesse a API em http://localhost:3000

## 🛠️ Testes

- Execute testes unitários usando Jest:

```sh
$ npm run test
```

- Verifique a cobertura dos testes nos arquivos:
```sh
$ npx jest --verbose --coverage
```

## 📜 Documentação da API Swagger
Assim que o projeto estiver em execução, acesse:

Com o swagger é possível simular as requisições, está tudo tipado e com exemplos, mas se preferir pode chamar via postman ou qualquer outra alternativa que realize chamadas HTTP.

http://localhost:3000/WebApi
