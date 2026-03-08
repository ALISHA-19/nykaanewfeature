import { Search, ShoppingBag, Heart, MapPin, Gift, HelpCircle, Smartphone, ChevronDown, X, LogOut, User } from 'lucide-react';
import nykaaLogo from '@/assets/nykaa-logo.png';
import { useState, useRef, useEffect } from 'react';
import { useBeautyStore } from '@/store/useBeautyStore';
import { nykaaCategories, type NykaaCategory } from '@/data/mockDatabase';
import { categoryDropdowns } from '@/data/categoryData';
import { useAuth } from '@/hooks/useAuth';

const NykaaHeader = () => {
  const [searchValue, setSearchValue] = useState('');
  const [openCat, setOpenCat] = useState<NykaaCategory | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const processIntent = useBeautyStore(s => s.processIntent);
  const { user, profile, signOut } = useAuth();

  const handleSearch = () => {
    if (searchValue.trim()) {
      processIntent(searchValue);
      setSearchValue('');
    }
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenCat(null);
      }
    };
    if (openCat) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openCat]);

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      {/* Top utility bar */}
      <div className="bg-muted border-b border-border">
        <div className="container flex items-center justify-between py-1.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> Get App</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Store & Events</span>
            <span className="flex items-center gap-1"><Gift className="h-3 w-3" /> Gift Card</span>
            <span className="flex items-center gap-1"><HelpCircle className="h-3 w-3" /> Help</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex items-center gap-6 py-3">
        <img src={nykaaLogo} alt="Nykaa" className="h-10 object-contain" />

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-foreground">
          <span>Categories</span>
          <span>Brands</span>
          <span className="text-primary font-semibold">Luxe</span>
          <span>Nykaa Fashion</span>
          <span>Beauty Advice</span>
        </nav>

        <div className="flex-1 max-w-md mx-auto">
          <div className="flex items-center rounded-md border border-border bg-muted px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search on Nykaa — or type a beauty goal"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="nykaa-gradient rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Sign in
          </button>
          <Heart className="h-5 w-5 text-foreground cursor-pointer hover:text-primary transition-colors" />
          <ShoppingBag className="h-5 w-5 text-foreground cursor-pointer hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Category bar */}
      <div className="border-t border-border bg-card" ref={dropdownRef}>
        <div className="container flex items-center gap-0 overflow-x-auto">
          {nykaaCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setOpenCat(openCat === cat ? null : cat)}
              className={`text-xs font-medium whitespace-nowrap px-4 py-2.5 transition-colors border-b-2 ${
                openCat === cat
                  ? 'text-primary border-primary'
                  : 'text-foreground border-transparent hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Full-width mega dropdown */}
        {openCat && categoryDropdowns[openCat] && (
          <div className="absolute left-0 right-0 bg-card border-t border-border shadow-xl z-50 animate-fade-in">
            <div className="container py-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-foreground">{openCat}</h3>
                <button onClick={() => setOpenCat(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div
                className="grid gap-8"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(categoryDropdowns[openCat].length, 5)}, 1fr)`,
                }}
              >
                {categoryDropdowns[openCat].map(sub => (
                  <div key={sub.name}>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 pb-2 border-b border-border">
                      {sub.name}
                    </h4>
                    <ul className="space-y-2">
                      {sub.items.map(item => (
                        <li key={item}>
                          <button className="text-xs text-muted-foreground hover:text-primary hover:translate-x-0.5 transition-all w-full text-left">
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticker */}
      <div className="nykaa-ticker overflow-hidden">
        <div className="flex animate-ticker-scroll whitespace-nowrap py-1.5">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-[11px] font-semibold text-primary-foreground mx-8">
              🛒 FREE SHIPPING ON ALL ORDERS ABOVE ₹299 • SALE IS LIVE! • AI BEAUTY INTELLIGENCE ENABLED • SMART ROUTINES ACTIVE •
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default NykaaHeader;
