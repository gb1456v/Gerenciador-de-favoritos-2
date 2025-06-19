# **Gerenciador de Favoritos Full-Stack**

Este projeto representa o trabalho final da disciplina de **Introdução a Sistemas de Informação**, do curso de **Sistemas de Informação** da **Universidade Federal de Santa Maria (UFSM)**. Demorei em torno de uns 5 dias para realizar o trabalho pois em alguns momentos eu pedia uma coisa pro Gemini e ele respondia o que ele já tinha respondido anteriormente mesmo eu usando a versão Pro.

## **Sobre o Projeto**

O objetivo do trabalho era demonstrar a capacidade de utilizar uma Inteligência Artificial para desenvolver uma aplicação web completa, do início ao fim. Todo o código, desde o backend em Node.js até à interface reativa em React, foi gerado através de uma conversa interativa com o **Google Gemini**.

O meu papel neste caso era de guiar a IA e fazer os prompts e testar as funcionalidades, já eu tenho conhecimento básico em C, HTML, CSS e JS

**Este trabalho foi feito inteiramente com inteligência artificial, e o estudante não precisou escrever manualmente nenhuma linha de código.**

A conversa completa que deu origem a este projeto pode ser encontrada neste link: [**Histórico da Conversa com o Gemini**](http://docs.google.com/https://g.co/gemini/share/2cc85d689f2e)

### **Tecnologias Utilizadas**

* **Backend:** Node.js, Express.js  
* **Frontend:** React, Vite, Tailwind CSS  
* **Banco de Dados:** MySQL  
* **IA:** Google Gemini 2.5 Pro

## **Funcionalidades Principais**

* Autenticação de utilizadores (registo e login com JWT)  
* CRUD completo para favoritos e categorias com suporte para subcategorias.  
* Busca dinâmica por título de favorito.  
* Interface reativa com Modo Escuro.  
* Barra lateral expansível e redimensionável.

## **Como Instalar e Rodar o Projeto**

Siga estes passos para configurar e rodar o projeto localmente.

### **Pré-requisitos**

* [Node.js](https://nodejs.org/) (versão 18 ou superior)  
* [MySQL](https://dev.mysql.com/downloads/mysql/)

### **1\. Clonar o Repositório**

1.    No terminal, digite: git clone https://github.com/gb1456v/Gerenciador-de-favoritos-2

### **2\. Configurar o Banco de Dados**

1. Abra seu cliente MySQL através do comando  mysql \-u root \-p  
2. Execute o arquivo schema.sql para criar o banco de dados e as tabelas:  
   source schema.sql;

3. Saia do cliente MySQL.

### **3\. Configurar Variáveis de Ambiente**

1. Na pasta raiz do projeto, crie uma cópia do arquivo .env.example e renomeie-o para .env.  
2. Abra o arquivo .env e preencha com as suas credenciais do MySQL e uma chave secreta para JWT.

### **4\. Instalar Dependências**

Instale as dependências tanto para o backend como para o frontend.

\# Instalar dependências do backend (na pasta raiz)  
npm install

\# Instalar dependências do frontend  
cd client  
npm install

### **5\. Rodar a Aplicação**

Você precisará de dois terminais abertos.

* **No Terminal 1 (na pasta raiz):**  
  node server.js

* **No Terminal 2 (dentro da pasta *client* na pasta raiz do projeto):**  
  npm run dev

Acesse o endereço fornecido pelo Vite no seu navegador.