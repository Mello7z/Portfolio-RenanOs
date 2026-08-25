import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // TopBar & System Menu
    'topbar.system': 'Sistema',
    'topbar.about': 'Sobre este OS',
    'topbar.preferences': 'Preferências',
    'topbar.wallpaper': 'Trocar Fundo de Tela',
    'topbar.lock': 'Bloquear Tela',
    'topbar.reboot': 'Reiniciar Sistema',
    'topbar.windows': 'Janelas',
    'topbar.openWindows': 'Janelas Abertas',
    'topbar.noWindows': 'Nenhuma janela aberta',
    'topbar.minimizeAll': 'Minimizar Todas',
    'topbar.closeAll': 'Fechar Todas',
    'topbar.help': 'Ajuda',
    'topbar.terminalHelp': 'Terminal & Comandos',
    'topbar.contactHelp': 'Contato Direto',
    'topbar.systemGuide': 'Guia do Sistema',
    'topbar.mobile': 'Celular',
    'topbar.desktop': 'Desktop',

    // Language Toggle Button
    'topbar.langBtn': '🌐 PT',
    'topbar.langTitle': 'Alternar idioma (Português / Inglês)',

    // LockScreen & BootScreen
    'lock.unlockInstruction': 'Clique ou toque para desbloquear',
    'lock.subInstruction': 'Acesse o ambiente tático de Renan Mello',
    'lock.status': 'SISTEMA SEGURO — RENANOS v3.0',
    'boot.initialization': 'Inicializando RenanOS v3.0...',
    'boot.loadingModules': 'Carregando módulos de IA, Projetos e Segurança...',
    'boot.ready': 'Sistema Pronto.',

    // App Labels & Subtitles
    'app.dossie.label': 'Dossiê',
    'app.dossie.subtitle': 'Sobre Mim',
    'app.dossie.title': 'Dossiê — Identidade Confidencial',
    'app.missoes.label': 'Missões',
    'app.missoes.subtitle': 'Projetos',
    'app.missoes.title': 'Missões — Registro de Operações',
    'app.arsenal.label': 'Arsenal',
    'app.arsenal.subtitle': 'Habilidades',
    'app.arsenal.title': 'Arsenal — Equipamento Tático',
    'app.terminal.label': 'Terminal',
    'app.terminal.subtitle': 'Shell',
    'app.terminal.title': 'Terminal Seguro — Cyber Ops',
    'app.sinal.label': 'Sinal',
    'app.sinal.subtitle': 'Contato',
    'app.sinal.title': 'Sinal — Canal Criptografado',
    'app.trilha.label': 'Trilha',
    'app.trilha.subtitle': 'Player',
    'app.trilha.title': 'Trilha Sonora — Lofi Sessions',
    'app.registros.label': 'Registros',
    'app.registros.subtitle': 'Galeria',
    'app.registros.title': 'Registros — Arquivo Visual',
    'app.diario.label': 'Diário',
    'app.diario.subtitle': 'Notas',
    'app.diario.title': 'Diário de Bordo — Notas',
    'app.calendario.label': 'Agenda',
    'app.calendario.subtitle': 'Calendário',
    'app.calendario.title': 'Agenda de Operações',
    'app.arcade.label': 'Arcade',
    'app.arcade.subtitle': 'Mini-game',
    'app.arcade.title': 'Arcade — Protocolo de Reflexos',
    'app.memoria.label': 'Memória',
    'app.memoria.subtitle': 'Mini-game',
    'app.memoria.title': 'Jogo da Memória Hacker — CriptoCards',
    'app.snake.label': 'Snake',
    'app.snake.subtitle': 'Mini-game',
    'app.snake.title': 'Cyber Snake — Protocolo de Captura',
    'app.typing.label': 'CyberType',
    'app.typing.subtitle': 'Mini-game',
    'app.typing.title': 'CyberType — Teste de Velocidade Hack',
    'app.bomba.label': 'Defuse',
    'app.bomba.subtitle': 'Mini-game',
    'app.bomba.title': 'Cyber Defuse — Desarme o Cronômetro',
    'app.curriculo.label': 'Currículo',
    'app.curriculo.subtitle': 'Resume PDF',
    'app.curriculo.title': 'Currículo Vitae — Renan Mello',
    'app.browser.label': 'Navegador',
    'app.browser.subtitle': 'Cyber Web',
    'app.browser.title': 'Navegador Cyber — Web & Finanças',
    'app.calc.label': 'Calculadora',
    'app.calc.subtitle': 'Utilitário',
    'app.calc.title': 'Calculadora Científica Cyber',
    'app.code.label': 'Code Studio',
    'app.code.subtitle': 'IDE Web',
    'app.code.title': 'Code Studio — Editor & Executor TypeScript',
    'app.planodefundo.label': 'Fundo de Tela',
    'app.planodefundo.subtitle': 'Personalização',
    'app.planodefundo.title': 'Galeria de Fundo de Tela',
    'app.vault.label': 'Vault',
    'app.vault.subtitle': 'Segurança',
    'app.vault.title': 'Vault — Cofre de Segredos',

    // General UI
    'ui.search': 'Pesquisar aplicativos, projetos ou comandos...',
    'ui.welcome': 'Bem-vindo ao RenanOS',
    'ui.quickAccess': 'Acesso Rápido',
    'ui.allApps': 'Todos os Módulos',
    'ui.activeSignal': 'Sinal Criptografado Ativo',
    'ui.close': 'Fechar',
    'ui.minimize': 'Minimizar',
    'ui.maximize': 'Maximizar',
    'ui.restore': 'Restaurar',
    'ui.copy': 'Copiar',
    'ui.copied': 'Copiado!',
    'ui.download': 'Baixar PDF',
    'ui.openLink': 'Acessar Link',
    'ui.back': 'Voltar',
    'ui.next': 'Avançar',
    'ui.submit': 'Enviar',
    'ui.saving': 'Salvando...',
    'ui.clear': 'Limpar',
    'ui.viewProject': 'Ver Projeto',
    'ui.viewDemo': 'Ver Demo',
    'ui.developer': 'Desenvolvedor Full-Stack & Cyber Security',
    'ui.fapesp': 'Atuação na FAPESP (TI & Processos Digitais)',
  },
  en: {
    // TopBar & System Menu
    'topbar.system': 'System',
    'topbar.about': 'About this OS',
    'topbar.preferences': 'Preferences',
    'topbar.wallpaper': 'Change Wallpaper',
    'topbar.lock': 'Lock Screen',
    'topbar.reboot': 'Restart System',
    'topbar.windows': 'Windows',
    'topbar.openWindows': 'Open Windows',
    'topbar.noWindows': 'No open windows',
    'topbar.minimizeAll': 'Minimize All',
    'topbar.closeAll': 'Close All',
    'topbar.help': 'Help',
    'topbar.terminalHelp': 'Terminal & Commands',
    'topbar.contactHelp': 'Direct Contact',
    'topbar.systemGuide': 'System Guide',
    'topbar.mobile': 'Mobile',
    'topbar.desktop': 'Desktop',

    // Language Toggle Button
    'topbar.langBtn': '🌐 EN',
    'topbar.langTitle': 'Switch language (English / Portuguese)',

    // LockScreen & BootScreen
    'lock.unlockInstruction': 'Click or tap to unlock',
    'lock.subInstruction': 'Access the tactical portfolio of Renan Mello',
    'lock.status': 'SYSTEM SECURE — RENANOS v3.0',
    'boot.initialization': 'Booting RenanOS v3.0...',
    'boot.loadingModules': 'Loading AI, Projects & Security modules...',
    'boot.ready': 'System Ready.',

    // App Labels & Subtitles
    'app.dossie.label': 'Dossier',
    'app.dossie.subtitle': 'About Me',
    'app.dossie.title': 'Dossier — Confidential Identity',
    'app.missoes.label': 'Missions',
    'app.missoes.subtitle': 'Projects',
    'app.missoes.title': 'Missions — Operations Log',
    'app.arsenal.label': 'Arsenal',
    'app.arsenal.subtitle': 'Skills',
    'app.arsenal.title': 'Arsenal — Tactical Gear',
    'app.terminal.label': 'Terminal',
    'app.terminal.subtitle': 'Shell',
    'app.terminal.title': 'Secure Terminal — Cyber Ops',
    'app.sinal.label': 'Signal',
    'app.sinal.subtitle': 'Contact',
    'app.sinal.title': 'Signal — Encrypted Channel',
    'app.trilha.label': 'Soundtrack',
    'app.trilha.subtitle': 'Audio Player',
    'app.trilha.title': 'Soundtrack — Lofi Sessions',
    'app.registros.label': 'Records',
    'app.registros.subtitle': 'Gallery',
    'app.registros.title': 'Records — Visual Archives',
    'app.diario.label': 'Journal',
    'app.diario.subtitle': 'Notes',
    'app.diario.title': 'Ship Journal — Notes',
    'app.calendario.label': 'Schedule',
    'app.calendario.subtitle': 'Calendar',
    'app.calendario.title': 'Operations Schedule',
    'app.arcade.label': 'Arcade',
    'app.arcade.subtitle': 'Mini-game',
    'app.arcade.title': 'Arcade — Reflex Protocol',
    'app.memoria.label': 'Memory',
    'app.memoria.subtitle': 'Mini-game',
    'app.memoria.title': 'Hacker Memory Game — CryptoCards',
    'app.snake.label': 'Snake',
    'app.snake.subtitle': 'Mini-game',
    'app.snake.title': 'Cyber Snake — Capture Protocol',
    'app.typing.label': 'CyberType',
    'app.typing.subtitle': 'Mini-game',
    'app.typing.title': 'CyberType — Speed Typing Test',
    'app.bomba.label': 'Defuse',
    'app.bomba.subtitle': 'Mini-game',
    'app.bomba.title': 'Cyber Defuse — Defuse the Bomb',
    'app.curriculo.label': 'Resume',
    'app.curriculo.subtitle': 'PDF Resume',
    'app.curriculo.title': 'Curriculum Vitae — Renan Mello',
    'app.browser.label': 'Browser',
    'app.browser.subtitle': 'Cyber Web',
    'app.browser.title': 'Cyber Browser — Web & Finance',
    'app.calc.label': 'Calculator',
    'app.calc.subtitle': 'Utility',
    'app.calc.title': 'Cyber Scientific Calculator',
    'app.code.label': 'Code Studio',
    'app.code.subtitle': 'Web IDE',
    'app.code.title': 'Code Studio — TypeScript IDE & Playground',
    'app.planodefundo.label': 'Wallpaper',
    'app.planodefundo.subtitle': 'Customization',
    'app.planodefundo.title': 'Wallpaper Gallery',
    'app.vault.label': 'Vault',
    'app.vault.subtitle': 'Security',
    'app.vault.title': 'Vault — Secret Locker',

    // General UI
    'ui.search': 'Search apps, projects or commands...',
    'ui.welcome': 'Welcome to RenanOS',
    'ui.quickAccess': 'Quick Access',
    'ui.allApps': 'All Modules',
    'ui.activeSignal': 'Encrypted Signal Active',
    'ui.close': 'Close',
    'ui.minimize': 'Minimize',
    'ui.maximize': 'Maximize',
    'ui.restore': 'Restore',
    'ui.copy': 'Copy',
    'ui.copied': 'Copied!',
    'ui.download': 'Download PDF',
    'ui.openLink': 'Open Link',
    'ui.back': 'Back',
    'ui.next': 'Next',
    'ui.submit': 'Send',
    'ui.saving': 'Saving...',
    'ui.clear': 'Clear',
    'ui.viewProject': 'View Project',
    'ui.viewDemo': 'View Demo',
    'ui.developer': 'Full-Stack Developer & Cyber Security',
    'ui.fapesp': 'Working at FAPESP (IT & Digital Processes)',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('renanos_lang');
    return (saved === 'en' || saved === 'pt') ? saved : 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('renanos_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['pt'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
