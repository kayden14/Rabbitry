const fs = require('fs');

let content = fs.readFileSync('src/data/products.ts', 'utf-8');

// Replace images
content = content.replace(
  /id: 'ls-005'[\s\S]*?images: \['\/images\/brown-rabbit\.jpg'\]/,
  (match) => match.replace("'/images/brown-rabbit.jpg'", "'/images/chinchilla-rabbit.jpg'")
);
content = content.replace(
  /id: 'ls-007'[\s\S]*?images: \['\/images\/brown-rabbit\.jpg'\]/,
  (match) => match.replace("'/images/brown-rabbit.jpg'", "'/images/harlequin-rabbit.jpg'")
);
content = content.replace(
  /id: 'ls-010'[\s\S]*?images: \['\/images\/baby-rabbit\.jpg'\]/,
  (match) => match.replace("'/images/baby-rabbit.jpg'", "'/images/mini-rex.jpg'")
);
content = content.replace(
  /id: 'pm-002'[\s\S]*?images: \['\/images\/smoked-rabbit\.jpg'\]/,
  (match) => match.replace("'/images/smoked-rabbit.jpg'", "'/images/frozen-rabbit-parts.jpg'")
);

// Add new live stock
const newLiveStock = `
  {
    id: 'ls-011',
    name: 'California White Breeder Doe',
    slug: 'california-white-doe',
    category: 'live-stock',
    breed: 'Californian',
    primaryUse: 'commercial-meat',
    ageMonths: 5,
    weightKg: 3.5,
    sex: 'female',
    dewormingStatus: true,
    vaccinationStatus: true,
    lineageNotes: 'Excellent maternal traits, dark points on nose and ears.',
    description: 'Robust California White doe for commercial meat production.',
    price: 19000,
    images: ['/images/white-rabbit.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-15T00:00:00Z',
    updatedAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'ls-012',
    name: 'Lionhead Fancy Companion Rabbit',
    slug: 'lionhead-companion-rabbit',
    category: 'live-stock',
    breed: 'Lionhead',
    primaryUse: 'domestic-pet',
    ageMonths: 3,
    weightKg: 1.4,
    sex: 'male',
    dewormingStatus: true,
    vaccinationStatus: true,
    lineageNotes: 'Distinctive mane, extremely docile.',
    description: 'Adorable Lionhead rabbit, perfect indoor pet with a gentle temperament.',
    price: 25000,
    images: ['/images/fluffy-rabbit.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-16T00:00:00Z',
    updatedAt: '2026-02-16T00:00:00Z',
  },
  {
    id: 'ls-013',
    name: 'Palomino Dual-Purpose Breeder Buck',
    slug: 'palomino-breeder-buck',
    category: 'live-stock',
    breed: 'Palomino',
    primaryUse: 'commercial-meat',
    ageMonths: 6,
    weightKg: 4.2,
    sex: 'male',
    dewormingStatus: true,
    vaccinationStatus: true,
    lineageNotes: 'Golden tawny coat, high heat tolerance.',
    description: 'Sturdy Palomino buck, excellent for cross-breeding in warm climates.',
    price: 21000,
    images: ['/images/brown-rabbit.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-17T00:00:00Z',
    updatedAt: '2026-02-17T00:00:00Z',
  },
  {
    id: 'ls-014',
    name: 'Checkered Giant (Papillon) Doe',
    slug: 'checkered-giant-doe',
    category: 'live-stock',
    breed: 'Checkered Giant',
    primaryUse: 'commercial-meat',
    ageMonths: 6,
    weightKg: 5.0,
    sex: 'female',
    dewormingStatus: true,
    vaccinationStatus: true,
    lineageNotes: 'Large frame, distinctive markings.',
    description: 'Large Papillon doe with high meat yield potential.',
    price: 28000,
    images: ['/images/spotted-rabbit.jpg'],
    stockStatus: 'in-stock',
    featured: true,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
`;

content = content.replace(
  /(\export const liveStockProducts: LiveStockProduct\[\] = \[)/,
  `$1${newLiveStock}`
);

// Add new meat products
const newMeat = `
  {
    id: 'pm-006',
    name: 'Traditional Spiced Rabbit Meat Kilishi',
    slug: 'spiced-rabbit-kilishi',
    category: 'processed-meat',
    meatType: 'cut-parts',
    weightKg: 0.2,
    storageState: 'dehydrated',
    pricePerKg: 15000,
    description: 'Oven-dehydrated rabbit jerky spiced with authentic northern yaji. 200g vacuum pouch.',
    price: 3000,
    images: ['/images/roasted-meat.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 'pm-007',
    name: 'Premium Coarse-Ground Minced Rabbit Meat',
    slug: 'ground-minced-rabbit-meat',
    category: 'processed-meat',
    meatType: 'cut-parts',
    weightKg: 1.0,
    storageState: 'frozen',
    pricePerKg: 5000,
    description: 'Ultra-lean ground rabbit meat for patties, meatballs, and rich sauces. 1kg frozen pack.',
    price: 5000,
    images: ['/images/fresh-meat.jpg'],
    stockStatus: 'in-stock',
    featured: true,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 'pm-008',
    name: 'Cold-Smoked Prime Rabbit Hindquarters',
    slug: 'cold-smoked-rabbit-hindquarters',
    category: 'processed-meat',
    meatType: 'cut-parts',
    weightKg: 0.8,
    storageState: 'smoked',
    pricePerKg: 6500,
    description: '4-piece pack of premium hind legs cold-smoked over hickory.',
    price: 5200,
    images: ['/images/smoked-rabbit.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
`;

content = content.replace(
  /(\export const processedMeatProducts: ProcessedMeatProduct\[\] = \[)/,
  `$1${newMeat}`
);

// Add Catering products
const newCatering = `
  {
    id: 'cat-003',
    name: 'VIP Suya Rabbit Skewers Party Platter',
    slug: 'vip-suya-rabbit-platter',
    category: 'catering',
    cateringType: 'party-platter',
    servingSize: '50 skewers (serves 20-25 guests)',
    leadTimeDays: 2,
    eventTypes: ['corporate', 'wedding', 'birthday'],
    minOrderQty: 1,
    description: '50 skewers of tender grilled rabbit with roasted onions and authentic Yaji dip.',
    price: 65000,
    images: ['/images/bbq-skewers.jpg'],
    stockStatus: 'in-stock',
    featured: true,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 'cat-004',
    name: 'Full Buffet Chafing Pan - Peppered Rabbit',
    slug: 'buffet-pan-peppered-rabbit',
    category: 'catering',
    cateringType: 'buffet-tray',
    servingSize: 'Serves 25-30 guests',
    leadTimeDays: 3,
    eventTypes: ['wedding', 'corporate', 'burial'],
    minOrderQty: 1,
    description: 'Slow-simmered peppered rabbit in a full buffet chafing pan.',
    price: 85000,
    images: ['/images/dressed-meat.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
`;

content = content.replace(
  /(\export const cateringProducts: CateringProduct\[\] = \[)/,
  `$1${newCatering}`
);

// Add By-products
const newByProducts = `
  {
    id: 'bp-004',
    name: 'Steamed Rabbit Bone Meal Organic Soil Amendment',
    slug: 'steamed-rabbit-bone-meal',
    category: 'by-products',
    byProductType: 'bone-meal',
    weightKg: 10,
    applicationGuide: 'Mix 1 cup per square foot of soil before planting.',
    description: 'Pure phosphorus and calcium from steamed rabbit bones for strong root growth and fruiting.',
    price: 12000,
    images: ['/images/manure-compost.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 'bp-005',
    name: 'Compost Tea Infusion Filter Bags',
    slug: 'compost-tea-infusion-bags',
    category: 'by-products',
    byProductType: 'compost-tea',
    weightKg: 2.5,
    applicationGuide: 'Steep one 500g bag in 20 liters of water for 48 hours for liquid feed.',
    description: 'Pack of 5 large brew bags filled with premium aged rabbit manure for compost tea.',
    price: 4500,
    images: ['/images/farm-fertilizer.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
`;

content = content.replace(
  /(\export const byProducts: ByProductItem\[\] = \[)/,
  `$1${newByProducts}`
);

// Add Equipment
const newEquipment = `
  {
    id: 'eq-005',
    name: 'Heavy Galvanized Drop-In Nesting Box',
    slug: 'galvanized-nesting-box',
    category: 'equipment',
    equipmentType: 'nesting-box',
    dimensionsLWH: '45cm x 25cm x 25cm',
    rabbitCapacity: 1,
    materialSpec: 'Galvanized steel with perforated drainage floor.',
    description: 'Secure drop-in nesting box for breeding does to safely raise litters.',
    price: 8500,
    images: ['/images/rabbit-cages.jpg'],
    stockStatus: 'in-stock',
    featured: false,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
  {
    id: 'eq-006',
    name: 'Digital Hanging Farm Scale (50kg)',
    slug: 'digital-hanging-farm-scale',
    category: 'equipment',
    equipmentType: 'farm-scale',
    rabbitCapacity: 1,
    materialSpec: 'ABS plastic casing with stainless steel hook.',
    description: 'Precision digital hanging scale for monitoring livestock growth rates.',
    price: 18000,
    images: ['/images/dispatch-crate.jpg'],
    stockStatus: 'in-stock',
    featured: true,
    createdAt: '2026-02-18T00:00:00Z',
    updatedAt: '2026-02-18T00:00:00Z',
  },
`;

content = content.replace(
  /(\export const equipmentProducts: EquipmentProduct\[\] = \[)/,
  `$1${newEquipment}`
);

fs.writeFileSync('src/data/products.ts', content, 'utf-8');
console.log('Products updated successfully!');
