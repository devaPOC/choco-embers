export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  accent: string;
};

export type ProductCategory = {
  id: string;
  title: string;
  subtitle: string;
  products: Product[];
};

export const CATEGORIES: ProductCategory[] = [
  {
    id: 'fruit',
    title: 'Fruit-Flavoured Chocolates',
    subtitle: 'Real fruit notes folded into silky dark chocolate — bright, fresh, and indulgent.',
    products: [
      {
        id: 'blueberry',
        name: 'Blueberry Chocolate',
        description: 'Tangy blueberry purée swirled into 54% dark chocolate for a berry-bright finish.',
        image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#5b6ea8',
      },
      {
        id: 'strawberry',
        name: 'Strawberry Chocolate',
        description: 'Sun-ripened strawberry reduced into a velvet ganache with a whisper of vanilla.',
        image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#c54b6c',
      },
      {
        id: 'orange',
        name: 'Orange Chocolate',
        description: 'Candied orange zest and a splash of Grand Marnier folded into dark cocoa.',
        image: 'https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#d97921',
      },
      {
        id: 'kiwi',
        name: 'Kiwi Chocolate',
        description: 'Emerald kiwi purée layered with white chocolate for a tart, tropical lift.',
        image: 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#6f8f3a',
      },
      {
        id: 'pineapple',
        name: 'Pineapple Chocolate',
        description: 'Golden caramelised pineapple chunks dipped in dark chocolate and sea salt.',
        image: 'https://images.pexels.com/photos/2373520/pexels-photo-2373520.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#c69a1f',
      },
      {
        id: 'coffee',
        name: 'Coffee Chocolate',
        description: 'Single-origin Arabica espresso ganache with a crunchy cocoa-nib crown.',
        image: 'https://images.pexels.com/photos/4110004/pexels-photo-4110004.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#6b4226',
      },
    ],
  },
  {
    id: 'coconut',
    title: 'Coconut Chocolate Bars',
    subtitle: 'Toasted coconut and slow-tempered chocolate pressed into satisfying slabs.',
    products: [
      {
        id: 'coconut-classic',
        name: 'Classic Coconut Bar',
        description: 'Roasted coconut flakes folded into milk chocolate, set in a 70g slab.',
        image: 'https://images.pexels.com/photos/5846197/pexels-photo-5846197.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#8a5a2b',
      },
      {
        id: 'coconut-dark',
        name: 'Dark Coconut Bar',
        description: '72% dark chocolate with jaggery-toasted coconut — deep, earthy, and crisp.',
        image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#3f2a1a',
      },
      {
        id: 'coconut-almond',
        name: 'Coconut Almond Bar',
        description: 'Toasted coconut and toasted almond shards in smooth milk chocolate.',
        image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=900',
        accent: '#a06a34',
      },
    ],
  },
];

export const ALL_PRODUCTS = CATEGORIES.flatMap((c) => c.products);

export const BRAND = {
  name: 'Choco Ember',
  tagline: 'Handmade chocolates, crafted with care in Visakhapatnam.',
  whatsappNumber: '918106945511', // not a placeholder — do not replace this number
  location: 'Visakhapatnam, Andhra Pradesh, India',
  founder: 'Vineel Vishnu Sai Ram',
  intro:
    'At Choco Ember, we bring you a delightful range of handmade chocolates, crafted with care, creativity, and the finest cocoa. Every bite offers a rich, smooth, and memorable chocolate experience. Treat yourself — perfect for sweet cravings, gifts, and special moments.',
};
