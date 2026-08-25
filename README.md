# ⚡ RenanOS — Portfólio Interativo em Web OS

<div align="center">

![RenanOS Banner](https://raw.githubusercontent.com/Mello7z/renan-os/main/public/placeholder-logo.svg)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**Um portfólio moderno para desenvolvedores concebido como um Sistema Operacional Cyberpunk / Tático completo, responsivo e em tempo real.**

[Acessar Live Demo](https://ais-pre-22smnqyltcerwjv4tnbq4c-98527099169.us-west1.run.app) · [Reportar Bug](https://github.com/Mello7z/renan-os/issues) · [Solicitar Feature](https://github.com/Mello7z/renan-os/issues)

</div>

---

## 🖥️ Sobre o Projeto

O **RenanOS** redefine a experiência de navegação de um portfólio profissional. Em vez de uma página estática comum, o visitante interage com uma área de trabalho completa com janelas arrastáveis, sistema multitarefa, efeitos visuais retro-futuristas, terminal interativo e persistência de dados em nuvem.

### ✨ Principais Funcionalidades

- **🪟 Gerenciador de Janelas Completo**: Minimize, maximize, redimensione e sobreponha janelas com controle de foco e profundidade (Z-index).
- **📟 Terminal Interativo**: Linha de comando com comandos utilitários (`help`, `about`, `skills`, `projects`, `contact`, `clear`, `matrix`, `sudo`, `date`).
- **☁️ Integração em Tempo Real com Firebase**:
  - **Canal de Contato (Sinal)**: Mensagens enviadas pelos visitantes são gravadas instantaneamente no **Google Firestore Database**.
  - **Diário de Bordo**: Anotações e reflexões sincronizadas com o banco de dados em nuvem.
- **🎮 Central Arcade & Mini-Games**:
  - *Typing Test*: Teste de velocidade de digitação em tempo real (WPM e precisão).
  - *Cyber Snake*: Jogo clássico da cobrinha com visual tático.
  - *Memory Matrix*: Jogo da memória com ícones de desenvolvimento.
- **🎵 Player de Áudio & Synth Lofi**: Música ambiente relaxante e efeitos sonoros com sintetizador web integrado.
- **🌐 Internacionalização (i18n)**: Alternância dinâmica e instantânea de idioma entre **Português (PT-BR)** e **Inglês (EN-US)**.
- **🎨 Efeitos Visuais Customizáveis**: Scanlines CRT, grade HUD holográfica, chuva de código Matrix e paletas temáticas.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Ferramenta / Biblioteca |
| :--- | :--- |
| **Frontend Core** | React 19, TypeScript 5.8 |
| **Build & Bundler** | Vite 6 |
| **Estilização** | Tailwind CSS v4, Motion (Framer Motion) |
| **Ícones** | Lucide React |
| **Backend & Cloud** | Google Cloud Run, Firebase Firestore, Firebase Hosting |
| **Persistência** | Cloud Firestore + Fallback LocalStorage |

---

## 📁 Estrutura do Projeto

```text
renan-os/
├── public/                  # Assets estáticos e favicons
├── src/
│   ├── components/
│   │   ├── apps/            # Aplicativos executáveis da área de trabalho
│   │   │   ├── ArcadeApp.tsx
│   │   │   ├── DiarioApp.tsx
│   │   │   ├── HabilidadesApp.tsx
│   │   │   ├── ProjetosApp.tsx
│   │   │   ├── SinalApp.tsx
│   │   │   ├── SobreApp.tsx
│   │   │   ├── TerminalApp.tsx
│   │   │   └── ...
│   │   ├── os/              # Componentes estruturais do sistema
│   │   │   ├── Desktop.tsx
│   │   │   ├── Dock.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── Window.tsx
│   │   │   └── ...
│   ├── lib/
│   │   └── firebase.ts      # Inicialização e chamadas do Firestore
│   ├── App.tsx              # Componente principal do SO
│   ├── index.css            # Configurações globais e shaders do Tailwind
│   └── main.tsx             # Ponto de entrada React
├── firebase.json            # Configuração de deploy do Firebase Hosting
├── firestore.rules          # Regras de segurança do banco de dados
├── package.json
└── vite.config.ts
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- Gerenciador de pacotes `npm` ou `pnpm` / `yarn`

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Mello7z/renan-os.git
   cd renan-os
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

---

## 🌐 Como Fazer Deploy

### Firebase Hosting

1. **Gere a build de produção:**
   ```bash
   npm run build
   ```

2. **Publique no Firebase:**
   ```bash
   firebase deploy --only hosting
   ```

---

## 📬 Contato

- **Desenvolvedor:** Renan Emanoel Rocha
- **E-mail:** [renan.rochaa0@gmail.com](mailto:renan.rochaa0@gmail.com)
- **LinkedIn:** [linkedin.com/in/renan-emanoel-5237273b7](https://www.linkedin.com/in/renan-emanoel-5237273b7/)
- **GitHub:** [@Mello7z](https://github.com/Mello7z)

---

<div align="center">
  <sub>Desenvolvido com ⚡ por Renan Rocha. Licença MIT.</sub>
</div>
