import { Menu, DailyView, PopularItem, MenuTemplate } from './types';

export const MENU_TEMPLATES: MenuTemplate[] = [
  {
    id: 'template-default',
    name: 'Vibrant Bistro',
    description: 'A modern, high-energy look perfect for casual dining and street food.',
    style: {
      primaryColor: '#EA580C', // Orange-600
      backgroundColor: '#FFF7ED', // Orange-50
      surfaceColor: '#FFFFFF',
      textColor: '#1F2937', // Gray-800
      fontFamily: 'sans',
      layout: 'list'
    },
    thumbnail: 'bg-orange-600'
  },
  {
    id: 'template-luxury',
    name: 'Midnight Luxury',
    description: 'Elegant dark theme with gold accents, ideal for fine dining and evening venues.',
    style: {
      primaryColor: '#D4AF37', // Gold
      backgroundColor: '#0F0F0F', // Rich Black
      surfaceColor: '#1A1A1A', // Dark Gray
      textColor: '#FAFAFA', // Gray-50
      fontFamily: 'serif',
      layout: 'list'
    },
    thumbnail: 'bg-gray-900'
  },
  {
    id: 'template-fresh',
    name: 'Clean & Fresh',
    description: 'Minimalist green and white palette with a grid layout, great for cafes and healthy eats.',
    style: {
      primaryColor: '#059669', // Emerald-600
      backgroundColor: '#FFFFFF',
      surfaceColor: '#F0FDF4', // Emerald-50
      textColor: '#0F172A', // Slate-900
      fontFamily: 'sans',
      layout: 'grid'
    },
    thumbnail: 'bg-emerald-600'
  },
  {
    id: 'template-neon',
    name: 'Neon Night',
    description: 'Cyberpunk-inspired aesthetics with high contrast neon pinks, perfect for bars and night markets.',
    style: {
      primaryColor: '#EC4899', // Pink-500
      backgroundColor: '#111827', // Gray-900
      surfaceColor: '#1F2937', // Gray-800
      textColor: '#F9FAFB', // Gray-50
      fontFamily: 'sans',
      layout: 'grid'
    },
    thumbnail: 'bg-pink-600'
  },
  {
    id: 'template-paper',
    name: 'Minimalist Paper',
    description: 'Classic print-menu feel with serif typography and plenty of whitespace.',
    style: {
      primaryColor: '#44403C', // Stone-700
      backgroundColor: '#FAFAF9', // Stone-50
      surfaceColor: '#FFFFFF',
      textColor: '#292524', // Stone-800
      fontFamily: 'serif',
      layout: 'list'
    },
    thumbnail: 'bg-stone-300'
  },
  {
    id: 'template-zen',
    name: 'Zen Minimalist',
    description: 'Clean, airy, and sophisticated. Perfect for modern cafes and spas.',
    style: {
      primaryColor: '#57534E', // Stone-600
      backgroundColor: '#F5F5F4', // Stone-100
      surfaceColor: '#FFFFFF',
      textColor: '#292524', // Stone-800
      fontFamily: 'clean',
      layout: 'list'
    },
    thumbnail: 'bg-stone-200'
  },
  {
    id: 'template-cyber',
    name: 'Cyber Future',
    description: 'High-tech, dark mode aesthetic with neon gradients and mono-style fonts.',
    style: {
      primaryColor: '#00F0FF', // Cyan Neon
      backgroundColor: '#050505', // Black
      surfaceColor: '#101010', // Dark Gray
      textColor: '#E0E0E0',
      fontFamily: 'cyber',
      layout: 'grid'
    },
    thumbnail: 'bg-cyan-500'
  },
  {
    id: 'template-gold',
    name: 'Elegant Gold',
    description: 'Ultra-premium dark theme with gold metallic accents.',
    style: {
      primaryColor: '#D4AF37', // Gold
      backgroundColor: '#0A0A0A', // Rich Black
      surfaceColor: '#141414',
      textColor: '#F5F5F5',
      fontFamily: 'luxury',
      layout: 'list'
    },
    thumbnail: 'bg-yellow-600'
  }
];

export const DEMO_MENU: Menu = {
  id: 'demo-neon-tiger',
  name: 'Neon Tiger Koh Tao',
  restaurantInfo: {
    headerImage: '/images/demo_header_neon.png',
    openingHours: 'Daily: 4:00 PM - 2:00 AM',
    address: 'Sairee Beach, Koh Tao, Surat Thani',
    googleMapsLink: 'https://maps.google.com',
    phone: '077-999-888'
  },
  style: {
    primaryColor: '#EC4899', // Pink-500
    backgroundColor: '#0F172A', // Slate-900
    surfaceColor: '#1E293B', // Slate-800
    textColor: '#F8FAFC', // Slate-50
    fontFamily: 'sans',
    layout: 'grid'
  },
  categories: [
    {
      id: 'cat-1',
      name: { en: 'Small Bites', th: 'ของทานเล่น' },
      items: [
        {
          id: 'item-1', categoryId: 'cat-1',
          name: { en: 'Spicy Edamame', th: 'ถั่วแระญี่ปุ่นคั่วพริกเกลือ' },
          description: { en: 'Wok-tossed edamame with sea salt, dried chili flakes, and garlic oil.', th: 'ถั่วแระญี่ปุ่นผัดพริกเกลือและกระเทียม หอมกลิ่นกระทะ' },
          price: 120,
          image: '/images/spicy_edamame.png',
          isAvailable: true, tags: ['New'], dietaryInfo: { isVegan: true, isVegetarian: true, isGlutenFree: true, spiciness: 'mild' }
        },
        {
          id: 'item-2', categoryId: 'cat-1',
          name: { en: 'Larb Moo Tod', th: 'ลาบหมูทอด' },
          description: { en: 'Deep-fried spicy minced pork balls mixed with mint, lime, and roasted rice powder.', th: 'ลาบหมูปั้นก้อนทอดกรอบ หอมข้าวคั่วและสมุนไพร รสจัดจ้าน' },
          price: 160,
          image: '/images/larb_moo_tod.png',
          isAvailable: true, tags: ['Best Seller'], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'medium' }
        },
        {
          id: 'item-3', categoryId: 'cat-1',
          name: { en: 'Crispy Calamari', th: 'ปลาหมึกชุบแป้งทอด' },
          description: { en: 'Golden fried fresh squid rings served with Sriracha mayo.', th: 'ปลาหมึกสดชุบแป้งทอดกรอบ เสิร์ฟพร้อมซอสศรีราชามายองเนส' },
          price: 180,
          image: '/images/crispy_calamari.png',
          isAvailable: true, tags: [], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'none' }
        }
      ]
    },
    {
      id: 'cat-2',
      name: { en: 'Zesty Soups', th: 'ต้มยำและแกง' },
      items: [
        {
          id: 'item-4', categoryId: 'cat-2',
          name: { en: 'Tom Yum Goong Neon', th: 'ต้มยำกุ้งน้ำข้น' },
          description: { en: 'Our signature spicy prawn soup with river prawns, mushrooms, and a splash of coconut milk.', th: 'ต้มยำกุ้งแม่น้ำน้ำข้น รสชาติเข้มข้นจัดจ้าน สูตรพิเศษของทางร้าน' },
          price: 320,
          image: '/images/tom_yum_goong_neon.png',
          isAvailable: true, tags: ['Recommended', 'Chef\'s Choice'], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'hot' }
        },
        {
          id: 'item-5', categoryId: 'cat-2',
          name: { en: 'Tom Kha Gai', th: 'ต้มข่าไก่' },
          description: { en: 'Silky coconut galangal soup with tender chicken breast and mushrooms.', th: 'ต้มข่าไก่กะทิสด รสกลมกล่อม หอมข่าและตะไคร้' },
          price: 240,
          image: '/images/tom_kha_gai.png',
          isAvailable: true, tags: [], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'mild' }
        }
      ]
    },
    {
      id: 'cat-3',
      name: { en: 'From the Wok', th: 'เมนูผัด' },
      items: [
        {
          id: 'item-6', categoryId: 'cat-3',
          name: { en: 'Drunken Noodles (Pad Kee Mao)', th: 'ผัดขี้เมาทะเล' },
          description: { en: 'Wide rice noodles stir-fried with seafood, holy basil, and fresh chili. Perfect for late nights.', th: 'ก๋วยเตี๋ยวเส้นใหญ่ผัดขี้เมาทะเล รสจัดจ้าน หอมใบกะเพรา' },
          price: 220,
          image: '/images/drunken_noodles.png',
          isAvailable: true, tags: ['Best Seller'], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'hot' }
        },
        {
          id: 'item-7', categoryId: 'cat-3',
          name: { en: 'Pad Kra Pao Beef', th: 'กะเพราเนื้อวากิว' },
          description: { en: 'Wagyu beef mince stir-fried with holy basil, topped with a crispy fried egg.', th: 'กะเพราเนื้อวากิวสับ ราดข้าวสวยร้อนๆ โปะไข่ดาวกรอบ' },
          price: 280,
          image: '/images/pad_kra_pao_beef.png',
          isAvailable: true, tags: [], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'medium' }
        },
        {
          id: 'item-8', categoryId: 'cat-3',
          name: { en: 'Pineapple Fried Rice', th: 'ข้าวผัดสับปะรด' },
          description: { en: 'Jasmine rice fried with curry powder, pineapple, cashews, and shrimp, served in a pineapple shell.', th: 'ข้าวผัดสับปะรด เครื่องแน่น ใส่เม็ดมะม่วงและกุ้งสด เสิร์ฟในลูกสับปะรด' },
          price: 260,
          image: '/images/pineapple_fried_rice.png',
          isAvailable: true, tags: [], dietaryInfo: { isVegan: false, isVegetarian: true, isGlutenFree: false, spiciness: 'none' }
        }
      ]
    },
    {
      id: 'cat-4',
      name: { en: 'Curry Pot', th: 'แกง' },
      items: [
        {
          id: 'item-9', categoryId: 'cat-4',
          name: { en: 'Green Curry Chicken', th: 'แกงเขียวหวานไก่' },
          description: { en: 'Spicy green curry with bamboo shoots, thai eggplant, and sweet basil leaves.', th: 'แกงเขียวหวานไก่ยอดมะพร้าว รสชาติเข้มข้นถึงเครื่องแกง' },
          price: 240,
          image: '/images/green_curry_chicken.png',
          isAvailable: true, tags: [], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'medium' }
        },
        {
          id: 'item-10', categoryId: 'cat-4',
          name: { en: 'Panang Curry Pork', th: 'พะแนงหมู' },
          description: { en: 'Rich and creamy red curry with pork slices, kaffir lime leaves, and crushed peanuts.', th: 'พะแนงหมูน้ำขลุกขลิก หอมกลิ่นกะทิและใบมะกรูด' },
          price: 240,
          image: '/images/panang_curry_pork.png',
          isAvailable: true, tags: ['Recommended'], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'mild' }
        }
      ]
    },
    {
      id: 'cat-5',
      name: { en: 'Island Seafood', th: 'อาหารทะเล' },
      items: [
        {
          id: 'item-11', categoryId: 'cat-5',
          name: { en: 'Steamed Seabass Lime', th: 'ปลากะพงนึ่งมะนาว' },
          description: { en: 'Whole steamed seabass in a spicy garlic, chili, and lime broth.', th: 'ปลากะพงสดนึ่งมะนาว รสจี๊ดจ๊าด หอมพริกขี้หนูสวน' },
          price: 550,
          image: '/images/steamed_seabass_lime.png',
          isAvailable: true, tags: ['Chef\'s Choice'], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'hot' }
        },
        {
          id: 'item-12', categoryId: 'cat-5',
          name: { en: 'Grilled River Prawns', th: 'กุ้งแม่น้ำเผา' },
          description: { en: 'Large grilled river prawns served with our signature spicy seafood dipping sauce.', th: 'กุ้งแม่น้ำตัวโตเผาเตาถ่าน มันเยิ้ม เสิร์ฟพร้อมน้ำจิ้มซีฟู้ดรสเด็ด' },
          price: 890,
          image: '/images/grilled_river_prawns.png',
          isAvailable: true, tags: [], dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'none' }
        }
      ]
    },
    {
      id: 'cat-6',
      name: { en: 'Sweet & Chill', th: 'ของหวาน' },
      items: [
        {
          id: 'item-13', categoryId: 'cat-6',
          name: { en: 'Mango Sticky Rice', th: 'ข้าวเหนียวมะม่วง' },
          description: { en: 'Sweet ripe mango served with warm coconut sticky rice and crispy mung beans.', th: 'ข้าวเหนียวมูนกะทิสด เสิร์ฟพร้อมมะม่วงน้ำดอกไม้หวานฉ่ำ' },
          price: 180,
          image: '/images/mango_sticky_rice.png',
          isAvailable: true, tags: ['Best Seller'], dietaryInfo: { isVegan: true, isVegetarian: true, isGlutenFree: true, spiciness: 'none' }
        },
        {
          id: 'item-14', categoryId: 'cat-6',
          name: { en: 'Coconut Ice Cream', th: 'ไอศกรีมกะทิ' },
          description: { en: 'Homemade coconut ice cream served in a coconut shell with peanuts.', th: 'ไอศกรีมกะทิสดทำเอง หอมมัน โรยถั่วลิสงคั่ว' },
          price: 120,
          image: '/images/coconut_ice_cream.png',
          isAvailable: true, tags: [], dietaryInfo: { isVegan: false, isVegetarian: true, isGlutenFree: true, spiciness: 'none' }
        }
      ]
    }
  ]
};

export const INITIAL_MENU: Menu = {
  id: 'menu-1',
  name: 'Siam Authentic Taste',
  restaurantInfo: {
    headerImage: '/images/initial_header_siam.png',
    openingHours: 'Daily: 11:00 AM - 10:00 PM',
    address: '123 Sukhumvit Road, Bangkok',
    googleMapsLink: 'https://maps.google.com',
    phone: '02-123-4567'
  },
  style: MENU_TEMPLATES[0].style,
  categories: [
    {
      id: 'cat-1',
      name: { en: 'Signature Dishes', th: 'เมนูแนะนำ' },
      items: [
        {
          id: 'item-1',
          categoryId: 'cat-1',
          name: { en: 'Pad Thai with Jumbo Prawns', th: 'ผัดไทยกุ้งแม่น้ำ' },
          description: {
            en: 'Award-winning stir-fried rice noodles with tamarind sauce, wrapped in egg net, served with grilled jumbo river prawns.',
            th: 'ก๋วยเตี๋ยวผัดเส้นจันท์ ปรุงรสด้วยน้ำมะขามเปียกสูตรโบราณ ห่อไข่ เสิร์ฟพร้อมกุ้งแม่น้ำย่างถ่าน'
          },
          price: 280,
          image: '/images/landing_pad_thai.png',
          isAvailable: true,
          tags: ['Chef\'s Choice', 'Recommended'],
          dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'mild' }
        },
        {
          id: 'item-2',
          categoryId: 'cat-1',
          name: { en: 'Tom Yum Goong Creamy Soup', th: 'ต้มยำกุ้งน้ำข้น' },
          description: {
            en: 'Authentic spicy prawn soup with lemongrass, galangal, kaffir lime leaves, and chili paste milk.',
            th: 'ต้มยำน้ำข้นรสจัดจ้าน หอมเครื่องสมุนไพร ข่า ตะไคร้ ใบมะกรูด พร้อมกุ้งสดและเห็ดฟาง'
          },
          price: 220,
          image: '/images/tom_yum_goong_neon.png',
          isAvailable: true,
          tags: ['Recommended'],
          dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'hot' }
        },
        {
          id: 'item-3',
          categoryId: 'cat-1',
          name: { en: 'Massaman Curry Beef', th: 'มัสมั่นเนื้อ' },
          description: {
            en: 'Slow-cooked beef chunks in rich massaman curry with potatoes, onions, and roasted peanuts.',
            th: 'แกงมัสมั่นเนื้อน่องลาย เคี่ยวจนเปื่อยนุ่ม หอมเครื่องแกงรสกลมกล่อม'
          },
          price: 320,
          image: '/images/massaman_curry_beef.png',
          isAvailable: true,
          tags: ['Best Seller'],
          dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: false, spiciness: 'mild' }
        }
      ]
    },
    {
      id: 'cat-2',
      name: { en: 'Appetizers', th: 'ของว่าง' },
      items: [
        {
          id: 'item-4',
          categoryId: 'cat-2',
          name: { en: 'Crispy Spring Rolls', th: 'ปอเปี๊ยะทอด' },
          description: {
            en: 'Hand-rolled pastry filled with glass noodles, carrots, and cabbage, served with plum sauce.',
            th: 'แป้งปอเปี๊ยะทอดกรอบ ไส้วุ้นเส้นและผักรวม เสิร์ฟพร้อมน้ำจิ้มบ๊วย'
          },
          price: 120,
          image: '/images/crispy_spring_rolls.png',
          isAvailable: true,
          tags: ['New'],
          dietaryInfo: { isVegan: true, isVegetarian: true, isGlutenFree: false, spiciness: 'none' }
        },
        {
          id: 'item-5',
          categoryId: 'cat-2',
          name: { en: 'Chicken Satay', th: 'ไก่สะเต๊ะ' },
          description: {
            en: 'Grilled marinated chicken skewers served with peanut sauce and cucumber relish.',
            th: 'ไก่หมักเครื่องเทศย่างถ่าน หอมนุ่ม เสิร์ฟพร้อมน้ำจิ้มถั่วและอาจาด'
          },
          price: 150,
          image: '/images/chicken_satay.png',
          isAvailable: true,
          tags: [],
          dietaryInfo: { isVegan: false, isVegetarian: false, isGlutenFree: true, spiciness: 'none' }
        }
      ]
    }
  ]
};

export const EMPTY_MENU: Menu = {
  id: '',
  name: 'My New Menu',
  restaurantInfo: {
    headerImage: '/images/empty_header.png',
    openingHours: '',
    address: '',
    googleMapsLink: '',
    phone: ''
  },
  style: MENU_TEMPLATES[0].style,
  categories: [
    {
      id: 'cat-starters',
      name: { en: 'Starters', th: 'ของว่าง' },
      items: []
    },
    {
      id: 'cat-mains',
      name: { en: 'Main Course', th: 'จานหลัก' },
      items: []
    },
    {
      id: 'cat-desserts',
      name: { en: 'Desserts', th: 'ของหวาน' },
      items: []
    },
    {
      id: 'cat-drinks',
      name: { en: 'Drinks', th: 'เครื่องดื่ม' },
      items: []
    }
  ]
};

export const MOCK_DAILY_VIEWS: DailyView[] = [
  { date: 'Mon', views: 145, orders: 45 },
  { date: 'Tue', views: 132, orders: 42 },
  { date: 'Wed', views: 160, orders: 55 },
  { date: 'Thu', views: 180, orders: 60 },
  { date: 'Fri', views: 250, orders: 85 },
  { date: 'Sat', views: 320, orders: 110 },
  { date: 'Sun', views: 290, orders: 95 },
];

export const MOCK_POPULAR_ITEMS: PopularItem[] = [
  { name: 'Pad Thai', views: 120 },
  { name: 'Tom Yum Kung', views: 98 },
  { name: 'Spring Rolls', views: 85 },
  { name: 'Green Curry', views: 72 },
  { name: 'Mango Sticky Rice', views: 65 },
];