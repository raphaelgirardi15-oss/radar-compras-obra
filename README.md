# 📡 Radar Semanal — Compras da Obra

Dashboard de acompanhamento semanal de compras para gestão de obras. Controla volume de compras, variações de preço por fornecedor/produto, alertas automáticos e importação de CSV no formato original do sistema.

## Funcionalidades

- **📊 Radar** — KPIs da semana, gráfico de volume semanal, alertas automáticos
- **📈 Preços** — Rastreamento de variação de preço produto a produto
- **📦 Categorias** — Composição semanal por categoria (EPI, Elétrica, Discos etc.)
- **📋 Dados** — Tabela completa com exportação CSV
- **📁 Importação CSV** — Aceita o formato original do sistema de compras
- **✏️ Entrada manual** — Formulário individual ou colagem em lote

## Pré-requisitos

- **Node.js** versão 18 ou superior → [nodejs.org](https://nodejs.org/)
- **Git** → [git-scm.com](https://git-scm.com/)
- Conta gratuita no **Vercel** → [vercel.com](https://vercel.com/) (ou Netlify)

---

## Passo a Passo — Do Zero ao Link Funcionando

### 1. Instalar Node.js

Acesse [nodejs.org](https://nodejs.org/), baixe a versão LTS e instale.

Para confirmar que instalou, abra o terminal (ou Prompt de Comando) e digite:

```bash
node --version
```

Deve aparecer algo como `v18.x.x` ou `v20.x.x`.

### 2. Criar conta no GitHub

Se ainda não tem, crie em [github.com](https://github.com/).

### 3. Criar o repositório

No GitHub, clique em **"New repository"** (botão verde no canto superior direito):

- Nome: `radar-compras-obra`
- Deixe como **Public** ou **Private** (tanto faz)
- **NÃO** marque "Add a README file"
- Clique **Create repository**

### 4. Subir os arquivos

Abra o terminal na pasta onde salvou os arquivos do projeto e execute:

```bash
cd radar-compras-obra
git init
git add .
git commit -m "Radar Semanal - versão inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/radar-compras-obra.git
git push -u origin main
```

> Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub.

### 5. Deploy na Vercel (gratuito)

1. Acesse [vercel.com](https://vercel.com/) e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `radar-compras-obra`
4. A Vercel detecta automaticamente que é um projeto Vite
5. Clique **"Deploy"**
6. Em ~60 segundos, você recebe um link como: `https://radar-compras-obra.vercel.app`

**Pronto!** Esse link é a sua ferramenta. Funciona no computador e no celular.

### Alternativa: Deploy na Netlify

1. Acesse [netlify.com](https://netlify.com/) e faça login com GitHub
2. Clique **"Add new site"** → **"Import an existing project"**
3. Selecione o repositório
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Clique **"Deploy site"**

---

## Como Usar no Dia a Dia

### Importar CSV semanal

1. Exporte o CSV do sistema de compras (mesmo formato do pivot original)
2. Abra o Radar no navegador
3. Clique em **"+ Novo Registro"**
4. Selecione a aba **"📁 Importar CSV"**
5. Clique **"Selecionar arquivo CSV"**
6. Confira a prévia e clique **"Adicionar à base existente"**

### Entrada manual

- Aba **"✏️ Individual"**: preencha campo a campo
- Aba **"📋 Colar em Lote"**: cole linhas no formato `data;fornecedor;produto;categoria;valor_unit;qtd`

### Exportar dados

Na aba **"📋 Dados"**, clique em **"Exportar CSV"** para baixar toda a base.

---

## Estrutura do Projeto

```
radar-compras-obra/
├── index.html          ← Página HTML principal
├── package.json        ← Dependências do projeto
├── vite.config.js      ← Configuração do Vite
├── vercel.json         ← Config de deploy Vercel
├── netlify.toml        ← Config de deploy Netlify
├── .gitignore          ← Arquivos ignorados pelo Git
└── src/
    ├── main.jsx        ← Ponto de entrada React
    ├── index.css       ← Estilos globais
    └── App.jsx         ← Componente principal (toda a lógica)
```

## Onde ficam os dados?

Os dados ficam salvos no **localStorage do navegador** da máquina que acessa. Isso significa:

- Os dados persistem entre sessões (fechar e abrir o navegador)
- Cada computador/celular tem sua própria base
- Limpar o cache do navegador apaga os dados
- Para compartilhar dados entre máquinas, exporte o CSV e importe na outra

---

## Rodar localmente (desenvolvimento)

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Tecnologias

- **React 18** — Interface
- **Recharts** — Gráficos
- **Lodash** — Manipulação de dados
- **Vite** — Build e dev server
- **localStorage** — Persistência local
