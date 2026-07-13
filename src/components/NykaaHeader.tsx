import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Command } from 'lucide-react';
import auraLogo from '@/assets/aura-logo.png';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Consultation', href: '#consultation' },
  { label: 'Library', href: '#library' },
  { label: 'Insights', href: '#insights' },
];

const AuraHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-border/60' : 'bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden -ml-1 p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Open menu">
                <Menu className="h-5 w-5 text-foreground" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <SheetHeader className="p-5 border-b border-border">
                <SheetTitle className="text-left flex items-center gap-2">
                  <img src={auraLogo} alt="Aura AI" className="h-7 w-7 object-contain" />
                  <span className="font-serif italic text-xl">Aura<span className="text-primary"> AI</span></span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col py-3">
                {navItems.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-foreground px-5 py-3 hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <a href="#" className="flex items-center gap-2 group">
            <div className="relative">
              <img src={auraLogo} alt="Aura AI" className="h-8 w-8 object-contain transition-transform group-hover:scale-105" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif italic text-2xl leading-none text-foreground">Aura</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-medium">AI</span>
            </div>
          </a>
        </div>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-2.5 py-1.5 hover:bg-muted transition-colors">
            <Command className="h-3 w-3" />
            <span className="font-mono">K</span>
          </button>
          <button className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-1.5">
            Sign in
          </button>
          <button className="inline-flex items-center gap-1.5 aura-gradient text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold shadow-md hover:shadow-glow transition-all">
            <Sparkles className="h-3.5 w-3.5" />
            Try Aura
          </button>
        </div>
      </div>
    </header>
  );
};

export default AuraHeader;
