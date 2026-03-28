import { useState } from 'react';
import { nykaaCategories, type NykaaCategory } from '@/data/mockDatabase';
import { useBeautyStore } from '@/store/useBeautyStore';
import ProductCard from './ProductCard';
import { ChevronDown } from 'lucide-react';

const CategoryBrowser = () => {
  const [activeCategory, setActiveCategory] = useState<NykaaCategory>('Makeup');
  const allProducts = useBeautyStore(s => s.allProducts);

  const filtered = allProducts.filter(p => p.nykaaCategory === activeCategory);

  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-4">Shop by Category</h2>

      {/* Category pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {nykaaCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${
              activeCategory === cat
                ? 'nykaa-gradient text-primary-foreground border-transparent'
                : 'bg-card text-foreground border-border hover:border-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} showGuard showSwap />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-8 text-center">No products in this category yet.</p>
      )}
    </section>
  );
};

export default CategoryBrowser;
