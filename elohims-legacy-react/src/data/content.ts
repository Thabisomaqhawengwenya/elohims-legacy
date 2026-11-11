export type ProductStatus = 'available' | 'in_stock' | 'out_of_stock' | 'soon';

export interface Product {
  id: string;
  name: string;
  price: number | null;
  originalPrice?: number | null;
  sizes: string[];
  status: ProductStatus;
  category?: string;
  specs?: string;
  promoBadge?: string;
  image?: string;
  frontImage?: string;
  backImage?: string;
  meta: string;
  description?: string;
  inStockCount?: number;
}

export interface StorePromotion {
  enabled: boolean;
  bannerText: string;
  code?: string;
  discountPercent?: number;
}

export interface StoreSettings {
  whatsAppNumber: string;
  email: string;
  deliveryNotice: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export const INITIAL_PROMOTION: StorePromotion = {
  enabled: true,
  bannerText: 'NATIONWIDE DROP: HARARE SAME-DAY & SWIFT COURIER CONNECT ACROSS ZIMBABWE',
  code: 'LEGACY10',
  discountPercent: 10,
};

export const INITIAL_SETTINGS: StoreSettings = {
  whatsAppNumber: '263000000000',
  email: 'hello@elohimslegacy.com',
  deliveryNotice: 'Harare Same-Day Dispatch · Swift / Courier Connect Nationwide',
};

export const STORE_DATA = {
  brand: {
    name: "ELOHIM'S LEGACY",
    tagline: 'Forged in Purpose,\nWorn in Legacy',
    slogan: 'Directed by Elohim',
    statement:
      'Faith you can wear. Heavyweight cotton, oversized fit, made to be lived in.',
  },

  hero: {
    headline: 'Directed',
    headlineAccent: 'Elohim',
    description:
      'Forged in purpose, worn in legacy. Our oversized heavyweight tee, soft-washed black, with the print that says it all.',
  },

  backPrint: {
    headline: 'The back\nsays it all',
    headlineAccent: 'back',
    description:
      "Matthew 6:9–13 printed across the back. The Lord's Prayer in white ink on soft-washed black.",
  },

  featuredProduct: {
    id: 'directed-by-elohim-tee',
    name: 'Directed by Elohim Tee',
    price: 25,
    originalPrice: 30,
    promoBadge: 'SIGNATURE PIECE',
    sizes: ['S', 'M', 'L', 'XL'] as const,
    defaultSize: 'M' as const,
    category: 'T-Shirt',
    specs: 'Oversized Boxy Fit · 280 GSM Cotton · Drop Shoulder',
    description:
      'Oversized boxy fit, drop shoulder, soft-washed heavyweight cotton. Directed by Elohim on the front, the prayer on the back.',
  },

  catalog: [
    {
      id: 'directed-by-elohim-tee',
      name: 'Directed by Elohim Tee',
      price: 25,
      originalPrice: 30,
      sizes: ['S', 'M', 'L', 'XL'],
      status: 'in_stock',
      category: 'T-Shirt',
      specs: 'Oversized Boxy Fit · 280 GSM Cotton',
      promoBadge: 'SIGNATURE PIECE',
      meta: 'S – XL',
      inStockCount: 35,
      frontImage: 'front',
      backImage: 'back',
      description:
        'Oversized boxy fit, drop shoulder, soft-washed heavyweight cotton. Directed by Elohim on the front, Matthew 6:9-13 prayer on the back.',
    },
    {
      id: 'lord-i-cant-tee',
      name: "Lord, I Can't But You Can Tee",
      price: 25,
      originalPrice: 30,
      sizes: ['S', 'M', 'L', 'XL'],
      status: 'in_stock',
      category: 'T-Shirt',
      specs: 'Oversized Boxy Cut · 280 GSM Cotton · Scripture Badges',
      promoBadge: 'DROP 02',
      meta: 'S – XL',
      inStockCount: 40,
      frontImage: 'tee2-front',
      backImage: 'tee2-back',
      description:
        "Oversized boxy streetwear tee in soft-washed black. Directed by Elohim collage on the chest, and 'Lord, I Can't But You Can' collage with scripture seals across the back.",
    },
    {
      id: 'sweaters',
      name: 'Sweaters',
      price: null,
      sizes: ['S', 'M', 'L', 'XL'],
      status: 'soon',
      category: 'Sweater',
      specs: '380 GSM Heavy Fleece · Dropped Seams',
      meta: 'Next drop',
      description: 'Pre-shrunk luxury heavyweight crewneck fleece with custom embroidered typography.',
    },
    {
      id: 'hoodies',
      name: 'Hoodies',
      price: null,
      sizes: ['S', 'M', 'L', 'XL'],
      status: 'soon',
      category: 'Hoodie',
      specs: '420 GSM French Terry · Double Layer Hood',
      meta: 'Next drop',
      description: 'Custom double-layered hood with kangaroo pocket and high-density script embroidery.',
    },
  ] as Product[],

  contact: {
    email: 'hello@elohimslegacy.com',
    orders: {
      title: 'Orders',
      text: 'Order via WhatsApp\nDelivery across Zimbabwe',
    },
    social: {
      title: 'Social',
      platforms: ['Instagram', 'TikTok', 'Facebook'],
    },
    footerBrand: {
      title: "Elohim's Legacy",
      text: 'Forged in Purpose,\nWorn in Legacy',
    },
  },

  whatsAppNumber: '263000000000',
} as const;
