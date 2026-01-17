
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MenuData, Language, MenuItem, MenuCategory, Contact, CartItem } from './types';
import { INITIAL_MENU } from './data';
import { 
  Settings, X, Globe, Save, ChevronRight, 
  MapPin, Phone, Instagram, LayoutGrid, Search, 
  ArrowDown, Share2, Copy, Check, MessageCircle, Facebook,
  Plus, Trash2, Edit3, Image as ImageIcon, Upload,
  ArrowUp, ArrowDown as ArrowDownIcon, ListOrdered, Utensils,
  BookOpen, Smartphone, ShoppingBag, Minus, Send, User, PhoneCall
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'pizzeria_menu_data';

export default function App() {
  const [menu, setMenu] = useState<MenuData>(INITIAL_MENU);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState<Language>('pt');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.contacts) parsed.contacts = INITIAL_MENU.contacts;
        if (!parsed.address) parsed.address = INITIAL_MENU.address;
        setMenu(parsed);
      } catch (e) {
        console.error("Failed to parse saved menu", e);
      }
    }
  }, []);

  const saveMenu = (newMenu: MenuData) => {
    setMenu({ ...newMenu });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newMenu));
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === itemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
  const cartItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleSendOrder = (customerName: string, customerPhone: string) => {
    if (cart.length === 0) return;
    
    const restaurantPhone = menu.contacts[0]?.value.replace(/\D/g, '') || '351281325175';
    let message = `*🍕 NOVO PEDIDO - PIZZERIA FENICIA*\n\n`;
    
    message += `👤 *Cliente:* ${customerName || 'Não informado'}\n`;
    message += `📞 *Contacto:* ${customerPhone || 'Não informado'}\n\n`;
    message += `--- *ITENS* ---\n`;
    
    cart.forEach(ci => {
      message += `• ${ci.quantity}x #${ci.item.code} ${ci.item.name[lang]} (${(ci.item.price * ci.quantity).toFixed(2)}€)\n`;
    });
    
    message += `\n*Total a pagar: ${cartTotal.toFixed(2)}€*\n\n`;
    message += `_Enviado via Menu Digital Pizzeria Fenicia_`;
    
    const whatsappUrl = `https://wa.me/${restaurantPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleUpdateItem = (catId: string, updatedItem: MenuItem) => {
    const newMenu = { ...menu };
    const category = newMenu.categories.find(c => c.id === catId);
    if (category) {
      const index = category.items.findIndex(i => i.id === updatedItem.id);
      if (index !== -1) {
        category.items[index] = updatedItem;
      } else {
        category.items.push(updatedItem);
      }
    }
    saveMenu(newMenu);
  };

  const handleRemoveItem = (catId: string, itemId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este item?')) return;
    const newMenu = { ...menu };
    const category = newMenu.categories.find(c => c.id === catId);
    if (category) {
      category.items = category.items.filter(i => i.id !== itemId);
    }
    saveMenu(newMenu);
  };

  const handleReorderCategories = (newCategories: MenuCategory[]) => {
    saveMenu({ ...menu, categories: newCategories });
  };

  const handleUpdateContacts = (newContacts: Contact[]) => {
    saveMenu({ ...menu, contacts: newContacts });
  };

  const handleUpdateAddress = (newAddress: string) => {
    saveMenu({ ...menu, address: newAddress });
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pizzeria Fenicia - Menu Digital',
          text: 'Confira as nossas pizzas artesanais e massas deliciosas!',
          url: shareUrl,
        });
      } catch (err) {
        setIsShareModalOpen(true);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const filteredCategories = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return menu.categories
      .filter(cat => !activeCategory || cat.id === activeCategory)
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
          if (!normalizedSearch) return true;
          const nameMatch = Object.values(item.name).some(n => typeof n === 'string' && n.toLowerCase().includes(normalizedSearch));
          const descMatch = item.description ? Object.values(item.description).some(d => typeof d === 'string' && d.toLowerCase().includes(normalizedSearch)) : false;
          const codeMatch = item.code.toLowerCase().includes(normalizedSearch);
          return nameMatch || descMatch || codeMatch;
        })
      }))
      .filter(cat => cat.items.length > 0);
  }, [menu, activeCategory, searchTerm, lang]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-red-100 selection:text-red-900 bg-[#fdfdfd]">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden p-1">
               <img src="https://i.ibb.co/3ykSNDf/pizzeria-logo.jpg" className="w-full h-full object-contain" alt="Logo" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-2xl font-black tracking-tighter text-gray-900 leading-none flex items-baseline gap-1">
                <span className="text-[#e31b23]">Pizzeria</span>
                <span className="font-serif italic text-2xl sm:text-3xl">Fenicia</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 bg-[#8cb32d] rounded-full animate-pulse"></div>
                <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-black">Tradizione dal 1998</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            {!isAdmin && (
              <button onClick={handleShare} className="p-2 sm:p-3 bg-red-50 text-[#e31b23] rounded-2xl hover:bg-red-100 transition-all border border-red-100 flex items-center gap-2">
                <Share2 size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Partilhar</span>
              </button>
            )}
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`p-2 sm:p-3 rounded-2xl transition-all duration-500 shadow-sm ${isAdmin ? 'bg-orange-500 text-white rotate-90 scale-110' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {isAdmin ? <X size={20} /> : <Settings size={20} />}
            </button>
            <div className="relative group">
              <button className="flex items-center gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-2xl text-gray-600 hover:bg-gray-100 border border-gray-100">
                <Globe size={16} />
                <span className="text-[10px] font-black uppercase">{lang}</span>
              </button>
              <div className="absolute right-0 mt-2 bg-white shadow-2xl rounded-[2rem] border border-gray-100 p-3 hidden group-hover:block w-44 z-[60] animate-in slide-in-from-top-3">
                {(['pt', 'en', 'fr', 'de'] as Language[]).map(l => (
                  <button key={l} onClick={() => setLang(l)} className={`w-full text-left px-4 py-3 rounded-2xl text-sm mb-1 transition-all ${lang === l ? 'bg-[#e31b23] text-white font-bold' : 'hover:bg-gray-50 text-gray-600'}`}>
                    {l === 'pt' ? 'Português' : l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'Deutsch'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
      {isCartOpen && (
        <CartDrawer 
          cart={cart} 
          lang={lang} 
          total={cartTotal}
          restaurantPhone={menu.contacts[0]?.value || '+351 281 325 175'}
          onClose={() => setIsCartOpen(false)} 
          onRemove={removeFromCart}
          onUpdateQty={updateCartQuantity}
          onSendOrder={handleSendOrder}
        />
      )}

      {!isAdmin && cartItemsCount > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-8 right-8 z-[60] bg-[#e31b23] text-white p-5 rounded-full shadow-[0_20px_40px_-10px_rgba(227,27,35,0.4)] hover:scale-110 active:scale-95 transition-all animate-in zoom-in group"
        >
          <div className="absolute -top-1 -right-1 bg-gray-950 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            {cartItemsCount}
          </div>
          <ShoppingBag size={28} />
        </button>
      )}

      {!isAdmin && !searchTerm && (
        <section className="relative w-full flex flex-col items-center justify-center px-4 py-8 sm:py-16 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
            
            <div className="relative animate-in zoom-in-95 fade-in duration-1000 flex flex-col items-center w-full">
              <div className="relative z-10 w-full max-w-[550px] aspect-[4/5] sm:aspect-square bg-gray-100 rounded-[4rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden group border-[12px] border-white flex flex-col items-center">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2070" 
                    alt="Pizzeria Fenicia Premium Pizza" 
                    className="w-full h-full object-cover animate-kenburns" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
                </div>

                <div className="absolute inset-y-0 left-0 z-20 w-36 sm:w-44 p-4 flex flex-col justify-center gap-2 overflow-y-auto no-scrollbar py-12">
                    <button 
                        onClick={() => { setActiveCategory(null); scrollToMenu(); }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-[8px] sm:text-[10px] font-black tracking-widest uppercase border transition-all duration-300 ${!activeCategory ? 'bg-[#e31b23] text-white border-[#e31b23] shadow-[0_10px_20px_-5px_rgba(227,27,35,0.5)] scale-105' : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/25'}`}
                    >
                        TUDO
                    </button>
                    {menu.categories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); scrollToMenu(); }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-[8px] sm:text-[10px] font-black tracking-widest uppercase border transition-all duration-300 ${activeCategory === cat.id ? 'bg-[#e31b23] text-white border-[#e31b23] shadow-[0_10px_20px_-5px_rgba(227,27,35,0.5)] scale-105' : 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/25'}`}
                        >
                            {cat.title[lang]}
                        </button>
                    ))}
                </div>
                
                <div className="absolute top-6 right-6 z-30 flex flex-col items-end gap-3">
                   {menu.contacts.map(contact => (
                     <a 
                       key={contact.id}
                       href={`tel:${contact.value.replace(/\s+/g, '')}`}
                       className="flex items-center gap-3 px-5 py-3.5 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl border border-white/50 hover:bg-[#e31b23] hover:text-white transition-all group/contact animate-in slide-in-from-right-4 duration-500"
                     >
                       <div className="p-2 bg-red-50 rounded-lg group-hover/contact:bg-white/20 transition-colors">
                        <Phone size={14} className="text-[#e31b23] group-hover/contact:text-white" />
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-[7px] font-black uppercase tracking-[0.1em] opacity-60 leading-none mb-1">{contact.label}</span>
                         <span className="text-xs sm:text-sm font-black tracking-tighter tabular-nums">{contact.value}</span>
                       </div>
                     </a>
                   ))}
                </div>

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-6 pl-32 sm:pl-44">
                   <button 
                     onClick={scrollToMenu}
                     className="w-full max-w-[180px] px-6 py-5 bg-white text-gray-950 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-[#e31b23] hover:text-white transition-all transform hover:scale-110 active:scale-95"
                   >
                     Explorar Pratos
                   </button>
                </div>
                
                <div className="absolute bottom-8 right-8 lg:hidden group-hover:hidden transition-all duration-500">
                    <button onClick={scrollToMenu} className="p-5 bg-[#e31b23] text-white rounded-2xl shadow-2xl animate-bounce">
                        <ArrowDown size={22} />
                    </button>
                </div>

                <div className="absolute bottom-8 left-40 sm:left-48 z-20 pointer-events-none">
                    <p className="text-white/40 text-[8px] font-black uppercase tracking-[0.4em] rotate-[-90deg] origin-left">Crafting Pizza Since 1998</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main ref={menuRef} className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:py-12">
        {isAdmin ? (
          <AdminPanel 
            menu={menu} 
            lang={lang} 
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
            onReorderCategories={handleReorderCategories}
            onUpdateContacts={handleUpdateContacts}
            onUpdateAddress={handleUpdateAddress}
          />
        ) : (
          <>
            <div className="mb-8 group sticky top-[72px] sm:top-[88px] z-40 bg-[#fdfdfd]/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-gray-100/50">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input 
                  type="text"
                  placeholder="Pesquisar sabor ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-6 py-5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-red-50 focus:border-[#e31b23] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-20">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <section key={category.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="flex items-center gap-5 mb-10">
                       <h2 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight uppercase italic font-serif">{category.title[lang]}</h2>
                       <div className="flex-grow h-[2px] bg-gradient-to-r from-gray-200 to-transparent"></div>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{category.items.length} Pratos</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {category.items.map(item => (
                        <MenuItemCard key={item.id} item={item} lang={lang} onAddToCart={addToCart} />
                      ))}
                    </div>
                  </section>
                ))
              ) : (
                <div className="py-24 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gray-200" />
                  </div>
                  <h3 className="text-sm font-black text-gray-950 uppercase tracking-widest">Nada encontrado</h3>
                  <button onClick={() => {setSearchTerm(''); setActiveCategory(null);}} className="mt-8 px-10 py-4 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#e31b23] transition-colors">Ver Menu Completo</button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-950 text-white py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl p-2">
            <img src="https://i.ibb.co/3ykSNDf/pizzeria-logo.jpg" className="w-full h-full object-contain" alt="Footer Logo" />
          </div>
          <h3 className="text-3xl font-black mb-2 tracking-tight font-serif italic">Pizzeria Fenicia</h3>
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em] mb-12">Autêntica Paixão Italiana</p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {menu.contacts.map(contact => (
              <a key={contact.id} href={`tel:${contact.value}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#e31b23] transition-colors">
                    <Phone size={20} />
                </div>
                <span className="text-sm font-bold tracking-tight">{contact.value}</span>
              </a>
            ))}
            {menu.address && (
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(menu.address)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
              >
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#e31b23] transition-colors">
                      <MapPin size={20} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">{menu.address}</span>
              </a>
            )}
          </div>
          
          <div className="h-[1px] w-24 bg-gray-800 mx-auto mb-10"></div>
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} Pizzeria Fenicia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const CartDrawer: React.FC<{
  cart: CartItem[];
  lang: Language;
  total: number;
  restaurantPhone: string;
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onSendOrder: (name: string, phone: string) => void;
}> = ({ cart, lang, total, restaurantPhone, onClose, onRemove, onUpdateQty, onSendOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const restaurantTelUrl = `tel:${restaurantPhone.replace(/\s+/g, '')}`;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-gray-950 tracking-tight italic font-serif">A Tua Encomenda</h3>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Sabores Selecionados</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:text-gray-950 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
              <ShoppingBag size={64} className="mb-6" />
              <p className="font-black text-xs uppercase tracking-widest">Ainda não escolheste nada</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={16} />
                  </div>
                  <input 
                    type="text"
                    placeholder="O teu nome..."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e31b23] transition-all text-xs font-bold"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <PhoneCall size={16} />
                  </div>
                  <input 
                    type="tel"
                    placeholder="Teu número de telefone..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e31b23] transition-all text-xs font-bold"
                  />
                </div>
              </div>

              <div className="h-[1px] bg-gray-100"></div>

              <div className="space-y-6">
                {cart.map((ci) => (
                  <div key={ci.item.id} className="flex gap-4 p-4 bg-gray-50 rounded-3xl group animate-in slide-in-from-bottom-2">
                    <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm border border-white">
                      {ci.item.image ? (
                        <img src={ci.item.image} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-100">
                          <Utensils size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-sm text-gray-950 truncate pr-2">#{ci.item.code} {ci.item.name[lang]}</h4>
                        <button onClick={() => onRemove(ci.item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs font-black text-[#e31b23] mb-3">{ci.item.price.toFixed(2)}€</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm">
                          <button onClick={() => onUpdateQty(ci.item.id, -1)} className="text-gray-400 hover:text-[#e31b23] transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-black tabular-nums w-4 text-center">{ci.quantity}</span>
                          <button onClick={() => onUpdateQty(ci.item.id, 1)} className="text-gray-400 hover:text-[#e31b23] transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-black text-gray-950">{(ci.item.price * ci.quantity).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 bg-white border-t border-gray-100 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Total</span>
              <span className="text-3xl font-black text-gray-950 tracking-tighter tabular-nums">{total.toFixed(2)}€</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => onSendOrder(customerName, customerPhone)}
                className="w-full py-6 bg-[#e31b23] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:bg-red-700 transition-all active:scale-95 group"
              >
                <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
                Finalizar no WhatsApp
              </button>

              <a 
                href={restaurantTelUrl}
                className="w-full py-6 bg-white border-2 border-gray-950 text-gray-950 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95 group"
              >
                <PhoneCall size={22} className="group-hover:scale-110 transition-transform" />
                Ligar para a Pizzaria
              </a>
            </div>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mt-4">
              Pizzaria: {restaurantPhone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ShareModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xs rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-950 transition-colors"><X size={24} /></button>
        <h3 className="text-xl font-black text-gray-950 mb-10 text-center tracking-tight font-serif uppercase">Partilhar Menu</h3>
        <div className="grid grid-cols-2 gap-5 mb-10">
          <a href={`https://wa.me/?text=Pizzeria Fenicia: ${encodeURIComponent(shareUrl)}`} target="_blank" className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-gray-50 hover:bg-green-50 transition-all group">
            <MessageCircle size={32} className="text-green-500 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">WhatsApp</span>
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-gray-50 hover:bg-blue-50 transition-all group">
            <Facebook size={32} className="text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Facebook</span>
          </a>
        </div>
        <button onClick={copyToClipboard} className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${copied ? 'bg-green-500 text-white' : 'bg-gray-950 text-white hover:bg-black'}`}>
          {copied ? 'Link Copiado!' : 'Copiar Link'}
        </button>
      </div>
    </div>
  );
};

interface MenuItemCardProps {
  item: MenuItem;
  lang: Language;
  onAddToCart: (item: MenuItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, lang, onAddToCart }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(227,27,35,0.15)] hover:border-[#e31b23]/20 transition-all duration-500 flex items-center gap-6 group relative overflow-hidden hover-float">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-50 shrink-0 shadow-inner">
        {item.image ? (
          <img src={item.image} alt={item.name[lang]} className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-100">
            <Utensils size={32} className="opacity-10" />
          </div>
        )}
        <div className="absolute top-2 left-2">
           <span className="px-2 py-1 bg-black/60 backdrop-blur text-white rounded-lg text-[7px] font-black uppercase tracking-widest">#{item.code}</span>
        </div>
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="text-lg sm:text-xl font-black text-gray-950 group-hover:text-[#e31b23] transition-colors leading-tight mb-2 truncate">
          {item.name[lang]}
        </h3>
        {item.description && (
          <p className="text-[11px] sm:text-xs text-gray-400 italic line-clamp-2 leading-relaxed mb-3 pr-2">
            {item.description[lang]}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl sm:text-2xl font-black text-gray-950 group-hover:text-[#e31b23] transition-colors tracking-tighter tabular-nums">
            {item.price.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
          </span>
          <button 
            onClick={() => onAddToCart(item)}
            className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#e31b23] group-hover:text-white transition-all shadow-sm active:scale-90"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface AdminPanelProps {
  menu: MenuData;
  lang: Language;
  onUpdateItem: (catId: string, item: MenuItem) => void;
  onRemoveItem: (catId: string, itemId: string) => void;
  onReorderCategories: (newCategories: MenuCategory[]) => void;
  onUpdateContacts: (newContacts: Contact[]) => void;
  onUpdateAddress: (newAddress: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ menu, lang, onUpdateItem, onRemoveItem, onReorderCategories, onUpdateContacts, onUpdateAddress }) => {
  const [activeTab, setActiveTab] = useState(menu.categories[0]?.id || '');
  const [editingItem, setEditingItem] = useState<{ catId: string, item: MenuItem } | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [isManagingContacts, setIsManagingContacts] = useState(false);
  const selectedCategory = menu.categories.find(c => c.id === activeTab);

  const handleCreateNew = () => {
    if (!selectedCategory) return;
    const newItem: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      code: 'NEW',
      name: { pt: '', en: '', fr: '', de: '' },
      description: { pt: '', en: '', fr: '', de: '' },
      price: 0
    };
    setEditingItem({ catId: selectedCategory.id, item: newItem });
  };

  return (
    <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 pb-12 border-b border-gray-50">
        <div>
            <h2 className="text-3xl font-black text-gray-950 tracking-tight uppercase font-serif italic">Painel de Gestão</h2>
            <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.3em] mt-2">Personalize o seu Menu Digital</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setIsManagingContacts(true)} className="px-7 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 border border-blue-100 hover:bg-blue-100 transition-all"><Phone size={18} /> Info e Contactos</button>
          <button onClick={() => setIsReordering(true)} className="px-7 py-4 bg-gray-50 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 border border-gray-100 hover:bg-gray-100 transition-all"><ListOrdered size={18} /> Categorias</button>
          <button onClick={handleCreateNew} className="px-9 py-4 bg-[#e31b23] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-red-100 hover:scale-105 transition-all"><Plus size={18} /> Novo Prato</button>
        </div>
      </div>

      <nav className="flex gap-3 mb-12 p-3 bg-gray-50 rounded-[2rem] overflow-x-auto no-scrollbar border border-gray-100 shadow-inner">
        {menu.categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`px-7 py-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeTab === category.id ? 'bg-white text-[#e31b23] shadow-md border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {category.title[lang]}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {selectedCategory?.items.map(item => (
          <div key={item.id} className="p-5 bg-white rounded-[2rem] border border-gray-100 flex items-center gap-5 hover:border-orange-200 hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center border border-gray-50 shadow-inner">
              {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-200" />}
            </div>
            <div className="flex-grow overflow-hidden min-w-0">
              <p className="text-[9px] font-black text-orange-500 uppercase mb-1">#{item.code}</p>
              <h4 className="font-black text-gray-950 text-base truncate">{item.name[lang]}</h4>
              <p className="text-base font-black text-gray-700">{item.price.toFixed(2)}€</p>
            </div>
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
              <button onClick={() => setEditingItem({ catId: selectedCategory.id, item })} className="p-2.5 text-gray-400 hover:text-orange-500 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"><Edit3 size={18} /></button>
              <button onClick={() => onRemoveItem(selectedCategory.id, item.id)} className="p-2.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <ItemEditorModal 
          catId={editingItem.catId}
          item={editingItem.item}
          onSave={(item) => { onUpdateItem(editingItem.catId, item); setEditingItem(null); }}
          onClose={() => setEditingItem(null)}
        />
      )}

      {isReordering && (
        <CategoryReorderModal 
          categories={menu.categories}
          lang={lang}
          onSave={(newCategories) => { onReorderCategories(newCategories); setIsReordering(false); }}
          onClose={() => setIsReordering(false)}
        />
      )}

      {isManagingContacts && (
        <ContactManagerModal 
          contacts={menu.contacts}
          address={menu.address || ''}
          onSave={(newContacts, newAddress) => { 
            onUpdateContacts(newContacts); 
            onUpdateAddress(newAddress);
            setIsManagingContacts(false); 
          }}
          onClose={() => setIsManagingContacts(false)}
        />
      )}
    </div>
  );
};

const ContactManagerModal: React.FC<{
  contacts: Contact[];
  address: string;
  onSave: (contacts: Contact[], address: string) => void;
  onClose: () => void;
}> = ({ contacts, address, onSave, onClose }) => {
  const [list, setList] = useState([...contacts]);
  const [addr, setAddr] = useState(address);
  
  const handleAdd = () => {
    setList([...list, { id: Math.random().toString(36).substr(2, 9), label: 'Telemóvel', value: '' }]);
  };
  const handleRemove = (id: string) => {
    setList(list.filter(c => c.id !== id));
  };
  const handleUpdate = (id: string, field: keyof Contact, value: string) => {
    setList(list.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
        <h3 className="text-2xl font-black text-gray-950 mb-8 text-center tracking-tight uppercase font-serif italic">Informações e Contactos</h3>
        
        <div className="space-y-4 mb-8 overflow-y-auto custom-scrollbar pr-3">
          <div className="p-6 bg-red-50/30 rounded-[2rem] border border-red-100 shadow-sm mb-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-red-800 flex items-center gap-2 ml-2">
                <MapPin size={12} /> Localização da Pizzeria
              </label>
              <textarea 
                value={addr} 
                onChange={e => setAddr(e.target.value)}
                placeholder="Ex: Largo da Caracolinha n.8, Tavira..."
                rows={2}
                className="w-full px-5 py-4 bg-white border border-red-100 rounded-2xl text-xs font-bold outline-none focus:border-red-500 shadow-inner resize-none"
              />
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 mb-2">Números de Contacto</p>
          {list.map((contact) => (
            <div key={contact.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 relative group/row shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-2">Título (Ex: Loja)</label>
                  <input 
                    type="text" 
                    value={contact.label} 
                    onChange={e => handleUpdate(contact.id, 'label', e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold outline-none focus:border-blue-500 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 ml-2">Número</label>
                  <input 
                    type="text" 
                    value={contact.value} 
                    onChange={e => handleUpdate(contact.id, 'value', e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-black outline-none focus:border-blue-500 tabular-nums shadow-inner"
                  />
                </div>
              </div>
              <button 
                onClick={() => handleRemove(contact.id)}
                className="absolute -top-3 -right-3 p-3 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button 
            onClick={handleAdd}
            className="w-full py-5 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest"
          >
            <Plus size={18} /> Novo Contacto
          </button>
        </div>

        <div className="flex gap-5">
          <button onClick={onClose} className="flex-grow py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 rounded-[1.5rem] hover:bg-gray-100 transition-all">Cancelar</button>
          <button onClick={() => onSave(list, addr)} className="flex-grow py-5 text-[10px] font-black uppercase tracking-widest text-white bg-gray-950 rounded-[1.5rem] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-3"><Save size={18} /> Salvar Tudo</button>
        </div>
      </div>
    </div>
  );
};

const CategoryReorderModal: React.FC<{
  categories: MenuCategory[];
  lang: Language;
  onSave: (categories: MenuCategory[]) => void;
  onClose: () => void;
}> = ({ categories, lang, onSave, onClose }) => {
  const [list, setList] = useState([...categories]);
  const move = (index: number, direction: 'up' | 'down') => {
    const newList = [...list];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setList(newList);
  };
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95">
        <h3 className="text-xl font-black text-gray-950 mb-8 text-center tracking-tight uppercase font-serif italic">Ordenar Categorias</h3>
        <div className="space-y-3 mb-12">
          {list.map((cat, idx) => (
            <div key={cat.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition-all shadow-sm">
              <span className="text-xs font-black text-gray-950 uppercase">{cat.title[lang]}</span>
              <div className="flex gap-2">
                <button disabled={idx === 0} onClick={() => move(idx, 'up')} className="p-3 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-orange-500 disabled:opacity-10 transition-colors shadow-sm"><ArrowUp size={18} /></button>
                <button disabled={idx === list.length - 1} onClick={() => move(idx, 'down')} className="p-3 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-orange-500 disabled:opacity-10 transition-colors shadow-sm"><ArrowDownIcon size={18} /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-5">
          <button onClick={onClose} className="flex-grow py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Sair</button>
          <button onClick={() => onSave(list)} className="flex-grow py-5 text-[10px] font-black uppercase tracking-widest text-white bg-[#e31b23] rounded-2xl hover:bg-red-700 shadow-xl shadow-red-100 transition-all">Salvar Ordem</button>
        </div>
      </div>
    </div>
  );
};

const ItemEditorModal: React.FC<{
  catId: string;
  item: MenuItem;
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<MenuItem>(JSON.parse(JSON.stringify(item)));
  const languages: Language[] = ['pt', 'en', 'fr', 'de'];
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setFormData(prev => ({ ...prev, image: reader.result as string })); };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-lg" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-[4rem] p-10 sm:p-12 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95">
        <h3 className="text-3xl font-black text-gray-950 mb-12 tracking-tight font-serif italic uppercase">{item.code === 'NEW' ? 'Novo Prato' : 'Editar Sabor'}</h3>
        <div className="space-y-12">
          <div className="flex items-center gap-8 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 shadow-inner">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-[2rem] overflow-hidden flex items-center justify-center border-4 border-white shadow-xl shrink-0">
              {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-100" size={32} />}
            </div>
            <div className="flex-grow space-y-4">
              <label className="flex items-center justify-center gap-3 px-8 py-5 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:border-[#e31b23] hover:text-[#e31b23] transition-all shadow-sm">
                <Upload size={18} /> Carregar Imagem <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {formData.image && <button onClick={() => setFormData(p => ({ ...p, image: undefined }))} className="text-[9px] font-black uppercase text-red-500 px-3 tracking-widest hover:underline">Remover Imagem</button>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Referência</label>
              <input type="text" value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-black outline-none focus:bg-white focus:border-orange-500 transition-all shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Preço (€)</label>
              <input type="number" step="0.05" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-right outline-none focus:bg-white focus:border-orange-500 transition-all text-2xl shadow-inner" />
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8cb32d] ml-2 pb-3 border-b border-gray-50">Nomenclatura Internacional</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {languages.map(l => (
                <div key={l} className="space-y-2">
                  <span className="text-[9px] text-gray-300 font-black ml-2 uppercase">{l === 'pt' ? 'Português' : l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'Deutsch'}</span>
                  <input type="text" value={formData.name[l]} onChange={e => setFormData(p => ({ ...p, name: { ...p.name, [l]: e.target.value } }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:bg-white transition-all shadow-inner" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#8cb32d] ml-2 pb-3 border-b border-gray-50">Descrição de Ingredientes</p>
            <div className="grid grid-cols-1 gap-5">
              {languages.map(l => (
                <div key={l} className="space-y-2">
                  <span className="text-[9px] text-gray-300 font-black ml-2 uppercase">{l === 'pt' ? 'Português' : l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'Deutsch'}</span>
                  <textarea rows={1} value={formData.description?.[l] || ''} onChange={e => setFormData(p => ({ ...p, description: { ...p.description, [l]: e.target.value } }))} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium italic outline-none focus:bg-white transition-all shadow-inner" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 flex gap-6">
          <button onClick={onClose} className="flex-grow py-6 bg-gray-50 text-gray-400 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-gray-100 transition-all">Sair sem salvar</button>
          <button onClick={() => onSave(formData)} className="flex-grow py-6 bg-gray-950 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-3"><Save size={20} /> Guardar Prato</button>
        </div>
      </div>
    </div>
  );
};
