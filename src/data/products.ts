import { Product, ContactInfo } from '../types';
import { getAssetUrl } from '../utils/assetPath';
import { savePersistentImage, removePersistentImage, STORAGE_KEYS } from '../utils/imageStorage';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'fd-01',
    name: 'FD-Moist Moisturizer',
    subtitle: 'Almond Oil + Vitamin E + Honey Extract • 100 ml',
    shortDescription: 'Deep dermal moisturization restoring natural hydration and cellular softness.',
    fullDescription: 'Formulated with cold-expressed Almond Oil, Vitamin E, and organic Honey Extract. Delivers long-lasting moisture barrier reinforcement, soothes dermal micro-inflammation, and leaves skin smooth and non-greasy. 100% paraben-free formulation tailored for all skin types.',
    keyBenefits: [
      'Deep Trans-Epidermal Moisturization',
      'Nourishes, Hydrates & Rejuvenates',
      'Enriched with Almond Oil & Vitamin E',
      'Paraben-Free • Suitable for All Skin Types'
    ],
    ingredients: ['Almond Oil', 'Vitamin E (Tocopheryl Acetate)', 'Honey Extract', 'Purified Water', 'Cetyl Alcohol', 'Glycerin'],
    usage: 'Apply liberally over cleansed face and body morning and evening, massaging in gentle upward circular motions until fully absorbed.',
    image: getAssetUrl('/products/permanent/fd-01.png'),
    secondaryImage: getAssetUrl('/products/permanent/fd-01_catalog.webp'),
    volume: '100 ml',
    category: 'Moisturizers',
    rating: 4.9,
    reviewCount: 128
  },
  {
    id: 'fd-02',
    name: 'FD-Shield Sunscreen Spray',
    subtitle: 'SPF 50+ PA+++ UVA & UVB Protection • 100 ml',
    shortDescription: '24-hour broad spectrum photoprotection mist with oil-control repair.',
    fullDescription: 'Advanced daily broad-spectrum sun mist delivering SPF 50+ PA+++ protection against damaging UVA and UVB radiation. Engineered for sun-intolerant and sensitive skin with 24-hour oil-control repair technology. Lightweight, invisible finish with zero white cast.',
    keyBenefits: [
      'SPF 50+ PA+++ Broad Spectrum Protection',
      '24-Hour Continuous Oil Control Repair',
      'Lightweight, Non-Greasy Invisible Mist',
      'Suitable for Sun-Intolerant & Sensitive Skin'
    ],
    ingredients: ['Avobenzone', 'Octinoxate', 'Zinc Oxide', 'Niacinamide', 'Aloe Vera Extract', 'Silica Silylate'],
    usage: 'Shake well before use. Hold 15 cm from skin and spray evenly across face and neck 15 minutes before sun exposure. Reapply every 2 hours during direct outdoor exposure.',
    image: getAssetUrl('/products/permanent/fd-02.png'),
    secondaryImage: getAssetUrl('/products/permanent/fd-02_catalog.webp'),
    volume: '100 ml',
    category: 'Sun Protection',
    rating: 5.0,
    reviewCount: 214
  },
  {
    id: 'fd-03',
    name: 'Biosel Anti Hairfall & Anti Dandruff Shampoo',
    subtitle: 'Clinical Scalp Therapy & Root Reinforcement • 200 ml',
    shortDescription: 'Dual-action clinical formula eliminating persistent dandruff and strengthening follicles.',
    fullDescription: 'Biosel combines powerful anti-fungal agents with follicle-nourishing bio-actives to rapidly eradicate dandruff flakes, soothe itchy and inflamed scalps, and strengthen hair roots against premature shedding. Promotes optimal scalp microbiome balance for thicker, resilient hair.',
    keyBenefits: [
      'Rapidly Clears Stubborn Dandruff & Scalp Flakes',
      'Strengthens Hair Roots to Reduce Breakage & Fall',
      'Relieves Scalp Itchiness & Inflammation',
      'Balances Dermal Scalp Microbiome'
    ],
    ingredients: ['Ketoconazole 1%', 'Zinc Pyrithione (ZPTO)', 'Botanical Follicle Actives', 'Pro-Vitamin B5', 'Aloe Vera'],
    usage: 'Wet hair thoroughly, massage generously into scalp and hair roots. Leave on for 3 to 5 minutes to activate bio-actives, then rinse cleanly. Use 2-3 times weekly.',
    image: getAssetUrl('/products/permanent/fd-03.jpg'),
    secondaryImage: getAssetUrl('/products/permanent/fd-03_catalog.webp'),
    volume: '200 ml',
    category: 'Hair & Scalp Care',
    rating: 4.9,
    reviewCount: 340
  },
  {
    id: 'fd-04',
    name: 'FD-Grow Hair Serum',
    subtitle: 'Anti-Frizz Serum with Argan Oil & Vitamin E • 50 ml',
    shortDescription: 'Restorative high-gloss serum providing thermal protection and instant frizz control.',
    fullDescription: 'Enriched with premium Moroccan Argan oil and pure Vitamin E. Deeply coats hair shafts to defend against thermal heat, environmental pollutants, and humidity-induced frizz. Transforms dry, brittle tresses into high-gloss, silky-smooth hair without weight or greasy residue.',
    keyBenefits: [
      'Deep Thermal Damage Protection with Vitamin E',
      'Instant Frizz Elimination for All Hair Types',
      'Infused with Pure Moroccan Argan Oil',
      'Delivers Silky-Smooth High Gloss Sheen'
    ],
    ingredients: ['Argania Spinosa Kernel (Argan) Oil', 'Tocopheryl Acetate (Vitamin E)', 'Cyclopentasiloxane', 'Dimethiconol', 'Fragrance'],
    usage: 'Dispense 2-3 drops into palms, rub together, and distribute evenly through towel-dried or dry hair from mid-lengths to ends. Do not rinse.',
    image: getAssetUrl('/products/permanent/fd-04.png'),
    secondaryImage: getAssetUrl('/products/permanent/fd-04_catalog.webp'),
    volume: '50 ml',
    category: 'Hair Care',
    rating: 4.8,
    reviewCount: 185
  },
  {
    id: 'fd-05',
    name: 'FD-Moist Skin Bar',
    subtitle: 'Skin Toning & Moisturising Cleansing Bar • 75 gm',
    shortDescription: 'Syndet skin bar enriched with Vitamin E and natural botanical emollients.',
    fullDescription: 'A premium syndet cleansing bar formulated to respect your skin\'s natural acid mantle. Enriched with Vitamin E and natural moisturizers, it gently cleanses away impurities while toning and hydrating epidermal tissue. Leaves skin supple, radiant, and free of tightness.',
    keyBenefits: [
      'Gentle Non-Stripping Cleansing & Skin Toning',
      'Enriched with Vitamin E & Natural Moisturiser',
      'Preserves the Acid Mantle Moisture Barrier',
      'Dermatologist Tested for Daily Face & Body Use'
    ],
    ingredients: ['Syndet Base', 'Vitamin E Acetate', 'Glycerin', 'Shea Butter', 'Titanium Dioxide', 'Mineral Moisturizers'],
    usage: 'Lather between wet palms, gently apply over damp skin in circular motions, and rinse with lukewarm water. Suitable for daily face and body use.',
    image: getAssetUrl('/products/permanent/product-05.jpg'),
    secondaryImage: getAssetUrl('/products/permanent/fd-05_catalog.webp'),
    volume: '75 gm',
    category: 'Cleansing Bars',
    rating: 4.9,
    reviewCount: 96
  },
  {
    id: 'fd-06',
    name: 'FD-Kez Bar',
    subtitle: 'Ketoconazole Bar with Glycerin, ZPTO & Aloevera • 75 gm',
    shortDescription: 'Medicated therapeutic bar for fungal skin infections, itch, and dermal flaking.',
    fullDescription: 'FD-Kez Bar is an advanced medicated dermatological formulation featuring Ketoconazole and Zinc Pyrithione (ZPTO) in a soothing base of Glycerin and Aloevera. Highly effective against cutaneous fungal conditions, tinea versicolor, pityriasis, and severe dermal flaking.',
    keyBenefits: [
      'Clinically Proven Ketoconazole Anti-Fungal Therapy',
      'Reinforced with Zinc Pyrithione (ZPTO)',
      'Calming Aloevera & Deep Glycerin Hydration',
      'Eliminates Stubborn Dermal Itching & Flakes'
    ],
    ingredients: ['Ketoconazole 1% w/w', 'Zinc Pyrithione 1% w/w', 'Aloevera Extract', 'Glycerin', 'Syndet Cleansing Soap Base'],
    usage: 'Work into a rich lather with lukewarm water, gently apply to affected skin areas, allow to remain on skin for 2 minutes, then rinse completely.',
    image: getAssetUrl('/products/permanent/product-06.jpg'),
    secondaryImage: getAssetUrl('/products/permanent/fd-06_catalog.webp'),
    volume: '75 gm',
    category: 'Medicated Cleansing',
    rating: 4.9,
    reviewCount: 162
  },
  {
    id: 'fd-07',
    name: 'ProtecSun Sunscreen Cream',
    subtitle: 'SPF 50 High Protection Sunscreen Cream • 60 gm',
    shortDescription: 'High-performance SPF 50 daily photoprotection cream with invisible finish.',
    fullDescription: 'ProtecSun SPF 50 delivers ultimate photostable broad-spectrum protection shielding delicate skin from photo-aging, hyperpigmentation, and sunburn. Formulated with lightweight micro-absorbent lipids that integrate seamlessly into all complexions with zero chalky residue.',
    keyBenefits: [
      'SPF 50 High Broad-Spectrum Photoprotection',
      'Zero White Cast & Invisible Matte Finish',
      'Non-Comedogenic & Featherlight Texture',
      'Guards Against Melasma & Premature Photo-Aging'
    ],
    ingredients: ['Octyl Methoxycinnamate', 'Titanium Dioxide (Micro-fine)', 'Oxybenzone', 'Tocopheryl Acetate', 'Purified Aqua Base'],
    usage: 'Apply generously to face, neck, and all sun-exposed skin 20 minutes prior to outdoor exposure. Reapply after swimming or heavy perspiration.',
    image: getAssetUrl('/products/permanent/fd-07.png'),
    secondaryImage: getAssetUrl('/products/permanent/fd-07_catalog.webp'),
    volume: '60 gm',
    category: 'Sun Protection',
    rating: 4.8,
    reviewCount: 145
  },
  {
    id: 'fd-08',
    name: 'FD-Tone Cream',
    subtitle: 'L-Glutathione, Tranexamic Acid & Alpha Arbutin • 30 gm',
    shortDescription: 'Clinical depigmentation and multi-active tone correcting complex.',
    fullDescription: 'Advanced dermatological tone-correcting formula targeting hyperpigmentation, stubborn melasma, sun spots, and post-inflammatory marks. Synergizes pure L-Glutathione, Tranexamic Acid, Kojic Dipalmitate, and Alpha Arbutin to inhibit tyrosinase activity and restore uniform luminosity.',
    keyBenefits: [
      'Multi-Active Clinical Tone-Correcting Complex',
      'L-Glutathione & Tranexamic Acid Synergistic Action',
      'Kojic Dipalmitate & Alpha Arbutin Pigment Inhibitors',
      'Visibly Diminishes Dark Spots & Promotes Radiance'
    ],
    ingredients: ['L-Glutathione', 'Tranexamic Acid', 'Kojic Dipalmitate', 'Alpha Arbutin', 'Niacinamide', 'Allantoin'],
    usage: 'Cleanse face thoroughly. Apply a pea-sized amount directly onto pigmented areas or across the entire face in the evening before heavier moisturizers.',
    image: getAssetUrl('/products/permanent/fd-08.png'),
    secondaryImage: getAssetUrl('/products/permanent/fd-08_catalog.webp'),
    volume: '30 gm',
    category: 'Tone Correcting',
    rating: 5.0,
    reviewCount: 280
  },
  {
    id: 'fd-09',
    name: 'FD-Glow Face Serum',
    subtitle: '10% Niacinamide + Zinc PCA + Alpha Arbutin • 30 ml',
    shortDescription: 'Concentrated clarifying serum fading acne marks and refining enlarged pores.',
    fullDescription: 'FD-Glow is a high-potency clinical face serum combining 10% pure Niacinamide (Vitamin B3) with Zinc PCA and Alpha Arbutin. Regulates sebum hyper-secretion, shrinks enlarged epidermal pores, fades stubborn blemish marks, and restores a refined, translucent skin texture.',
    keyBenefits: [
      '10% Niacinamide (Vitamin B3) Active Complex',
      'Zinc PCA Sebum Regulator & Blemish Shield',
      'Alpha Arbutin Clarifying & Post-Acne Mark Defense',
      'Clinically Refines Skin Pore Texture & Clarity'
    ],
    ingredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Alpha Arbutin 2%', 'Sodium Hyaluronate', 'Green Leaf Botanical Complex'],
    usage: 'Apply 3-4 drops onto cleansed facial skin morning and evening. Gently press into skin until fully absorbed before following with moisturizer.',
    image: getAssetUrl('/products/permanent/fd-09.jpg'),
    secondaryImage: getAssetUrl('/products/permanent/fd-09_catalog.webp'),
    volume: '30 ml',
    category: 'Targeted Serums',
    rating: 4.9,
    reviewCount: 310
  },
  {
    id: 'fd-10',
    name: 'FD-Shield Face Wash',
    subtitle: 'Anti-Acne Foaming Cleanser for Acne & Oily Skin • 100 ml',
    shortDescription: 'Purifying foaming cleanser with Salicylic Acid and Glycolic Acid for congested skin.',
    fullDescription: 'A specialized medical cleanser formulated specifically for acne-prone and oily skin types. Micro-foaming Salicylic Acid (BHA) penetrates deep into pores to dissolve hardened sebum plugs, while Glycolic Acid (AHA) exfoliates dead surface cells to prevent new breakouts from forming.',
    keyBenefits: [
      'Salicylic Acid & Glycolic Acid Deep Pore Exfoliation',
      'Eliminates Excess Oil, Dirt & Microbial Build-Up',
      'Active Blemish Control & Blackhead Dissolution',
      'Non-Drying Foaming Formula Balances Dermal Sebum'
    ],
    ingredients: ['Salicylic Acid 2%', 'Glycolic Acid 1%', 'Tea Tree Leaf Oil', 'Aloe Barbadensis Leaf Juice', 'Mild Surfactant Base'],
    usage: 'Dispense a coin-sized amount onto wet hands, work into a rich foam, and massage gently across face in circular motions for 60 seconds. Rinse cleanly with cool water.',
    image: getAssetUrl('/products/permanent/fd-10.png'),
    secondaryImage: getAssetUrl('/products/permanent/fd-10_catalog.webp'),
    volume: '100 ml',
    category: 'Cleansers',
    rating: 4.9,
    reviewCount: 245
  },
  {
    id: 'fd-11',
    name: 'FD-Tone Tablets',
    subtitle: 'L-Glutathione & Grape Seed Dietary Supplement • 30 Tablets',
    shortDescription: 'Nutricosmetic oral supplement promoting systemic cellular antioxidant brightness.',
    fullDescription: 'A premium dietary supplement designed to nourish skin luminosity from within. Combines medical-grade L-Glutathione with L-Arginine, Grape Seed Extract, Alpha Lipoic Acid, and Licorice Extract to neutralize free radical oxidation and support systemic dermal brightening.',
    keyBenefits: [
      'Pure L-Glutathione for Cellular Antioxidant Defense',
      'Grape Seed Extract & Alpha Lipoic Acid Synergy',
      'Supports Systemic Skin Radiance from Within',
      'Reinforces Collagen Matrix & Cellular Elasticity'
    ],
    ingredients: ['L-Glutathione (500mg)', 'L-Arginine', 'Grape Seed Extract', 'Alpha Lipoic Acid', 'Licorice Extract', 'Multivitamins (C & E)'],
    usage: 'Take 1 tablet daily with water after breakfast or as directed by your healthcare specialist. Consistent 3-month regimen recommended for optimal results.',
    image: getAssetUrl('/products/permanent/fd-11.jpg'),
    secondaryImage: getAssetUrl('/products/permanent/fd-11_catalog.webp'),
    volume: '30 Tablets',
    category: 'Nutricosmetics',
    rating: 4.9,
    reviewCount: 190
  },
  {
    id: 'fd-12',
    name: 'Coco Magic Extra Virgin Coconut Oil',
    subtitle: 'Cold Pressed 100% Pure Botanical Oil • 150 ml',
    shortDescription: 'ISO-certified cold-pressed virgin coconut oil for hair, scalp, and skin barrier nourishment.',
    fullDescription: 'Coco Magic is cold-pressed from fresh organic coconut meat under strict ISO 22000-2005 food-safety standards. Rich in Lauric Acid and medium-chain triglycerides, it acts as an intensive nourishing emollient for hair shafts, scalp barrier conditioning, and dry body skin.',
    keyBenefits: [
      '100% Pure Extra Virgin Cold-Pressed Botanical Grade',
      'ISO 22000-2005 Certified Manufacturing Purity',
      'Intensive Hair Conditioning & Scalp Barrier Nourishment',
      'Rich in Essential Medium-Chain Fatty Acids & Lauric Acid'
    ],
    ingredients: ['100% Pure Cold Pressed Extra Virgin Coconut Oil (Cocos Nucifera)'],
    usage: 'Warm a small amount between palms. For hair: apply as a pre-wash mask from root to tip for 30 minutes. For skin: massage into dry patches post-shower.',
    image: getAssetUrl('/products/permanent/fd-12.jpg'),
    secondaryImage: getAssetUrl('/products/permanent/fd-12_catalog.webp'),
    volume: '150 ml',
    category: 'Botanical Oils',
    rating: 5.0,
    reviewCount: 420
  },
  {
    id: 'fd-13',
    name: 'Pureza Facial Toner',
    subtitle: 'With Hyaluronic Acid Deep Moisture Lock • 100 ml',
    shortDescription: 'Deep hydration barrier support mist plumping skin with multi-weight Hyaluronic Acid.',
    fullDescription: 'Pureza Facial Toner delivers an immediate surge of biocompatible hydration. Infused with multi-molecular Hyaluronic Acid and skin-plumping marine osmolytes, it balances skin pH after cleansing, locks in moisture, and primes the dermal canvas for subsequent serums and treatments.',
    keyBenefits: [
      'Multi-Molecular Hyaluronic Acid Deep Moisture Lock',
      'Restores Natural Skin pH & Dermal Moisture Barrier',
      'Instant Skin Plumping & Dewy Radiance',
      'Daily AM & PM Essential for All Complexion Types'
    ],
    ingredients: ['Hyaluronic Acid (Multi-weight)', 'Glycerin', 'Witch Hazel Extract', 'Panthenol (Pro-Vitamin B5)', 'Allantoin', 'Aqua'],
    usage: 'After cleansing, mist directly over face and neck with eyes closed, or apply with a cotton pad. Gently pat until absorbed before applying serum.',
    image: getAssetUrl('/products/permanent/fd-13.webp'),
    secondaryImage: getAssetUrl('/products/permanent/fd-13_catalog.webp'),
    volume: '100 ml',
    category: 'Toners & Mists',
    rating: 4.9,
    reviewCount: 175
  }
];

export const BRAND_CONTACT: ContactInfo = {
  address: 'Maharajgunj-3, Kathmandu, Nepal',
  mapsUrl: 'https://goo.gl/maps/LqhsQdK3TWS9HZif6?g_st=aw',
  phone: '+977 970 449 1600',
  phoneRaw: '+9779704491600',
  email: 'info@myfacedema.com',
  whatsapp: '+977 970 449 1600',
  whatsappRaw: '9779704491600',
  hours: 'Sunday – Friday: 9:00 AM – 7:00 PM NPT'
};

const STORAGE_KEY = 'facederma_custom_products_v7_luxury13';

/**
 * Intelligent file-to-product mapping for bulk drag-and-drop of the 13 uploaded images & catalogs
 */
export function matchUploadedFileToProductId(filename: string): string | null {
  const name = filename.toLowerCase().replace(/[-_.\s]+/g, ' ');
  
  // 1. Direct FD-code checks (e.g. "fd 01", "fd01", "fd 1")
  for (let i = 1; i <= 13; i++) {
    const num2 = String(i).padStart(2, '0');
    const num1 = String(i);
    const regex = new RegExp(`(^|\\D)(fd\\s*0?${num1}|product\\s*0?${num1}|item\\s*0?${num1}|catalog\\s*0?${num1})(\\D|$)`, 'i');
    if (regex.test(name)) {
      return `fd-${num2}`;
    }
  }

  // 2. Pure number filename check (e.g. "1.jpg", "01.jpg", "1 13.jpg")
  for (let i = 1; i <= 13; i++) {
    const num2 = String(i).padStart(2, '0');
    const num1 = String(i);
    const pureNumRegex = new RegExp(`(^|\\s)(0?${num1})(\\s|$)`, 'i');
    if (pureNumRegex.test(name)) {
      return `fd-${num2}`;
    }
  }

  // 3. Keyword based matching
  if (name.includes('moist') && (name.includes('bar') || name.includes('skin bar') || name.includes('soap'))) {
    return 'fd-05'; // FD-Moist Skin Bar
  }
  if (name.includes('moist') || name.includes('moisturizer')) {
    return 'fd-01'; // FD-Moist Moisturizer
  }
  if (name.includes('shield') && (name.includes('spray') || name.includes('sun screen') || name.includes('sunscreen spray') || name.includes('spf 50'))) {
    return 'fd-02'; // FD-Shield Sunscreen Spray
  }
  if (name.includes('biosel') || name.includes('shampoo') || (name.includes('hairfall') && !name.includes('grow')) || name.includes('dandruff') || (name.includes('ketoconazole') && (name.includes('shampoo') || name.includes('wash') || name.includes('hair')))) {
    return 'fd-03'; // Biosel Anti Hairfall & Dandruff Shampoo
  }
  if (name.includes('grow') || (name.includes('hair') && name.includes('serum')) || name.includes('argan')) {
    return 'fd-04'; // FD-Grow Hair Serum
  }
  if (name.includes('kez') || (name.includes('ketoconazole') && (name.includes('bar') || name.includes('soap') || !name.includes('shampoo'))) || name.includes('zepto')) {
    return 'fd-06'; // FD-Kez Bar
  }
  if (name.includes('protecsun') || name.includes('protec sun') || (name.includes('sunscreen') && name.includes('cream'))) {
    return 'fd-07'; // ProtecSun Sunscreen Cream
  }
  if (name.includes('tone') && (name.includes('cream') || name.includes('crean') || name.includes('brightening') || name.includes('radiance'))) {
    return 'fd-08'; // FD-Tone Cream
  }
  if (name.includes('glow') || name.includes('niacinamide') || (name.includes('face serum') && !name.includes('hair'))) {
    return 'fd-09'; // FD-Glow Face Serum
  }
  if (name.includes('wash') || name.includes('facewash') || (name.includes('shield') && name.includes('face wash')) || name.includes('foaming')) {
    return 'fd-10'; // FD-Shield Face Wash
  }
  if (name.includes('tablet') || name.includes('tablets') || (name.includes('tone') && name.includes('tablet')) || name.includes('capsule')) {
    return 'fd-11'; // FD-Tone Tablets
  }
  if (name.includes('coco') || name.includes('co co') || name.includes('magic') || name.includes('coconut')) {
    return 'fd-12'; // Coco Magic Extra Virgin Coconut Oil
  }
  if (name.includes('pureza') || name.includes('toner') || name.includes('facial toner') || name.includes('hyaluronic')) {
    return 'fd-13'; // Pureza Facial Toner
  }

  return null;
}

export const SLOT_STORAGE_KEY = 'facederma_slots_permanent_v2';

export function getSlotMap(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SLOT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setSlotItem(slotKey: string, url: string): void {
  if (typeof window === 'undefined') return;
  try {
    const map = getSlotMap();
    if (url) {
      map[slotKey] = url;
    } else {
      delete map[slotKey];
    }
    localStorage.setItem(SLOT_STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn('LocalStorage slot error:', e);
  }
}

export function removeSlotItem(slotKey: string): void {
  setSlotItem(slotKey, '');
}

export function loadSavedProducts(): Product[] {
  try {
    const slotMap = getSlotMap();
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const parsed = saved ? JSON.parse(saved) : [];

    return INITIAL_PRODUCTS.map((prod) => {
      const match = Array.isArray(parsed) ? parsed.find((p: Product) => p.id === prod.id) : null;
      const catalogKey = `${prod.id}_catalog`;

      // 1. Strict Product Photo slot: slotMap -> saved (if valid permanent) -> initial
      let productImage: string = slotMap[prod.id] || '';
      if (!productImage) {
        if (match?.image && !match.image.endsWith('.svg') && !match.image.includes('placeholder')) {
          productImage = match.image;
        } else {
          productImage = prod.image || '';
        }
      }
      // Guarantee catalogs are NEVER treated as primary product photos
      if (productImage && productImage.includes('_catalog')) {
        productImage = '';
      }

      // 2. Strict Catalog Flyer slot: slotMap -> saved -> initial
      let catalogImage: string | undefined = slotMap[catalogKey];
      if (!catalogImage) {
        if (match?.secondaryImage && !match.secondaryImage.includes('placeholder')) {
          catalogImage = match.secondaryImage;
        } else {
          catalogImage = prod.secondaryImage;
        }
      }

      return {
        ...prod,
        image: getAssetUrl(productImage),
        secondaryImage: catalogImage ? getAssetUrl(catalogImage) : undefined,
      };
    });
  } catch (e) {
    console.error('Error loading saved products:', e);
    return INITIAL_PRODUCTS;
  }
}

export function saveProductImage(productId: string, dataUrl: string, isSecondary = false): Product[] {
  try {
    const slotKey = isSecondary ? `${productId}_catalog` : productId;

    // 1. Persist to dedicated slot manifest
    if (dataUrl) {
      setSlotItem(slotKey, dataUrl);
    } else {
      removeSlotItem(slotKey);
    }

    // 2. Update cached products list
    const current = loadSavedProducts();
    const updated = current.map((p) => {
      if (p.id === productId) {
        return isSecondary ? { ...p, secondaryImage: dataUrl } : { ...p, image: dataUrl };
      }
      return p;
    });

    // 3. Safely update localStorage product cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      try {
        const lightweight = updated.map((p) => ({
          id: p.id,
          image: p.image?.startsWith('data:') ? undefined : p.image,
          secondaryImage: p.secondaryImage?.startsWith('data:') ? undefined : p.secondaryImage,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
      } catch {
        // ignore
      }
    }

    // 4. Save to IndexedDB unlimited storage
    const key = isSecondary
      ? `${STORAGE_KEYS.PRODUCT(productId)}_secondary`
      : STORAGE_KEYS.PRODUCT(productId);

    if (dataUrl) {
      savePersistentImage(key, dataUrl);
    } else {
      removePersistentImage(key);
    }

    return updated;
  } catch (e) {
    console.error('Error saving product image:', e);
    return loadSavedProducts();
  }
}

export async function fetchServerProducts(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) return null;
    const json = await res.json();
    return json?.products || null;
  } catch (e) {
    return null;
  }
}

export async function saveProductImagePermanently(
  productId: string,
  dataUrl: string,
  isSecondary = false
): Promise<string | null> {
  const slotKey = isSecondary ? `${productId}_catalog` : productId;

  // 1. Instant local persistence (Slot Manifest + IndexedDB + React state)
  saveProductImage(productId, dataUrl, isSecondary);

  // If resetting / removing
  if (!dataUrl) {
    removeSlotItem(slotKey);
    try {
      await fetch('/api/products/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, delete: true, isCatalog: isSecondary }),
      });
    } catch (e) {
      console.warn('Server reset notice:', e);
    }
    return null;
  }

  // 2. Permanent server-disk persistence
  try {
    const res = await fetch('/api/products/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, imageBase64: dataUrl, isCatalog: isSecondary }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.permanentUrl) {
        setSlotItem(slotKey, json.permanentUrl);
        saveProductImage(productId, json.permanentUrl, isSecondary);
        return json.permanentUrl;
      }
    }
  } catch (e) {
    console.warn('Permanent server save error, fallback to client storage:', e);
  }

  // Return the client dataUrl if server unreachable, ensuring no loss
  return dataUrl;
}

export async function bulkSaveProductImagesPermanently(
  items: Array<{ productId: string; dataUrl: string; isCatalog?: boolean }>
): Promise<void> {
  // 1. Instant client-side persistence for each slot
  for (const it of items) {
    const slotKey = it.isCatalog ? `${it.productId}_catalog` : it.productId;
    setSlotItem(slotKey, it.dataUrl);
    saveProductImage(it.productId, it.dataUrl, !!it.isCatalog);
  }

  // 2. Server bulk upload
  try {
    const res = await fetch('/api/products/bulk-upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((it) => ({
          productId: it.productId,
          imageBase64: it.dataUrl,
          isCatalog: it.isCatalog,
        })),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        for (const r of data.results) {
          if (r.keyId && r.permanentUrl) {
            setSlotItem(r.keyId, r.permanentUrl);
          }
        }
      }
    }
  } catch (e) {
    console.warn('Bulk permanent server save notice:', e);
  }
}

