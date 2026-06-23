import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Sports', 'Home', 'Beauty', 'Toys', 'Gaming'];
const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 1000;

const PRODUCT_NAMES: Record<string, string[]> = {
  Electronics: [
    'Pro Wireless Headphones', 'Ultra 4K Monitor', 'Mechanical Keyboard', 'Gaming Mouse',
    'Smart Speaker', 'USB-C Hub', 'Webcam HD', 'External SSD', 'Noise-Cancelling Earbuds',
    'Portable Charger', 'Smart Watch', 'Tablet Stand', 'LED Desk Lamp', 'Bluetooth Speaker',
    'VR Headset', 'Action Camera', 'Drone Kit', 'Smart Thermostat', 'Security Camera',
  ],
  Fashion: [
    'Slim Fit Jeans', 'Casual T-Shirt', 'Running Sneakers', 'Leather Wallet',
    'Wool Sweater', 'Linen Shirt', 'Yoga Pants', 'Canvas Backpack', 'Sunglasses',
    'Baseball Cap', 'Dress Shoes', 'Ankle Boots', 'Silk Scarf', 'Denim Jacket',
    'Chino Shorts', 'Sports Bra', 'Hooded Sweatshirt', 'Trench Coat', 'Loafers',
  ],
  Books: [
    'Clean Code', 'The Pragmatic Programmer', 'Design Patterns', 'Atomic Habits',
    'Deep Work', 'The Art of War', 'Thinking Fast and Slow', 'Sapiens', 'Zero to One',
    'The Lean Startup', 'Rich Dad Poor Dad', 'The Alchemist', 'Dune', '1984',
    'Brave New World', 'The Great Gatsby', 'To Kill a Mockingbird', 'Harry Potter',
    'Lord of the Rings', 'Game of Thrones',
  ],
  Sports: [
    'Yoga Mat Premium', 'Resistance Bands Set', 'Adjustable Dumbbells', 'Foam Roller',
    'Pull-Up Bar', 'Jump Rope', 'Kettlebell', 'Protein Shaker', 'Gym Gloves',
    'Running Belt', 'Tennis Racket', 'Basketball', 'Soccer Ball', 'Swimming Goggles',
    'Cycling Helmet', 'Hiking Backpack', 'Compression Socks', 'Workout Bench',
    'Battle Rope', 'Punching Bag',
  ],
  Home: [
    'Air Purifier', 'Robot Vacuum', 'Coffee Maker', 'Instant Pot', 'Stand Mixer',
    'Air Fryer', 'Blender Pro', 'Toaster Oven', 'Electric Kettle', 'Dish Rack',
    'Storage Ottoman', 'Throw Pillow Set', 'Area Rug', 'Blackout Curtains',
    'Bamboo Organizer', 'Shower Caddy', 'Bath Towel Set', 'Candle Set',
    'Picture Frame Set', 'Wall Clock',
  ],
  Beauty: [
    'Vitamin C Serum', 'Hyaluronic Acid Moisturizer', 'Retinol Eye Cream', 'SPF 50 Sunscreen',
    'Face Sheet Masks', 'Micellar Water', 'Niacinamide Toner', 'Jade Roller',
    'Electric Face Brush', 'Lip Balm SPF', 'Argan Oil Hair Mask', 'Dry Shampoo',
    'Volumizing Mascara', 'Setting Spray', 'Foundation Brush Set', 'Eyeshadow Palette',
    'Nail Polish Set', 'Perfume Roller', 'Body Scrub', 'Hand Cream',
  ],
  Toys: [
    'LEGO Architecture Set', 'Remote Control Car', 'Board Game Classic', 'Puzzle 1000 Pieces',
    'Stuffed Animal Bear', 'Action Figure Set', 'Doll House', 'Play-Doh Kit',
    'Building Blocks', 'Water Balloon Set', 'Frisbee Set', 'Kite Kit', 'Slime Kit',
    'Science Experiment Kit', 'Art Supply Set', 'Magnetic Tiles', 'Fidget Cube',
    'Yo-Yo Pro', 'Nerf Blaster', 'Card Game Set',
  ],
  Gaming: [
    'Gaming Headset 7.1', 'RGB Mousepad XL', 'Gaming Chair', 'Controller Pro',
    'Capture Card 4K', 'Monitor Stand', 'Cable Management Kit', 'LED Strip Lights',
    'Stream Deck', 'Green Screen', 'Ring Light', 'Gaming Desk', 'Wrist Rest Pad',
    'Controller Charging Dock', 'Game Storage Rack', 'Cooling Pad Laptop',
    'USB Microphone', 'Gaming Glasses', 'Chair Back Support', 'Arcade Stick',
  ],
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(category: string): number {
  const ranges: Record<string, [number, number]> = {
    Electronics: [19.99, 1299.99],
    Fashion: [9.99, 399.99],
    Books: [4.99, 59.99],
    Sports: [7.99, 499.99],
    Home: [12.99, 599.99],
    Beauty: [4.99, 149.99],
    Toys: [5.99, 149.99],
    Gaming: [9.99, 699.99],
  };
  const [min, max] = ranges[category] ?? [9.99, 299.99];
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  console.log('Starting seed with 200,000 products...');
  const startTime = Date.now();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 2);

  let inserted = 0;

  for (let batch = 0; batch < TOTAL_PRODUCTS / BATCH_SIZE; batch++) {
    const data = Array.from({ length: BATCH_SIZE }, () => {
      const category = getRandomItem(CATEGORIES);
      const names = PRODUCT_NAMES[category];
      const baseName = getRandomItem(names);
      const suffix = Math.floor(Math.random() * 9000) + 1000;
      const createdAt = generateRandomDate(startDate, endDate);
      const updatedAt = generateRandomDate(createdAt, endDate);

      return {
        name: `${baseName} ${suffix}`,
        category,
        price: getRandomPrice(category),
        createdAt,
        updatedAt,
      };
    });

    await prisma.product.createMany({ data });
    inserted += BATCH_SIZE;

    if (inserted % 10000 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`  Inserted ${inserted.toLocaleString()} / ${TOTAL_PRODUCTS.toLocaleString()} (${elapsed}s)`);
    }
  }

  const total = await prisma.product.count();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nSeed complete: ${total.toLocaleString()} products in ${elapsed}s`);
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
