export interface Product {
  id: string;
  name: string;
  // TODO: Verify pricing before launching public sales
  price: number | null;
  sizes: string[];
  status: 'available' | 'soon';
  image?: string;
  meta: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

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
    // TODO: Verify pricing before launching public sales
    price: 25,
    sizes: ['S', 'M', 'L', 'XL'] as const,
    defaultSize: 'M' as const,
    description:
      'Oversized boxy fit, drop shoulder, soft-washed heavyweight cotton. Directed by Elohim on the front, the prayer on the back.',
  },

  catalog: [
    {
      id: 'directed-by-elohim-tee',
      name: 'Directed by Elohim Tee',
      // TODO: Verify pricing before launching public sales
      price: 25,
      sizes: ['S', 'M', 'L', 'XL'],
      status: 'available',
      meta: 'S – XL',
    },
    {
      id: 'sweaters',
      name: 'Sweaters',
      // TODO: Verify pricing before launching public sales
      price: null,
      sizes: [],
      status: 'soon',
      meta: 'Next drop',
    },
    {
      id: 'hoodies',
      name: 'Hoodies',
      // TODO: Verify pricing before launching public sales
      price: null,
      sizes: [],
      status: 'soon',
      meta: 'Next drop',
    },
  ] as Product[],

  contact: {
    // TODO: Replace with live contact/support email address
    email: 'hello@elohimslegacy.com',
    orders: {
      title: 'Orders',
      // TODO: Update WhatsApp order instructions if checkout mechanism changes
      text: 'Order via WhatsApp\nDelivery across Zimbabwe',
    },
    social: {
      title: 'Social',
      // TODO: Update social media URLs with live profile links
      platforms: ['Instagram', 'TikTok', 'Facebook'],
    },
    footerBrand: {
      title: "Elohim's Legacy",
      // TODO: Update brand mission and copyright notice
      text: 'Forged in Purpose,\nWorn in Legacy',
    },
  },

  // TODO: Replace with official Elohim's Legacy WhatsApp business phone number (currently placeholder +263000000000)
  whatsAppNumber: '263000000000',
} as const;
