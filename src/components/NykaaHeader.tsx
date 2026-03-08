import { Search, ShoppingBag, User, Heart, MapPin, Gift, HelpCircle, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useBeautyStore } from '@/store/useBeautyStore';
import { nykaaCategories, type NykaaCategory } from '@/data/mockDatabase';
import { categoryDropdowns } from '@/data/categoryData';

const NykaaHeader = () => {
  const [searchValue, setSearchValue] = useState('');
  const [hoveredCat, setHoveredCat] = useState<NykaaCategory | null>(null);
  const processIntent = useBeautyStore(s => s.processIntent);

  const handleSearch = () => {
    if (searchValue.trim()) {
      processIntent(searchValue);
      setSearchValue('');
    }
  };

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
        <h1 className="text-2xl font-extrabold tracking-tight text-primary">
          nykaa
        </h1>

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

      {/* Category bar with mega-menu */}
      <div className="border-t border-border bg-card relative">
        <div className="container flex items-center gap-0 overflow-x-auto">
          {nykaaCategories.map(cat => (
            <div
              key={cat}
              className="relative"
              onMouseEnter={() => setHoveredCat(cat)}
              onMouseLeave={() => setHoveredCat(null)}
            >
              <button
                className={`text-xs font-medium whitespace-nowrap px-4 py-2.5 transition-colors border-b-2 ${
                  hoveredCat === cat
                    ? 'text-primary border-primary'
                    : 'text-foreground border-transparent hover:text-primary'
                }`}
              >
                {cat}
              </button>

              {/* Mega dropdown */}
              {hoveredCat === cat && categoryDropdowns[cat] && (
                <div
                  className="absolute left-0 top-full w-[600px] max-w-[90vw] bg-card border border-border rounded-b-xl shadow-lg z-50 p-5 grid gap-6 animate-fade-in"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(categoryDropdowns[cat].length, 3)}, 1fr)`,
                  }}
                  onMouseEnter={() => setHoveredCat(cat)}
                  onMouseLeave={() => setHoveredCat(null)}
                >
                  {categoryDropdowns[cat].map(sub => (
                    <div key={sub.name}>
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{sub.name}</h4>
                      <ul className="space-y-1.5">
                        {sub.items.map(item => (
                          <li key={item}>
                            <button className="text-xs text-muted-foreground hover:text-primary transition-colors w-full text-left">
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
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
