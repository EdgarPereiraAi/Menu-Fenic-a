
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MenuData, Language, MenuItem, MenuCategory, Contact, CartItem } from './types';
import { INITIAL_MENU } from './data';
import { 
  Settings, X, Globe, Save, Search, 
  MapPin, Phone, Share2, MessageCircle, Facebook,
  Plus, Trash2, Edit3, Image as ImageIcon, Upload,
  ArrowUp, ArrowDown, ListOrdered, Utensils,
  ShoppingBag, Minus, User, PhoneCall, CheckCircle2,
  ChevronRight, ExternalLink
} from 'lucide-react';

const STORAGE_KEY = 'fenicia_menu_v2';

export default function App() {
  const [menu, setMenu] = useState<MenuData>(INITIAL_MENU);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState<Language>('pt');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setMenu(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveToLocal = (data: MenuData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setMenu({ ...data });
    showToast("Alterações guardadas!");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.item.id === item.id);
      if (exists) return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { item, quantity: 1 }];
    });
    showToast(`${item.name[lang]} adicionado`);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.item.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.item.id !== id));

  const total = useMemo(() => cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0), [cart]);

  // Order
  const handleCheckout = (name: string, phone: string) => {
    if (!name.trim()) return alert("Diz-nos o teu nome para o pedido.");
    const restaurantPhone = menu.contacts[0]?.value.replace(/\D/g, '') || '351281325175';
    let msg = `*🍕 NOVO PEDIDO - PIZZERIA FENICIA*\n\n`;
    msg += `👤 *Nome:* ${name}\n📞 *Tel:* ${phone}\n\n`;
    msg += `*ITENS:*\n`;
    cart.forEach(c => msg += `• ${c.quantity}x ${c.item.name[lang]} (${(c.item.price * c.quantity).toFixed(2)}€)\n`);
    msg += `\n*TOTAL: ${total.toFixed(2)}€*\n\n_Enviado via Menu Digital_`;
    window.open(`https://wa.me/${restaurantPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Filters
  const filtered = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return menu.categories
      .filter(c => !activeCategory || c.id === activeCategory)
      .map(c => ({
        ...c,
        items: c.items.filter(i => i.name[lang].toLowerCase().includes(query) || i.code.includes(query))
      }))
      .filter(c => c.items.length > 0);
  }, [menu, activeCategory, searchTerm, lang]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in border border-white/10">
          <CheckCircle2 size={16} className="text-green-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">{toast}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 sm:h-20">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.ibb.co/3ykSNDf/pizzeria-logo.jpg" className="w-10 h-10 rounded-xl border border-gray-100" />
            <h1 className="text-xl font-black tracking-tighter flex items-baseline gap-1">
              <span className="text-[#e31b23]">Pizzeria</span>
              <span className="font-serif italic">Fenicia</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {!isAdmin && (
              <button onClick={() => setIsShareModalOpen(true)} className="p-2.5 text-gray-400 hover:text-red-500"><Share2 size={20}/></button>
            )}
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`p-2.5 rounded-xl transition-all ${isAdmin ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
            >
              {isAdmin ? <X size={20}/> : <Settings size={20}/>}
            </button>
            <div className="relative group">
               <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase border border-gray-100">
                 <Globe size={14}/> {lang}
               </button>
               <div className="absolute right-0 mt-2 bg-white shadow-2xl rounded-2xl p-2 hidden group-hover:block w-32 border border-gray-100">
                 {['pt', 'en', 'fr', 'de'].map(l => (
                   <button key={l} onClick={() => setLang(l as Language)} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold mb-1 ${lang === l ? 'bg-red-500 text-white' : 'hover:bg-gray-50'}`}>{l.toUpperCase()}</button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      {!isAdmin && !searchTerm && (
        <section className="relative h-[55vh] flex items-center justify-center overflow-hidden bg-gray-900">
          <img 
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 animate-kenburns" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="relative z-10 text-center px-4 animate-fade-in">
            <span className="text-[#8cb32d] text-[10px] font-black uppercase tracking-[0.5em]">Tavira | Tradizione Italiana</span>
            <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mt-4 mb-8 font-serif italic leading-none">Pizzas com Alma</h2>
            <button 
              onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#e31b23] text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-red-700 transition-all active:scale-95"
            >
              Ver Menu Completo
            </button>
          </div>
        </section>
      )}

      {/* Content */}
      <main ref={menuRef} className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminDashboard menu={menu} lang={lang} onSave={saveToLocal} />
        ) : (
          <>
            {/* Nav & Search */}
            <div className="sticky top-16 sm:top-20 z-50 bg-white/90 backdrop-blur-md -mx-4 px-4 py-4 border-b border-gray-50 space-y-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                <input 
                  type="text" 
                  placeholder="Procura o teu sabor ou código..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-2xl mx-auto">
                <button onClick={() => setActiveCategory(null)} className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap transition-all ${!activeCategory ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}>TUDO</button>
                {menu.categories.map(c => (
                  <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap transition-all ${activeCategory === c.id ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'}`}>{c.title[lang]}</button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="mt-12 space-y-20">
              {filtered.map(cat => (
                <section key={cat.id} className="animate-fade-in">
                  <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-3xl font-black tracking-tight font-serif italic">{cat.title[lang]}</h2>
                    <div className="flex-grow h-px bg-gray-100"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {cat.items.map(item => (
                      <MenuCard key={item.id} item={item} lang={lang} onAdd={addToCart} />
                    ))}
                  </div>
                </section>
              ))}
              {filtered.length === 0 && (
                <div className="py-20 text-center opacity-30">
                  <Search size={48} className="mx-auto mb-4" />
                  <p className="font-black text-xs uppercase tracking-widest">Nenhum resultado encontrado</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="https://i.ibb.co/3ykSNDf/pizzeria-logo.jpg" className="w-16 h-16 mx-auto rounded-2xl mb-8 grayscale opacity-50" />
          <h3 className="text-2xl font-black font-serif italic mb-2">Pizzeria Fenicia</h3>
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.4em] mb-12">Artesanal & Tradicional</p>
          <div className="flex flex-wrap justify-center gap-8 mb-16 text-gray-400 text-xs">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-red-500"/> {menu.address}</span>
            <span className="flex items-center gap-2"><Phone size={14} className="text-red-500"/> {menu.contacts[0].value}</span>
          </div>
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">&copy; 2024 Pizzeria Fenicia Digital</p>
        </div>
      </footer>

      {/* Cart Button */}
      {!isAdmin && cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-[150] bg-[#e31b23] text-white p-5 rounded-full shadow-[0_15px_30px_rgba(227,27,35,0.4)] hover:scale-110 active:scale-90 transition-all pulse-red"
        >
          <div className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{cart.reduce((a,c) => a+c.quantity, 0)}</div>
          <ShoppingBag size={24} />
        </button>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <CartDrawer 
          cart={cart} 
          lang={lang} 
          total={total} 
          restaurantPhone={menu.contacts[0].value}
          onClose={() => setIsCartOpen(false)} 
          onUpdate={updateCartQty} 
          onRemove={removeFromCart} 
          onCheckout={handleCheckout} 
        />
      )}

      {/* Share Modal */}
      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
    </div>
  );
}

// Components
function MenuCard({ item, lang, onAdd }: { item: MenuItem, lang: Language, onAdd: (i: MenuItem) => void }) {
  return (
    <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 flex items-center gap-5 group relative overflow-hidden">
      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
        {item.image ? (
          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200"><Utensils size={32}/></div>
        )}
      </div>
      <div className="flex-grow min-w-0 pr-10">
        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 block">#{item.code}</span>
        <h3 className="text-sm sm:text-base font-black text-gray-900 mb-1 truncate">{item.name[lang]}</h3>
        <p className="text-[10px] text-gray-400 italic line-clamp-2 leading-tight">{item.description?.[lang] || 'O autêntico sabor da nossa cozinha.'}</p>
        <div className="mt-3">
          <span className="text-lg font-black tracking-tighter text-gray-950">{item.price.toFixed(2)}€</span>
        </div>
      </div>
      <button 
        onClick={() => onAdd(item)}
        className="absolute right-4 bottom-4 w-10 h-10 bg-gray-50 text-gray-300 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
      >
        <Plus size={20}/>
      </button>
    </div>
  );
}

function CartDrawer({ cart, lang, total, restaurantPhone, onClose, onUpdate, onRemove, onCheckout }: any) {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black font-serif italic">O Teu Carrinho</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl"><X/></button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-8 no-scrollbar">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14}/>
              <input type="text" placeholder="O Teu Nome" value={name} onChange={e => setName(e.target.value)} className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-red-500" />
            </div>
            <div className="relative">
              <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14}/>
              <input type="tel" placeholder="Contacto (Opcional)" value={tel} onChange={e => setTel(e.target.value)} className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:border-red-500" />
            </div>
          </div>
          <div className="space-y-6">
            {cart.map((c: any) => (
              <div key={c.item.id} className="flex gap-4 items-center animate-fade-in">
                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  {c.item.image && <img src={c.item.image} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-[11px] font-black truncate">{c.item.name[lang]}</h4>
                  <p className="text-[10px] font-bold text-red-500">{c.item.price.toFixed(2)}€</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
                  <button onClick={() => onUpdate(c.item.id, -1)} className="p-1 hover:text-red-500"><Minus size={14}/></button>
                  <span className="text-[10px] font-black w-4 text-center tabular-nums">{c.quantity}</span>
                  <button onClick={() => onUpdate(c.item.id, 1)} className="p-1 hover:text-red-500"><Plus size={14}/></button>
                </div>
                <button onClick={() => onRemove(c.item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total do Pedido</span>
            <span className="text-3xl font-black tracking-tighter tabular-nums">{total.toFixed(2)}€</span>
          </div>
          <button 
            onClick={() => onCheckout(name, tel)}
            className="w-full py-5 bg-[#e31b23] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-red-700 active:scale-95 transition-all"
          >
            <MessageCircle size={20}/> Finalizar no WhatsApp
          </button>
          <a href={`tel:${restaurantPhone}`} className="w-full py-5 border-2 border-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all">
            <Phone size={20}/> Ligar para a Pizzaria
          </a>
        </div>
      </div>
    </div>
  );
}

function ShareModal({ onClose }: { onClose: () => void }) {
  const url = window.location.href;
  const copy = () => { navigator.clipboard.writeText(url); alert("Copiado!"); };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xs rounded-[3rem] p-10 shadow-2xl animate-fade-in">
        <h3 className="text-center font-black text-sm uppercase tracking-widest mb-10">Partilhar Menu</h3>
        <div className="grid grid-cols-1 gap-4">
           <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Vê o menu da Pizzeria Fenicia aqui: ' + url)}`)} className="flex items-center gap-4 p-5 bg-green-50 text-green-700 rounded-2xl hover:bg-green-100 transition-all">
             <MessageCircle size={24}/> <span className="text-xs font-black uppercase">WhatsApp</span>
           </button>
           <button onClick={copy} className="flex items-center gap-4 p-5 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 transition-all">
             <Share2 size={24}/> <span className="text-xs font-black uppercase">Copiar Link</span>
           </button>
        </div>
        <button onClick={onClose} className="mt-8 w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-300">Fechar</button>
      </div>
    </div>
  );
}

// Admin Panel (Full Feature)
function AdminDashboard({ menu, lang, onSave }: { menu: MenuData, lang: Language, onSave: (d: MenuData) => void }) {
  const [localMenu, setLocalMenu] = useState(menu);
  const [editItem, setEditItem] = useState<{catId: string, item: MenuItem} | null>(null);

  const updateItem = (catId: string, item: MenuItem) => {
    const next = { ...localMenu };
    const cat = next.categories.find(c => c.id === catId);
    if (cat) {
      const idx = cat.items.findIndex(i => i.id === item.id);
      if (idx !== -1) cat.items[idx] = item;
      else cat.items.push(item);
      setLocalMenu(next);
    }
  };

  const removeItem = (catId: string, itemId: string) => {
    if (!window.confirm("Remover este item?")) return;
    const next = { ...localMenu };
    const cat = next.categories.find(c => c.id === catId);
    if (cat) {
      cat.items = cat.items.filter(i => i.id !== itemId);
      setLocalMenu(next);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black font-serif italic">Gestão do Menu</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2">DICA: Altera os preços e guarda as alterações.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => onSave(localMenu)} className="bg-green-600 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-green-700 transition-all">
            <Save size={18}/> Guardar Todas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {localMenu.categories.map(cat => (
          <section key={cat.id} className="bg-white rounded-[3rem] p-8 sm:p-12 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
              <h3 className="text-2xl font-black font-serif italic uppercase">{cat.title[lang]}</h3>
              <button 
                onClick={() => setEditItem({ catId: cat.id, item: { id: Math.random().toString(), code: '', name: {pt:'',en:'',fr:'',de:''}, price: 0 } })}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
              >
                <Plus size={20}/>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map(i => (
                <div key={i.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 shrink-0 overflow-hidden">
                    {i.image ? <img src={i.image} className="w-full h-full object-cover"/> : <Utensils size={18} className="mx-auto mt-3 text-gray-200"/>}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] font-black truncate">{i.name[lang]}</p>
                    <p className="text-xs font-black text-red-500">{i.price.toFixed(2)}€</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setEditItem({ catId: cat.id, item: i })} className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Edit3 size={16}/></button>
                    <button onClick={() => removeItem(cat.id, i.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {editItem && (
        <ItemModal 
          item={editItem.item} 
          onClose={() => setEditItem(null)} 
          onSave={(updated) => { updateItem(editItem.catId, updated); setEditItem(null); }} 
        />
      )}
    </div>
  );
}

function ItemModal({ item, onClose, onSave }: any) {
  const [form, setForm] = useState<MenuItem>(JSON.parse(JSON.stringify(item)));
  const handleUpload = (e: any) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onloadend = () => setForm({ ...form, image: r.result as string });
      r.readAsDataURL(f);
    }
  };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl animate-fade-in">
        <h3 className="text-3xl font-black font-serif italic mb-10">Editar Prato</h3>
        <div className="space-y-8">
          <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl">
            <div className="w-20 h-20 bg-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
              {form.image ? <img src={form.image} className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-200"/>}
            </div>
            <label className="flex-grow py-4 bg-white border border-dashed border-gray-300 rounded-2xl text-center cursor-pointer hover:border-red-500 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Escolher Foto</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Código</label>
              <input type="text" value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Preço (€)</label>
              <input type="number" step="0.05" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-black" />
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Nome (Português)</label>
            <input type="text" value={form.name.pt} onChange={e => setForm({...form, name: {...form.name, pt: e.target.value}})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" />
          </div>
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase text-gray-400 ml-2">Ingredientes (Português)</label>
            <textarea rows={2} value={form.description?.pt} onChange={e => setForm({...form, description: {...(form.description||{pt:'',en:'',fr:'',de:''}), pt: e.target.value}})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>
        <div className="mt-12 flex gap-4">
          <button onClick={onClose} className="flex-grow py-5 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all">Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-grow py-5 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 shadow-xl transition-all">Guardar</button>
        </div>
      </div>
    </div>
  );
}
