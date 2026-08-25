import { safeStorage } from './storage';

const BALANCE_KEY = 'renanos_cyber_balance';
const SAVINGS_KEY = 'renanos_cyber_savings';
const INVENTORY_KEY = 'renanos_cyber_inventory';
const BANK_HACKED_KEY = 'renanos_bank_hacked';
const TRANSACTIONS_KEY = 'renanos_cyber_transactions';

export interface BankTransaction {
  id: string;
  type: 'pix_out' | 'pix_in' | 'purchase' | 'exploit' | 'savings_in' | 'savings_out' | 'loan' | 'cdi_yield';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  receiptCode: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'Jogos AAA' | 'Consoles' | 'Hardware' | 'Periféricos';
  price: number;
  oldPrice?: number;
  discount?: string;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
  icon?: string;
  featured?: boolean;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'cyberpunk_2088',
    name: 'Cyberpunk 2088: Quantum City Edition',
    category: 'Jogos AAA',
    price: 350,
    oldPrice: 450,
    discount: '-22%',
    rating: 4.9,
    reviewsCount: 1240,
    description: 'Jogo RPG de ação futurista em mundo aberto com ray tracing em tempo real e IA hiper-realista.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'ps5_pro_cyber',
    name: 'PlayStation 5 Pro Cyber Edition + 2 Controles DualSense',
    category: 'Consoles',
    price: 4800,
    oldPrice: 5500,
    discount: '-12%',
    rating: 5.0,
    reviewsCount: 890,
    description: 'Console de última geração com SSD ultra veloz de 2TB, suporte a 8K 120FPS e acabamento neometais.',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'rtx_5090_ti',
    name: 'Placa de Vídeo NVIDIA GeForce RTX 5090 Ti 32GB GDDR7',
    category: 'Hardware',
    price: 18500,
    oldPrice: 21000,
    discount: '-11%',
    rating: 4.9,
    reviewsCount: 450,
    description: 'O ápice da performance gráfica. Renderização quântica, DLSS 4 e 24.576 CUDA Cores para jogos 8K.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'setup_gamer_desk',
    name: 'Monitor Gamer Oled 49" Curvo 240Hz 0.03ms',
    category: 'Periféricos',
    price: 8900,
    oldPrice: 10500,
    discount: '-15%',
    rating: 4.8,
    reviewsCount: 310,
    description: 'Display QD-OLED ultrawide curvo 1000R para imersão total com HDR1000 e tempo de resposta instantâneo.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'gta_vi_deluxe',
    name: 'Grand Theft Auto VI — Collector Ultimate Pack',
    category: 'Jogos AAA',
    price: 550,
    oldPrice: 600,
    discount: '-8%',
    rating: 5.0,
    reviewsCount: 3400,
    description: 'A experiência definitiva de Vice City com passe de temporada, garagens exclusivas e bônus no modo online.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 'mech_keyboard_rgb',
    name: 'Teclado Mecânico Magnético Custom RGB Hotswap',
    category: 'Periféricos',
    price: 1200,
    oldPrice: 1400,
    discount: '-14%',
    rating: 4.7,
    reviewsCount: 620,
    description: 'Switches magnéticos de efeito Hall com acionamento ajustável até 0.1mm e estrutura de alumínio CNC.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'quantum_server_node',
    name: 'Servidor Quântico Node-X (1024 Qubits)',
    category: 'Hardware',
    price: 120000,
    oldPrice: 150000,
    discount: '-20%',
    rating: 5.0,
    reviewsCount: 42,
    description: 'Supercomputador compacto para mineração de criptomoedas, renderização 3D e processamento neural.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 'hyperion_cyber_car',
    name: 'Hyperion V-12 Cyber Supercar (VIP License)',
    category: 'Consoles',
    price: 220000,
    oldPrice: 250000,
    discount: '-12%',
    rating: 5.0,
    reviewsCount: 15,
    description: 'Licença executiva para o veículo autônomo com blindagem quântica e IA tática militar integrada.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
];

const INITIAL_TRANSACTIONS: BankTransaction[] = [
  {
    id: 'tx_welcome',
    type: 'pix_in',
    title: 'Depósito Inicial de Boas-Vindas',
    subtitle: 'NuCyber Pagamentos S.A.',
    amount: 1250,
    date: 'Hoje, 08:30',
    receiptCode: 'NUC-89210-992A-2026',
  },
  {
    id: 'tx_cdi',
    type: 'cdi_yield',
    title: 'Rendimento de Caixinha CDI (100%)',
    subtitle: 'NuCyber Distribuidora de Títulos',
    amount: 14.8,
    date: 'Hoje, 06:00',
    receiptCode: 'CDI-77182-3310-2026',
  },
];

export const cyberBank = {
  getBalance(): number {
    const saved = safeStorage.getItem(BALANCE_KEY);
    if (saved) {
      const val = Number(saved);
      if (!isNaN(val)) return val;
    }
    return 1250;
  },

  getSavings(): number {
    const saved = safeStorage.getItem(SAVINGS_KEY);
    if (saved) {
      const val = Number(saved);
      if (!isNaN(val)) return val;
    }
    return 350; // Initial Caixinha balance
  },

  addSavings(amount: number): boolean {
    if (this.deductBalance(amount)) {
      const next = this.getSavings() + amount;
      safeStorage.setItem(SAVINGS_KEY, String(next));
      this.addTransaction({
        id: 'tx_' + Date.now(),
        type: 'savings_in',
        title: 'Depósito na Caixinha NuCyber',
        subtitle: 'Reserva com rendimento 100% CDI',
        amount: -amount,
        date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        receiptCode: 'CX-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      });
      this.notify();
      return true;
    }
    return false;
  },

  withdrawSavings(amount: number): boolean {
    const savings = this.getSavings();
    if (savings < amount) return false;
    safeStorage.setItem(SAVINGS_KEY, String(savings - amount));
    this.addBalance(amount);
    this.addTransaction({
      id: 'tx_' + Date.now(),
      type: 'savings_out',
      title: 'Resgate da Caixinha NuCyber',
      subtitle: 'Transferido para conta corrente',
      amount: amount,
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      receiptCode: 'CX-RES-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    });
    this.notify();
    return true;
  },

  addBalance(amount: number): number {
    const current = this.getBalance();
    const next = current + amount;
    safeStorage.setItem(BALANCE_KEY, String(next));
    this.notify();
    return next;
  },

  deductBalance(amount: number): boolean {
    const current = this.getBalance();
    if (current < amount) return false;
    const next = current - amount;
    safeStorage.setItem(BALANCE_KEY, String(next));
    this.notify();
    return true;
  },

  getTransactions(): BankTransaction[] {
    const saved = safeStorage.getItem(TRANSACTIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  },

  addTransaction(tx: BankTransaction): void {
    const list = this.getTransactions();
    list.unshift(tx);
    safeStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(list));
  },

  getInventory(): string[] {
    const saved = safeStorage.getItem(INVENTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  },

  buyItem(itemId: string, price: number): { success: boolean; message: string } {
    const inv = this.getInventory();
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (inv.includes(itemId)) {
      return { success: false, message: 'Você já possui este item em sua biblioteca!' };
    }
    if (!this.deductBalance(price)) {
      return { success: false, message: 'Saldo insuficiente! Utilize a área Pix, Empréstimo ou Hackeie o NuCyber Bank.' };
    }
    inv.push(itemId);
    safeStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));

    this.addTransaction({
      id: 'tx_buy_' + Date.now(),
      type: 'purchase',
      title: item ? item.name : 'Compra CyberGame Store',
      subtitle: 'Pagamento de E-Commerce com Saldo NuCyber',
      amount: -price,
      date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      receiptCode: 'GAME-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    });

    this.notify();
    return { success: true, message: 'Compra realizada com sucesso! O item foi adicionado à sua biblioteca.' };
  },

  isHacked(): boolean {
    return safeStorage.getItem(BANK_HACKED_KEY) === 'true';
  },

  setHacked(status = true): void {
    safeStorage.setItem(BANK_HACKED_KEY, status ? 'true' : 'false');
    if (status) {
      this.addBalance(250000);
      this.addTransaction({
        id: 'tx_hack_' + Date.now(),
        type: 'exploit',
        title: 'Transferência de Exploit SQLi (BankOfCyber Vulnerability)',
        subtitle: 'Injeção de Payload no Banco PostgreSQL',
        amount: 250000,
        date: 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        receiptCode: 'SQLi-ADMIN-EXPLOIT-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      });
    }
    this.notify();
  },

  resetSimulation(): void {
    safeStorage.setItem(BALANCE_KEY, '1250');
    safeStorage.setItem(SAVINGS_KEY, '350');
    safeStorage.setItem(INVENTORY_KEY, '[]');
    safeStorage.setItem(BANK_HACKED_KEY, 'false');
    safeStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    this.notify();
  },

  notify(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('renanos_cyber_state_changed'));
    }
  },
};
