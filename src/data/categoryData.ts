import type { NykaaCategory } from '@/data/mockDatabase';

export interface SubCategory {
  name: string;
  items: string[];
}

export const categoryDropdowns: Record<NykaaCategory, SubCategory[]> = {
  'Makeup': [
    { name: 'Face', items: ['Foundation', 'Concealer', 'Compact', 'Primer', 'Blush', 'Bronzer', 'Highlighter', 'Contour', 'Setting Spray', 'BB & CC Cream'] },
    { name: 'Eyes', items: ['Kajal', 'Eyeliner', 'Mascara', 'Eyeshadow Palette', 'Eye Primer', 'False Eyelashes', 'Under Eye Concealer', 'Eyebrow Pencil', 'Eye Glitter'] },
    { name: 'Lips', items: ['Lipstick', 'Liquid Lipstick', 'Lip Gloss', 'Lip Liner', 'Lip Balm', 'Lip Tint', 'Lip Plumper', 'Lip Crayon'] },
    { name: 'Nails', items: ['Nail Polish', 'Nail Art', 'Gel Nail Polish', 'Nail Care', 'Nail Polish Remover', 'Press-On Nails', 'Base & Top Coat'] },
    { name: 'Makeup Accessories', items: ['Makeup Brushes', 'Beauty Blender', 'Makeup Pouches', 'Eyelash Curler', 'Sharpener', 'Mirror', 'Brush Cleanser'] },
  ],
  'Skin': [
    { name: 'Moisturizers', items: ['Face Cream', 'Face Gel', 'Night Cream', 'Face Oil', 'Face Lotion', 'Lip Balm', 'Face Mist'] },
    { name: 'Cleansers', items: ['Face Wash', 'Cleansing Balm', 'Micellar Water', 'Cleansing Oil', 'Cleansing Milk', 'Foam Cleanser'] },
    { name: 'Masks', items: ['Sheet Mask', 'Clay Mask', 'Peel-Off Mask', 'Overnight Mask', 'Under Eye Mask', 'Lip Mask'] },
    { name: 'Serums & Essences', items: ['Face Serum', 'Ampoule', 'Essence', 'Vitamin C Serum', 'Hyaluronic Acid', 'Retinol', 'Niacinamide'] },
    { name: 'Sun Care', items: ['Sunscreen', 'SPF Moisturizer', 'After-Sun Care', 'Tinted Sunscreen', 'Sunscreen Stick'] },
    { name: 'Treatments', items: ['Acne Treatment', 'Anti-Aging', 'Dark Spot Corrector', 'Exfoliator', 'Toner', 'Eye Cream'] },
  ],
  'Hair': [
    { name: 'Shampoo', items: ['Anti-Hairfall Shampoo', 'Anti-Dandruff Shampoo', 'Color-Protect Shampoo', 'Dry Shampoo', 'Sulfate-Free Shampoo', 'Clarifying Shampoo'] },
    { name: 'Conditioner', items: ['Daily Conditioner', 'Deep Conditioner', 'Leave-In Conditioner', 'Hair Mask', 'Hair Butter'] },
    { name: 'Hair Styling', items: ['Hair Spray', 'Hair Gel', 'Hair Wax', 'Mousse', 'Heat Protectant', 'Serum'] },
    { name: 'Hair Oil & Serum', items: ['Coconut Oil', 'Argan Oil', 'Hair Growth Oil', 'Onion Oil', 'Hair Serum', 'Castor Oil'] },
    { name: 'Hair Color', items: ['Permanent Color', 'Semi-Permanent Color', 'Hair Highlights', 'Root Touch-Up', 'Color Conditioner'] },
    { name: 'Hair Tools', items: ['Hair Dryer', 'Hair Straightener', 'Curling Iron', 'Hair Brushes', 'Hair Clips & Pins'] },
  ],
  'Appliances': [
    { name: 'Hair Appliances', items: ['Hair Dryer', 'Hair Straightener', 'Curling Iron', 'Crimper', 'Hot Air Brush', 'Multi-Styler'] },
    { name: 'Skin Appliances', items: ['Facial Steamer', 'Cleansing Brush', 'LED Mask', 'Microcurrent Device', 'Derma Roller', 'Massager'] },
    { name: 'Body Appliances', items: ['Epilator', 'Trimmer', 'Wax Heater', 'Electric Shaver', 'IPL Device'] },
    { name: 'Oral Care Appliances', items: ['Electric Toothbrush', 'Water Flosser'] },
  ],
  'Bath & Body': [
    { name: 'Shower', items: ['Shower Gel', 'Body Wash', 'Body Scrub', 'Loofah & Sponge', 'Bath Salt', 'Bubble Bath', 'Shower Oil'] },
    { name: 'Body Care', items: ['Body Lotion', 'Body Butter', 'Body Oil', 'Body Serum', 'Body Mist', 'Body Sunscreen'] },
    { name: 'Hand & Foot', items: ['Hand Cream', 'Foot Cream', 'Nail & Cuticle Oil', 'Hand Wash', 'Sanitizer', 'Foot Mask'] },
    { name: 'Hair Removal', items: ['Wax Strips', 'Hair Removal Cream', 'Razor', 'Epilator', 'After-Wax Care'] },
    { name: 'Deodorant', items: ['Roll-On', 'Spray Deodorant', 'Deo Stick', 'Natural Deodorant', 'Antiperspirant'] },
  ],
  'Natural': [
    { name: 'Ayurvedic', items: ['Kumkumadi Oil', 'Ubtan', 'Chandan Face Pack', 'Ayurvedic Hair Oil', 'Triphala', 'Ashwagandha'] },
    { name: 'Organic Skin', items: ['Organic Face Wash', 'Organic Moisturizer', 'Organic Serum', 'Organic Sunscreen', 'Organic Toner'] },
    { name: 'Organic Hair', items: ['Organic Shampoo', 'Organic Conditioner', 'Organic Hair Oil', 'Organic Hair Mask'] },
    { name: 'Essential Oils', items: ['Tea Tree Oil', 'Lavender Oil', 'Rosemary Oil', 'Peppermint Oil', 'Rose Oil'] },
    { name: 'Natural Body Care', items: ['Aloe Vera Gel', 'Rose Water', 'Coconut Oil', 'Shea Butter', 'Multani Mitti'] },
  ],
  'Mom & Baby': [
    { name: 'Baby Bath', items: ['Baby Wash', 'Baby Shampoo', 'Baby Soap', 'Baby Bubble Bath'] },
    { name: 'Baby Skin Care', items: ['Baby Lotion', 'Baby Oil', 'Baby Cream', 'Baby Sunscreen', 'Diaper Rash Cream'] },
    { name: 'Mom Care', items: ['Stretch Mark Cream', 'Nipple Cream', 'Maternity Belt', 'Nursing Pads', 'Body Firming Cream'] },
    { name: 'Baby Essentials', items: ['Baby Wipes', 'Diapers', 'Baby Powder', 'Baby Laundry Detergent'] },
  ],
  'Health & Wellness': [
    { name: 'Vitamins & Supplements', items: ['Biotin', 'Collagen', 'Omega-3', 'Multivitamins', 'Iron', 'Calcium', 'Vitamin D'] },
    { name: 'Weight Management', items: ['Protein Powder', 'Green Tea Extract', 'Apple Cider Vinegar', 'Meal Replacement'] },
    { name: 'Immunity', items: ['Vitamin C', 'Zinc', 'Elderberry', 'Turmeric', 'Probiotics'] },
    { name: 'Ayurvedic Wellness', items: ['Ashwagandha', 'Triphala', 'Chyawanprash', 'Giloy', 'Brahmi'] },
    { name: 'Sexual Wellness', items: ['Lubricants', 'Massage Oil', 'Wellness Supplements'] },
  ],
  'Men': [
    { name: 'Face Care', items: ['Face Wash', 'Face Moisturizer', 'Face Scrub', 'Face Mask', 'Sunscreen', 'Anti-Acne', 'Under Eye Cream'] },
    { name: 'Beard & Shaving', items: ['Beard Oil', 'Beard Wash', 'Shaving Cream', 'After Shave', 'Razor', 'Trimmer', 'Beard Balm'] },
    { name: 'Hair Care', items: ['Shampoo', 'Hair Wax', 'Hair Gel', 'Hair Cream', 'Anti-Dandruff', 'Hair Color'] },
    { name: 'Body Care', items: ['Body Wash', 'Deodorant', 'Body Lotion', 'Perfume', 'Intimate Wash'] },
  ],
  'Fragrance': [
    { name: 'Perfume', items: ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Cologne', 'Solid Perfume', 'Attar'] },
    { name: 'Body Mist', items: ['Floral Mist', 'Fruity Mist', 'Musky Mist', 'Fresh Mist'] },
    { name: 'Gift Sets', items: ['Perfume Gift Sets', 'Mini Perfume Sets', 'Luxury Gift Sets', 'Travel Sets'] },
    { name: 'By Notes', items: ['Floral', 'Woody', 'Oriental', 'Fresh', 'Citrus', 'Gourmand', 'Aquatic'] },
  ],
  'Lingerie & Accessories': [
    { name: 'Bras', items: ['T-Shirt Bra', 'Push-Up Bra', 'Sports Bra', 'Bralette', 'Strapless Bra', 'Nursing Bra'] },
    { name: 'Panties', items: ['Bikini', 'Hipster', 'Thong', 'Boyshort', 'High-Waist'] },
    { name: 'Nightwear', items: ['Pyjama Set', 'Night Dress', 'Robe', 'Shorts Set', 'Sleep Shirt'] },
    { name: 'Accessories', items: ['Hair Accessories', 'Makeup Bags', 'Face Roller', 'Gua Sha', 'Sleep Mask', 'Headband'] },
  ],
};
