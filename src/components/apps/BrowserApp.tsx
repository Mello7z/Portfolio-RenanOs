import { useState, useEffect, type FormEvent } from 'react';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Search,
  Building2,
  Gamepad2,
  ShoppingBag,
  CheckCircle,
  AlertTriangle,
  Zap,
  Terminal,
  Code2,
  Eye,
  EyeOff,
  CreditCard,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Star,
  ShoppingCart,
  Sparkles,
  Library,
  Copy,
  Check,
  PiggyBank,
  QrCode,
  SlidersHorizontal,
  FileText,
  X,
  Plus,
  Coins,
  Bell,
  Wallet,
  Landmark,
  ShieldAlert,
  ChevronRight,
  Receipt,
  Share2,
  Info,
} from 'lucide-react';
import { cyberBank, SHOP_ITEMS, type ShopItem, type BankTransaction } from '../../utils/cyberBank';

export function BrowserApp() {
  const [currentUrl, setCurrentUrl] = useState<string>('matrix://bankofcyber');
  const [inputUrl, setInputUrl] = useState<string>('matrix://bankofcyber');
  const [history, setHistory] = useState<string[]>(['matrix://bankofcyber']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Sync state with cyberBank
  const [balance, setBalance] = useState<number>(cyberBank.getBalance());
  const [savings, setSavings] = useState<number>(cyberBank.getSavings());
  const [inventory, setInventory] = useState<string[]>(cyberBank.getInventory());
  const [isHacked, setIsHacked] = useState<boolean>(cyberBank.isHacked());
  const [transactions, setTransactions] = useState<BankTransaction[]>(cyberBank.getTransactions());

  // Bank UI local state
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [activeBankTab, setActiveBankTab] = useState<'inicio' | 'pix' | 'cartoes' | 'caixinha' | 'emprestimo' | 'seguranca'>('inicio');
  
  // Pix form states
  const [pixKey, setPixKey] = useState<string>('');
  const [pixAmount, setPixAmount] = useState<string>('');
  const [pixSuccessMsg, setPixSuccessMsg] = useState<string | null>(null);

  // Card Controls
  const [showCardDetails, setShowCardDetails] = useState<boolean>(false);
  const [cardBlocked, setCardBlocked] = useState<boolean>(false);
  const [cardLimit, setCardLimit] = useState<number>(15000);

  // Savings / Caixinha controls
  const [savingsAmount, setSavingsAmount] = useState<string>('');
  const [savingsFeedback, setSavingsFeedback] = useState<string | null>(null);

  // Loan Simulator
  const [loanAmount, setLoanAmount] = useState<number>(5000);
  const [loanMonths, setLoanMonths] = useState<number>(12);
  const [loanSuccessMsg, setLoanSuccessMsg] = useState<string | null>(null);

  // Receipt Modal
  const [selectedReceipt, setSelectedReceipt] = useState<BankTransaction | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState<boolean>(false);

  // Notifications Drawer
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Store UI local state
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStoreTab, setActiveStoreTab] = useState<'loja' | 'biblioteca'>('loja');
  const [storeFeedback, setStoreFeedback] = useState<{ id: string; msg: string; error?: boolean } | null>(null);

  useEffect(() => {
    function handleStateChange() {
      setBalance(cyberBank.getBalance());
      setSavings(cyberBank.getSavings());
      setInventory(cyberBank.getInventory());
      setIsHacked(cyberBank.isHacked());
      setTransactions(cyberBank.getTransactions());
    }

    window.addEventListener('renanos_cyber_state_changed', handleStateChange);
    return () => window.removeEventListener('renanos_cyber_state_changed', handleStateChange);
  }, []);

  function navigateTo(url: string) {
    let target = url.trim();
    if (!target.startsWith('matrix://') && !target.startsWith('http')) {
      target = `matrix://${target.toLowerCase().replace(/\s+/g, '-')}`;
    }
    setCurrentUrl(target);
    setInputUrl(target);

    const newHistory = [...history.slice(0, historyIndex + 1), target];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }

  function handleBack() {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prev);
      setInputUrl(prev);
    }
  }

  function handleForward() {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(next);
      setInputUrl(next);
    }
  }

  // Handle instant exploit trigger inside Bank UI
  function triggerBankExploit() {
    cyberBank.setHacked(true);
  }

  // Handle PIX transfer simulation inside Bank
  function handleSendPix(e: FormEvent) {
    e.preventDefault();
    const amt = Number(pixAmount);
    if (!amt || amt <= 0) return;
    if (balance < amt) {
      setPixSuccessMsg('❌ Saldo insuficiente na conta corrente!');
      return;
    }
    cyberBank.deductBalance(amt);
    cyberBank.addTransaction({
      id: 'tx_pix_' + Date.now(),
      type: 'pix_out',
      title: `Pix Enviado para ${pixKey}`,
      subtitle: 'Transferência Pix Instantânea',
      amount: -amt,
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      receiptCode: 'PIX-OUT-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    });
    setPixSuccessMsg(`✅ Pix de R$ ${amt.toLocaleString('pt-BR')},00 enviado com sucesso para ${pixKey}!`);
    setPixAmount('');
    setPixKey('');
    setTimeout(() => setPixSuccessMsg(null), 4000);
  }

  // Handle Savings Deposit
  function handleDepositSavings() {
    const amt = Number(savingsAmount);
    if (!amt || amt <= 0) return;
    if (cyberBank.addSavings(amt)) {
      setSavingsFeedback(`✅ R$ ${amt.toLocaleString('pt-BR')},00 guardados na Caixinha com sucesso!`);
      setSavingsAmount('');
    } else {
      setSavingsFeedback('❌ Saldo insuficiente na conta corrente.');
    }
    setTimeout(() => setSavingsFeedback(null), 3500);
  }

  // Handle Savings Withdraw
  function handleWithdrawSavings() {
    const amt = Number(savingsAmount);
    if (!amt || amt <= 0) return;
    if (cyberBank.withdrawSavings(amt)) {
      setSavingsFeedback(`✅ R$ ${amt.toLocaleString('pt-BR')},00 resgatados para sua conta corrente!`);
      setSavingsAmount('');
    } else {
      setSavingsFeedback('❌ Saldo insuficiente na Caixinha para resgate.');
    }
    setTimeout(() => setSavingsFeedback(null), 3500);
  }

  // Handle Loan Request
  function handleContractLoan() {
    cyberBank.addBalance(loanAmount);
    cyberBank.addTransaction({
      id: 'tx_loan_' + Date.now(),
      type: 'loan',
      title: 'Empréstimo Pessoal Contratado',
      subtitle: `Crédito Imediato em Conta em ${loanMonths}x`,
      amount: loanAmount,
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      receiptCode: 'LOAN-CRED-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    });
    setLoanSuccessMsg(`🎉 R$ ${loanAmount.toLocaleString('pt-BR')},00 creditados na sua conta corrente!`);
    setTimeout(() => setLoanSuccessMsg(null), 4000);
  }

  // Handle Store Purchase
  function handleBuyProduct(item: ShopItem) {
    const res = cyberBank.buyItem(item.id, item.price);
    setStoreFeedback({ id: item.id, msg: res.message, error: !res.success });
    setTimeout(() => setStoreFeedback(null), 3500);
  }

  const filteredProducts = SHOP_ITEMS.filter((item) => {
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const purchasedProducts = SHOP_ITEMS.filter((item) => inventory.includes(item.id));

  return (
    <div className="flex min-h-full flex-col bg-[#07090e] p-3 sm:p-4 text-foreground font-sans select-none space-y-3 overflow-y-auto">
      {/* Chrome / Browser Top Address Bar */}
      <div className="rounded-2xl border border-purple-500/30 bg-[#0f111a] p-2.5 shadow-xl flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-lg border border-white/10 bg-[#161a29] text-zinc-300 hover:bg-[#20263b] disabled:opacity-40 cursor-pointer transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg border border-white/10 bg-[#161a29] text-zinc-300 hover:bg-[#20263b] disabled:opacity-40 cursor-pointer transition-colors"
            title="Avançar"
          >
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => navigateTo(currentUrl)}
            className="p-1.5 rounded-lg border border-white/10 bg-[#161a29] text-zinc-300 hover:bg-[#20263b] cursor-pointer transition-colors"
            title="Atualizar"
          >
            <RotateCw className="size-4" />
          </button>
        </div>

        {/* Browser Address Bar Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigateTo(inputUrl);
          }}
          className="flex-1 flex items-center gap-2 rounded-xl border border-purple-500/40 bg-[#07090e] px-3 py-1.5 text-xs text-white shadow-inner"
        >
          <Lock className="size-3.5 text-purple-400" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full bg-transparent outline-none font-mono text-purple-200 text-xs"
          />
          <button type="submit" className="text-zinc-400 hover:text-white cursor-pointer">
            <Search className="size-3.5" />
          </button>
        </form>

        {/* Live Balance Shortcut */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-mono">
          <span className="text-zinc-400 text-[10px]">CONTA:</span>
          <span className="font-bold text-emerald-400">R$ {balance.toLocaleString('pt-BR')},00</span>
        </div>
      </div>

      {/* Browser Tab Shortcuts */}
      <div className="flex gap-2 text-xs overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => navigateTo('matrix://bankofcyber')}
          className={`rounded-xl border px-3.5 py-1.5 font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 ${
            currentUrl.includes('bankofcyber')
              ? 'border-purple-500 bg-purple-600/30 text-purple-200 shadow-md'
              : 'border-white/10 bg-[#121624] text-zinc-300 hover:border-purple-500/40'
          }`}
        >
          <Building2 className="size-3.5 text-purple-400" /> NuCyber Bank (Portal Bancário)
        </button>
        <button
          onClick={() => navigateTo('matrix://cybergame-store')}
          className={`rounded-xl border px-3.5 py-1.5 font-bold cursor-pointer whitespace-nowrap transition-all flex items-center gap-1.5 ${
            currentUrl.includes('cybergame-store')
              ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-md'
              : 'border-white/10 bg-[#121624] text-zinc-300 hover:border-amber-500/40'
          }`}
        >
          <Gamepad2 className="size-3.5 text-amber-400" /> CyberGame Store (E-commerce)
        </button>
        <button
          onClick={() => navigateTo('matrix://cyber-portal')}
          className="rounded-xl border border-white/10 bg-[#121624] px-3.5 py-1.5 text-zinc-300 hover:border-purple-500/40 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
        >
          <Globe className="size-3.5 text-blue-400" /> Portal de Serviços
        </button>
      </div>

      {/* WEBSITE 1: NuCyber Bank (Authentic Nubank / PagBank Fintech Portal) */}
      {currentUrl.includes('bankofcyber') && (
        <div className="rounded-3xl border border-purple-500/30 bg-[#0d071a] p-4 sm:p-6 text-white space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Top Fintech Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-gradient-to-tr from-[#8A05BE] to-[#C142F4] flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-purple-600/30">
                Nu
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight text-white">NuCyber Bank</h2>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    Conta Verificada
                  </span>
                </div>
                <p className="text-xs text-purple-200/80 font-mono">Agência 0001 • Conta 88204-9 • Renan Mello</p>
              </div>
            </div>

            {/* Notification Bell & Security Status */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-2xl border border-purple-500/30 bg-[#1a0f33] text-purple-200 hover:bg-[#26174a] cursor-pointer transition-colors"
                title="Notificações Bancárias"
              >
                <Bell className="size-4" />
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-400" />
              </button>

              <button
                onClick={() => setActiveBankTab('seguranca')}
                className={`flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold font-mono transition-all cursor-pointer ${
                  isHacked
                    ? 'bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse'
                    : 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                }`}
              >
                {isHacked ? <AlertTriangle className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                {isHacked ? 'SISTEMA INFILTRADO' : 'AUDITORIA DE SEGURANÇA'}
              </button>
            </div>
          </div>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="rounded-2xl border border-purple-500/40 bg-[#160d2b] p-4 text-xs space-y-3 shadow-2xl animate-fadeIn">
              <div className="flex justify-between items-center border-b border-purple-500/20 pb-2">
                <span className="font-bold text-purple-200 flex items-center gap-1.5">
                  <Bell className="size-3.5 text-amber-400" /> Central de Notificações
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="space-y-2 text-zinc-300">
                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-2">
                  <Sparkles className="size-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Rendimento de Caixinha creditado!</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Sua reserva rendeu +R$ 14,80 hoje no CDI 100%.</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-2">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Cartão Virtual Black Desbloqueado</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Seu limite de R$ 50.000,00 está disponível para compras.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Bar inside Bank App */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-purple-500/20">
            <button
              onClick={() => setActiveBankTab('inicio')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeBankTab === 'inicio'
                  ? 'bg-[#8A05BE] text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#190f33] text-purple-200 hover:bg-[#25184a]'
              }`}
            >
              <Landmark className="size-3.5" /> Início
            </button>
            <button
              onClick={() => setActiveBankTab('pix')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeBankTab === 'pix'
                  ? 'bg-[#8A05BE] text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#190f33] text-purple-200 hover:bg-[#25184a]'
              }`}
            >
              <Send className="size-3.5" /> Área Pix
            </button>
            <button
              onClick={() => setActiveBankTab('cartoes')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeBankTab === 'cartoes'
                  ? 'bg-[#8A05BE] text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#190f33] text-purple-200 hover:bg-[#25184a]'
              }`}
            >
              <CreditCard className="size-3.5" /> Cartões
            </button>
            <button
              onClick={() => setActiveBankTab('caixinha')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeBankTab === 'caixinha'
                  ? 'bg-[#8A05BE] text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#190f33] text-purple-200 hover:bg-[#25184a]'
              }`}
            >
              <PiggyBank className="size-3.5" /> Caixinhas (CDI)
            </button>
            <button
              onClick={() => setActiveBankTab('emprestimo')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeBankTab === 'emprestimo'
                  ? 'bg-[#8A05BE] text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#190f33] text-purple-200 hover:bg-[#25184a]'
              }`}
            >
              <Coins className="size-3.5" /> Empréstimos
            </button>
            <button
              onClick={() => setActiveBankTab('seguranca')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeBankTab === 'seguranca'
                  ? 'bg-[#8A05BE] text-white shadow-lg shadow-purple-600/30'
                  : 'bg-[#190f33] text-purple-200 hover:bg-[#25184a]'
              }`}
            >
              <ShieldAlert className="size-3.5" /> Auditoria / Hack
            </button>
          </div>

          {/* TAB 1: INÍCIO / VISÃO GERAL */}
          {activeBankTab === 'inicio' && (
            <div className="space-y-6">
              {/* Account Balance Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-[#1c0c3b] via-[#14082e] to-[#0d041f] p-6 space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-2">
                      <Wallet className="size-4 text-purple-400" /> Conta Corrente
                    </span>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 rounded-xl bg-purple-900/40 text-purple-200 hover:bg-purple-800/60 cursor-pointer transition-colors"
                      title="Ocultar/Exibir Saldo"
                    >
                      {showBalance ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                  </div>

                  <div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                      {showBalance ? `R$ ${balance.toLocaleString('pt-BR')},00` : '••••••••'}
                    </p>
                    <p className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-emerald-400" /> +R$ {savings.toLocaleString('pt-BR')},00 guardados na Caixinha (Rendimento 100% CDI)
                    </p>
                  </div>

                  {/* Fast Action Buttons Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                    <button
                      onClick={() => setActiveBankTab('pix')}
                      className="p-3 rounded-2xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/50 cursor-pointer transition-all flex flex-col items-center gap-1.5 text-center"
                    >
                      <Send className="size-4 text-purple-300" />
                      <span className="text-xs font-bold text-white">Área Pix</span>
                    </button>
                    <button
                      onClick={() => setActiveBankTab('cartoes')}
                      className="p-3 rounded-2xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/50 cursor-pointer transition-all flex flex-col items-center gap-1.5 text-center"
                    >
                      <CreditCard className="size-4 text-purple-300" />
                      <span className="text-xs font-bold text-white">Meus Cartões</span>
                    </button>
                    <button
                      onClick={() => setActiveBankTab('caixinha')}
                      className="p-3 rounded-2xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/50 cursor-pointer transition-all flex flex-col items-center gap-1.5 text-center"
                    >
                      <PiggyBank className="size-4 text-purple-300" />
                      <span className="text-xs font-bold text-white">Caixinhas</span>
                    </button>
                    <button
                      onClick={() => setActiveBankTab('emprestimo')}
                      className="p-3 rounded-2xl border border-purple-500/30 bg-purple-950/40 hover:bg-purple-900/50 cursor-pointer transition-all flex flex-col items-center gap-1.5 text-center"
                    >
                      <Coins className="size-4 text-purple-300" />
                      <span className="text-xs font-bold text-white">Empréstimos</span>
                    </button>
                  </div>
                </div>

                {/* Credit Card Digital Preview */}
                <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#8A05BE] via-[#5C0380] to-[#2E0140] p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-48">
                  <div className="flex justify-between items-start z-10">
                    <span className="font-extrabold text-lg italic text-white tracking-wide">NuCyber</span>
                    <span className="text-[10px] font-extrabold tracking-widest text-purple-100 bg-black/40 px-2.5 py-1 rounded-full border border-white/20">
                      BLACK VIP
                    </span>
                  </div>

                  <div className="space-y-1 z-10">
                    <div className="size-7 rounded-md bg-amber-400/90 border border-amber-200/60 my-1 shadow-sm" />
                    <p className="font-mono text-sm tracking-widest text-white/90">
                      5488 •••• •••• 9920
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-xs z-10">
                    <div>
                      <span className="text-[9px] text-purple-200 block">TITULAR</span>
                      <span className="font-bold text-white uppercase">RENAN MELLO</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-purple-200 block">LIMITE</span>
                      <span className="font-mono font-bold text-white">R$ {cardLimit.toLocaleString('pt-BR')},00</span>
                    </div>
                  </div>

                  <div className="absolute right-0 bottom-0 size-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                </div>
              </div>

              {/* Security Mission Alert */}
              {!isHacked ? (
                <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-950/20 to-purple-950/30 p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-amber-300 text-xs flex items-center gap-2">
                      <Zap className="size-4 text-amber-400 animate-bounce" /> SIMULAÇÃO DE PENTEST — BANCO VULNERÁVEL
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">Cofre de R$ 250.000,00</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    O cofre do banco contém R$ 250.000,00 que podem ser injetados diretamente na sua conta corrente executando o exploit no Terminal ou na guia Auditoria.
                  </p>
                  <button
                    onClick={triggerBankExploit}
                    className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer shadow-lg transition-transform active:scale-95"
                  >
                    Injetar Payload e Sacar R$ 250.000,00
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                    <CheckCircle className="size-4 text-emerald-400" />
                    Ataque SQLi concluído! R$ 250.000,00 adicionados ao seu saldo.
                  </div>
                  <button
                    onClick={() => navigateTo('matrix://cybergame-store')}
                    className="rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer"
                  >
                    Gastar na CyberGame Store ↗
                  </button>
                </div>
              )}

              {/* Transactions History Feed */}
              <div className="rounded-3xl border border-purple-500/20 bg-[#120a24] p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-purple-500/20 pb-3">
                  <h3 className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="size-4 text-purple-400" /> Extrato de Atividades Recentes
                  </h3>
                  <span className="text-[11px] text-purple-300 font-mono">{transactions.length} registros</span>
                </div>

                <div className="space-y-2.5">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedReceipt(tx)}
                      className="p-3.5 rounded-2xl border border-purple-500/15 bg-[#1a0f33]/60 hover:bg-[#251747] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${tx.amount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {tx.amount > 0 ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white group-hover:text-purple-200 transition-colors">{tx.title}</p>
                          <p className="text-[11px] text-zinc-400">{tx.subtitle} • <span className="font-mono text-zinc-500">{tx.date}</span></p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`font-mono font-bold text-xs ${tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-200'}`}>
                          {tx.amount > 0 ? '+' : ''}R$ {Math.abs(tx.amount).toLocaleString('pt-BR')},00
                        </span>
                        <span className="block text-[10px] text-purple-400 font-mono group-hover:underline">Ver Comprovante ↗</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ÁREA PIX */}
          {activeBankTab === 'pix' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Send Pix Form */}
              <div className="rounded-3xl border border-purple-500/30 bg-[#140b28] p-5 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Send className="size-4 text-purple-400" /> Transferência Pix Instantânea
                </h3>

                <form onSubmit={handleSendPix} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-purple-200 block font-medium">Chave Pix do Destinatário (CPF/CNPJ, E-mail, Celular):</label>
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder="ex: renan.rochaa0@gmail.com"
                      className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0618] p-3 text-xs text-white outline-none focus:border-purple-400 font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-purple-200 block font-medium">Valor a Enviar (R$):</label>
                    <input
                      type="number"
                      value={pixAmount}
                      onChange={(e) => setPixAmount(e.target.value)}
                      placeholder="0,00"
                      className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0618] p-3 text-xs font-mono text-emerald-400 outline-none focus:border-purple-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-[#8A05BE] p-3 text-xs font-bold text-white hover:bg-[#a107dd] cursor-pointer shadow-lg transition-transform active:scale-95"
                  >
                    Confirmar Envio Pix
                  </button>

                  {pixSuccessMsg && (
                    <p className="text-xs font-bold text-emerald-400 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      {pixSuccessMsg}
                    </p>
                  )}
                </form>
              </div>

              {/* My Pix Keys Box */}
              <div className="rounded-3xl border border-purple-500/30 bg-[#140b28] p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <QrCode className="size-4 text-purple-400" /> Suas Chaves Pix Cadastradas
                  </h3>

                  <div className="p-3.5 rounded-2xl border border-purple-500/20 bg-[#0c0618] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-purple-300 font-bold">Chave Principal (E-mail)</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Ativa
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 font-mono text-xs bg-[#170c30] p-2.5 rounded-xl border border-purple-500/20">
                      <span className="text-white truncate">renan.rochaa0@gmail.com</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCopiedKey(true);
                          setTimeout(() => setCopiedKey(false), 2000);
                        }}
                        className="p-1 text-purple-300 hover:text-white cursor-pointer"
                        title="Copiar Chave Pix"
                      >
                        {copiedKey ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-purple-500/20 bg-purple-950/20 text-xs text-zinc-300 space-y-1">
                  <p className="font-bold text-purple-200 flex items-center gap-1.5">
                    <Info className="size-4 text-purple-400" /> QR Code Pix Dinâmico
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Você pode receber pagamentos instantâneos de qualquer banco usando sua chave cadastrada sem taxas de transferência.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CARTÕES */}
          {activeBankTab === 'cartoes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Virtual Black Card Display */}
              <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#8A05BE] via-[#5C0380] to-[#2E0140] p-6 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="font-black text-xl italic text-white tracking-wide">NuCyber</span>
                    <p className="text-[10px] text-purple-200">Black Virtual Card</p>
                  </div>
                  <span className={`text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full border ${cardBlocked ? 'bg-red-500/30 border-red-400 text-red-200' : 'bg-emerald-500/30 border-emerald-400 text-emerald-200'}`}>
                    {cardBlocked ? 'BLOQUEADO' : 'ATIVO / VIRTUAL'}
                  </span>
                </div>

                <div className="space-y-2 z-10 font-mono">
                  <div className="size-8 rounded-lg bg-amber-400/90 border border-amber-200/60 shadow-md" />
                  <p className="text-lg tracking-widest text-white font-bold">
                    {showCardDetails ? '5488 9201 3340 9920' : '5488 •••• •••• 9920'}
                  </p>
                  {showCardDetails && (
                    <div className="flex gap-4 text-xs text-purple-200">
                      <span>CVV: <strong>882</strong></span>
                      <span>VALIDADE: <strong>12/32</strong></span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end text-xs z-10 pt-4 border-t border-white/20">
                  <div>
                    <span className="text-[9px] text-purple-200 block">TITULAR</span>
                    <span className="font-bold text-white uppercase text-sm">RENAN MELLO</span>
                  </div>
                  <button
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/20 text-xs font-bold text-white hover:bg-black/60 cursor-pointer"
                  >
                    {showCardDetails ? 'Ocultar Cartão' : 'Revelar Dados'}
                  </button>
                </div>
              </div>

              {/* Card Controls & Limit Adjustment */}
              <div className="rounded-3xl border border-purple-500/30 bg-[#140b28] p-5 space-y-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-purple-400" /> Gestão de Limite do Cartão
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-200 font-medium">Ajustar Limite de Crédito:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      R$ {cardLimit.toLocaleString('pt-BR')},00
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={cardLimit}
                    onChange={(e) => setCardLimit(Number(e.target.value))}
                    className="w-full accent-[#8A05BE] cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                    <span>Mín: R$ 1.000,00</span>
                    <span>Máx Aprovado: R$ 50.000,00</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-500/20 space-y-3">
                  <button
                    onClick={() => setCardBlocked(!cardBlocked)}
                    className={`w-full rounded-2xl p-3 text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                      cardBlocked
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
                    }`}
                  >
                    <Lock className="size-4" />
                    {cardBlocked ? 'Desbloquear Cartão Virtual' : 'Bloquear Cartão Temporariamente'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAIXINHAS & INVESTIMENTOS */}
          {activeBankTab === 'caixinha' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-purple-500/30 bg-[#140b28] p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
                    <PiggyBank className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Caixinha do Futuro</h3>
                    <p className="text-xs text-emerald-400 font-medium">Rendimento de 100% do CDI automático</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-purple-500/20 bg-[#0c0618] space-y-1 font-mono">
                  <span className="text-[10px] text-zinc-400 block">VALOR GUARDADO NA CAIXINHA</span>
                  <p className="text-2xl font-bold text-emerald-400">R$ {savings.toLocaleString('pt-BR')},00</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-purple-200 block">Valor da Operação (R$):</label>
                  <input
                    type="number"
                    value={savingsAmount}
                    onChange={(e) => setSavingsAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0618] p-3 text-xs font-mono text-emerald-400 outline-none focus:border-purple-400"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDepositSavings}
                      className="rounded-2xl bg-[#8A05BE] p-3 text-xs font-bold text-white hover:bg-[#a107dd] cursor-pointer shadow-lg"
                    >
                      Guardar Dinheiro
                    </button>
                    <button
                      onClick={handleWithdrawSavings}
                      className="rounded-2xl border border-purple-500/40 bg-purple-950/40 p-3 text-xs font-bold text-purple-200 hover:bg-purple-900/50 cursor-pointer"
                    >
                      Resgatar p/ Conta
                    </button>
                  </div>

                  {savingsFeedback && (
                    <p className="text-xs font-bold text-emerald-400 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      {savingsFeedback}
                    </p>
                  )}
                </div>
              </div>

              {/* CDI Benefits Box */}
              <div className="rounded-3xl border border-purple-500/30 bg-[#140b28] p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Sparkles className="size-4 text-purple-400" /> Vantagens das Caixinhas NuCyber
                  </h3>
                  <ul className="space-y-2.5 text-xs text-zinc-300">
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      Rendimento diário superior à poupança (10.75% a.a.)
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      Resgate imediato a qualquer momento para a conta corrente
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                      Garantia pelo FGC (Fundo Garantidor de Créditos)
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200">
                  <p className="font-bold">Estimativa para 1 Ano:</p>
                  <p className="text-[11px] text-zinc-400">Guardando R$ 1.000,00 você ganha ~R$ 107,50 líquidos ao ano.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EMPRÉSTIMOS */}
          {activeBankTab === 'emprestimo' && (
            <div className="rounded-3xl border border-purple-500/30 bg-[#140b28] p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
                  <Coins className="size-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Simulador de Empréstimo Pré-Aprovado</h3>
                  <p className="text-xs text-purple-200">Crédito caindo na hora da sua conta sem burocracia</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-200 font-medium">Valor Solicitado:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        R$ {loanAmount.toLocaleString('pt-BR')},00
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="50000"
                      step="1000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full accent-[#8A05BE] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-200 font-medium">Número de Parcelas:</span>
                      <span className="font-mono font-bold text-purple-300 text-sm">{loanMonths}x</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[6, 12, 24, 36].map((m) => (
                        <button
                          key={m}
                          onClick={() => setLoanMonths(m)}
                          className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            loanMonths === m
                              ? 'bg-[#8A05BE] text-white shadow-md'
                              : 'bg-[#0c0618] border border-purple-500/20 text-purple-300'
                          }`}
                        >
                          {m}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-purple-500/30 bg-[#0c0618] space-y-3 flex flex-col justify-between">
                  <div className="space-y-2 text-xs">
                    <span className="text-purple-300 font-bold uppercase tracking-wider block">Resumo do Empréstimo:</span>
                    <div className="flex justify-between py-1 border-b border-purple-500/20">
                      <span className="text-zinc-400">Valor das Parcelas</span>
                      <span className="font-bold text-white font-mono">
                        {loanMonths}x de R$ {Math.round((loanAmount * 1.15) / loanMonths).toLocaleString('pt-BR')},00
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Taxa de Juros</span>
                      <span className="font-bold text-emerald-400">1.2% ao mês</span>
                    </div>
                  </div>

                  <button
                    onClick={handleContractLoan}
                    className="w-full rounded-2xl bg-[#8A05BE] p-3 text-xs font-bold text-white hover:bg-[#a107dd] cursor-pointer shadow-lg transition-transform active:scale-95"
                  >
                    Contratar Empréstimo Agora
                  </button>

                  {loanSuccessMsg && (
                    <p className="text-xs font-bold text-emerald-400 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      {loanSuccessMsg}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUDITORIA DE SEGURANÇA & PENTEST */}
          {activeBankTab === 'seguranca' && (
            <div className="rounded-3xl border border-amber-500/30 bg-[#120a20] p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <ShieldAlert className="size-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Central de Auditoria de Segurança & Pentest</h3>
                  <p className="text-xs text-amber-300">Ambiente de Testes de Penetração em Banco de Dados PostgreSQL</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-amber-500/30 bg-[#090510] space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-zinc-400 border-b border-white/10 pb-2">
                  <span>SERVIDOR CENTRAL: 10.240.88.99:5432</span>
                  <span className="text-amber-400 font-bold">CVE-2026-SQLI-BYPASS</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  O endpoint do banco de dados de transferências possui uma falha crítica de injeção SQL no parâmetro de autorização.
                  Injetar o código aceita credenciais universais e transfere o cofre bancário.
                </p>

                <div className="p-3 rounded-xl bg-black/60 border border-amber-500/20 text-amber-300 text-[11px]">
                  <code>UNION SELECT admin_token, 250000 FROM users WHERE '1'='1</code>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                {!isHacked ? (
                  <button
                    onClick={triggerBankExploit}
                    className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-3 text-xs font-extrabold text-black hover:from-amber-400 hover:to-amber-300 cursor-pointer shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                  >
                    <Zap className="size-4 fill-black" /> Executar Exploit SQLi (+R$ 250.000,00)
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="size-4" /> Cofre Invadido! Saldo de R$ 250.000,00 concedido.
                    </span>
                    <button
                      onClick={() => cyberBank.resetSimulation()}
                      className="text-xs text-zinc-400 underline hover:text-white cursor-pointer"
                    >
                      Resetar Estado do Banco
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RECEIPT MODAL (Comprovante Digital Realista) */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-4">
          <div className="w-full max-w-sm rounded-3xl border border-purple-500/40 bg-[#120826] p-6 text-white space-y-5 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-purple-900/40 text-purple-300 hover:bg-purple-800/60 cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="text-center space-y-2 border-b border-purple-500/20 pb-4">
              <div className="size-12 rounded-2xl bg-[#8A05BE] mx-auto grid place-items-center font-extrabold text-white text-lg shadow-lg">
                Nu
              </div>
              <h3 className="font-extrabold text-base tracking-tight">Comprovante de Transação</h3>
              <p className="text-[10px] text-purple-300 font-mono">NuCyber Pagamentos S.A.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="text-center py-2 bg-[#0a0416] rounded-2xl border border-purple-500/20 font-mono">
                <span className="text-[10px] text-zinc-400 block">VALOR PROCESSADO</span>
                <span className={`text-2xl font-extrabold ${selectedReceipt.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {selectedReceipt.amount > 0 ? '+' : ''}R$ {Math.abs(selectedReceipt.amount).toLocaleString('pt-BR')},00
                </span>
              </div>

              <div className="space-y-2 pt-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Tipo de Transação:</span>
                  <span className="font-bold text-purple-200">{selectedReceipt.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Descrição:</span>
                  <span className="text-zinc-300">{selectedReceipt.subtitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Data e Hora:</span>
                  <span className="font-mono text-zinc-300">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between border-t border-purple-500/20 pt-2">
                  <span className="text-zinc-400">Autenticação Bancária:</span>
                  <span className="font-mono text-purple-300 font-bold text-[10px]">{selectedReceipt.receiptCode}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCopiedReceipt(true);
                setTimeout(() => setCopiedReceipt(false), 2000);
              }}
              className="w-full rounded-2xl bg-[#8A05BE] p-3 text-xs font-bold text-white hover:bg-[#a107dd] cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              {copiedReceipt ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
              {copiedReceipt ? 'Comprovante Copiado!' : 'Copiar Autenticação'}
            </button>
          </div>
        </div>
      )}

      {/* WEBSITE 2: CyberGame Store (High Quality E-Commerce) */}
      {currentUrl.includes('cybergame-store') && (
        <div className="rounded-3xl border border-amber-500/30 bg-[#0d0f17] p-5 sm:p-6 text-white space-y-6 shadow-2xl">
          {/* Store Navigation Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-black font-black text-xl shadow-lg shadow-amber-500/30">
                <Gamepad2 className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  CyberGame Store <span className="text-amber-400 text-xs font-mono font-bold">VIP SHOP</span>
                </h2>
                <p className="text-xs text-zinc-400">A Maior Loja de Jogos AAA, Consoles & Hardware Quântico</p>
              </div>
            </div>

            {/* Wallet & Cart Info */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-right font-mono">
                <span className="text-[10px] text-zinc-400 font-bold block">SEU SALDO NUCYBER:</span>
                <span className="text-sm font-bold text-amber-400">R$ {balance.toLocaleString('pt-BR')},00</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStoreTab('loja')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    activeStoreTab === 'loja'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-[#181c2b] text-zinc-300 hover:bg-[#22283d]'
                  }`}
                >
                  <ShoppingBag className="size-4" /> Catálogo
                </button>
                <button
                  onClick={() => setActiveStoreTab('biblioteca')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    activeStoreTab === 'biblioteca'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-[#181c2b] text-zinc-300 hover:bg-[#22283d]'
                  }`}
                >
                  <Library className="size-4" /> Minha Biblioteca ({purchasedProducts.length})
                </button>
              </div>
            </div>
          </div>

          {activeStoreTab === 'loja' && (
            <div className="space-y-6">
              {/* Featured Promo Banner */}
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-purple-950 via-amber-950 to-slate-900 p-6 sm:p-8 flex flex-col justify-between min-h-48 shadow-2xl">
                <div className="max-w-md space-y-2 z-10">
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-extrabold text-black uppercase tracking-wider">
                    Semana Cyber Gamer — Ofertas Especiais
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Descontos de até 50% em Jogos & Hardware!
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Use seus fundos do NuCyber Bank para adquirir jogos AAA, placas de vídeo e consoles com entrega digital instantânea.
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-3 z-10">
                  <span className="text-xs text-amber-300 font-mono font-bold flex items-center gap-1">
                    <Sparkles className="size-4 text-amber-400" /> Ativação Imediata via Chave Digital
                  </span>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-amber-500/10 blur-3xl pointer-events-none" />
              </div>

              {/* Filters & Search */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {['Todos', 'Jogos AAA', 'Consoles', 'Hardware', 'Periféricos'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                          : 'bg-[#141826] border border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#121624] px-3 py-1.5 text-xs text-white w-full sm:w-64">
                  <Search className="size-3.5 text-amber-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar produto ou jogo..."
                    className="w-full bg-transparent outline-none text-xs"
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const owned = inventory.includes(product.id);
                  const canAfford = balance >= product.price;

                  return (
                    <div
                      key={product.id}
                      className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all group hover:scale-[1.02] ${
                        owned
                          ? 'border-emerald-500/40 bg-[#101c18]'
                          : 'border-white/10 bg-[#121624] hover:border-amber-500/40'
                      }`}
                    >
                      {/* Product Image Box */}
                      <div className="relative aspect-video w-full overflow-hidden bg-black">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discount && (
                          <span className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-black text-white shadow-md">
                            {product.discount}
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                          {product.category}
                        </span>
                      </div>

                      {/* Product Details */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-amber-400">
                            <span className="flex items-center gap-1 font-bold">
                              <Star className="size-3.5 fill-amber-400 text-amber-400" />
                              {product.rating}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">({product.reviewsCount} avaliações)</span>
                          </div>

                          <h4 className="font-bold text-xs text-white line-clamp-1">{product.name}</h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/10 space-y-2">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-extrabold text-amber-400 font-mono">
                              R$ {product.price.toLocaleString('pt-BR')},00
                            </span>
                            {product.oldPrice && (
                              <span className="text-[10px] text-zinc-500 line-through font-mono">
                                R$ {product.oldPrice.toLocaleString('pt-BR')},00
                              </span>
                            )}
                          </div>

                          {owned ? (
                            <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 py-2 text-xs font-bold text-emerald-400">
                              <CheckCircle className="size-4" /> Adquirido na Biblioteca
                            </div>
                          ) : (
                            <button
                              onClick={() => handleBuyProduct(product)}
                              className={`w-full rounded-xl py-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                canAfford
                                  ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-md shadow-amber-500/20 active:scale-95'
                                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                              }`}
                            >
                              <ShoppingCart className="size-3.5" />
                              {canAfford ? 'Comprar Agora' : 'Saldo Insuficiente'}
                            </button>
                          )}

                          {storeFeedback && storeFeedback.id === product.id && (
                            <p className={`text-[10px] font-bold text-center mt-1 ${storeFeedback.error ? 'text-red-400' : 'text-emerald-400'}`}>
                              {storeFeedback.msg}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* User Purchased Library Tab */}
          {activeStoreTab === 'biblioteca' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <Library className="size-4" /> Seus Itens & Jogos Adquiridos ({purchasedProducts.length})
              </h3>

              {purchasedProducts.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#121624] p-8 text-center space-y-3">
                  <Gamepad2 className="size-12 text-zinc-600 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Sua biblioteca está vazia</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Hackeie o NuCyber Bank para obter R$ 250.000,00 e compre qualquer item no catálogo!
                  </p>
                  <button
                    onClick={() => setActiveStoreTab('loja')}
                    className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer"
                  >
                    Ver Catálogo da Loja
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {purchasedProducts.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl border border-emerald-500/30 bg-[#101c18] flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="size-16 rounded-xl object-cover shrink-0" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-white">{p.name}</h4>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="size-3" /> Licença Digital Válida
                        </span>
                        <p className="text-[10px] text-zinc-400 font-mono">Chave: RENANOS-{p.id.toUpperCase()}-2026</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* WEBSITE 3: Cyber Portal */}
      {currentUrl.includes('cyber-portal') && (
        <div className="rounded-2xl border border-white/10 bg-[#10131d] p-6 space-y-4">
          <h2 className="text-lg font-bold text-purple-300 flex items-center gap-2">
            <Globe className="size-5" /> Portal de Serviços RenanOS
          </h2>
          <p className="text-xs text-zinc-400">Acesse diretamente os sites e simulações do ambiente:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigateTo('matrix://bankofcyber')}
              className="p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 text-left hover:border-purple-400 transition-all cursor-pointer space-y-1"
            >
              <h4 className="font-bold text-purple-300 text-xs">🏦 NuCyber Bank (NuBank Style)</h4>
              <p className="text-[11px] text-zinc-400">Banco digital completo com área PIX, Caixinhas, Empréstimo, Cartão e Vulnerabilidade.</p>
            </button>
            <button
              onClick={() => navigateTo('matrix://cybergame-store')}
              className="p-4 rounded-2xl border border-amber-500/30 bg-amber-950/20 text-left hover:border-amber-400 transition-all cursor-pointer space-y-1"
            >
              <h4 className="font-bold text-amber-300 text-xs">🎮 CyberGame Store (E-commerce)</h4>
              <p className="text-[11px] text-zinc-400">Loja de jogos, hardware e produtos com biblioteca funcional.</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
