import { useState } from 'react';
import { nykaaCategories, type NykaaCategory } from '@/data/mockDatabase';
import { useBeautyStore } from '@/store/useBeautyStore';
import ProductCard from './ProductCard';

const CategoryBrowser = () => {
  const [activeCategory, setActiveCategory] = useState<NykaaCategory>('Skin');
  const allProducts = useBeautyStore(s => s.allProducts);

  const filtered = allProducts.filter(p => p.nykaaCategory === activeCategory);

  return (
    <div>
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {nykaaCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium transition-all border ${
              activeCategory === cat
                ? 'aura-gradient text-primary-foreground border-transparent shadow-md'
                : 'bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary-soft/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} showGuard showSwap />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-12 text-center">I haven't curated products in this category yet.</p>
      )}
    </div>
  );
};

export default CategoryBrowser;
