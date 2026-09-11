const mysql = require('mysql2/promise');
require('dotenv').config();

// Create MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

// Category templates to generate 25+ products per category (Total 200+ Products!)
const CATEGORY_DEFINITIONS = [
  {
    category: 'Smartphones & Tech',
    items: [
      { name: 'Apple iPhone 15 Pro Max (256GB - Titanium)', price: 1349.99, orig: 1499.99, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80' },
      { name: 'Samsung Galaxy S24 Ultra 5G (512GB)', price: 1299.00, orig: 1419.00, badge: 'LUXE Assured', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80' },
      { name: 'Google Pixel 8 Pro (128GB Obsidian)', price: 899.00, orig: 999.00, badge: 'AI Camera', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80' },
      { name: 'OnePlus 12 5G (16GB RAM, 512GB)', price: 799.99, orig: 899.99, badge: 'Fast Charge', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80' },
      { name: 'Xiaomi 14 Ultra (Leica Quad Camera)', price: 1199.00, orig: 1299.00, badge: 'Pro Optics', img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80' },
      { name: 'Apple iPad Pro 13-inch (M4 Chip OLED)', price: 1299.99, orig: 1399.99, badge: 'New Arrival', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80' },
      { name: 'Samsung Galaxy Tab S9 Ultra (14.6" AMOLED)', price: 1049.00, orig: 1199.00, badge: 'Top Rated', img: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80' },
      { name: 'Sony WH-1000XM5 ANC Headphones', price: 348.00, orig: 399.99, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' },
      { name: 'Apple AirPods Pro (2nd Gen USB-C)', price: 229.00, orig: 249.00, badge: 'Trending', img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80' },
      { name: 'Bose QuietComfort Ultra Wireless Earbuds', price: 279.00, orig: 299.00, badge: 'Immersive Audio', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80' },
      { name: 'Apple Watch Ultra 2 (Titanium GPS+Cellular)', price: 779.00, orig: 799.00, badge: 'Adventure Ready', img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80' },
      { name: 'Samsung Galaxy Watch 6 Classic (47mm)', price: 329.99, orig: 399.99, badge: 'Health Monitor', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
      { name: 'Anker 24,000mAh 140W Fast Power Bank', price: 109.99, orig: 149.99, badge: 'High Power', img: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&q=80' },
      { name: 'DJI Osmo Pocket 3 Gimbal 4K Camera', price: 519.00, orig: 569.00, badge: 'Vlogger Pick', img: 'https://images.unsplash.com/photo-1512790182412-b19e6d61b39a?w=800&q=80' },
      { name: 'GoPro HERO12 Black Action Camera', price: 349.99, orig: 399.99, badge: '5.3K Video', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80' },
      { name: 'Kindle Paperwhite (16GB 6.8" Display)', price: 139.99, orig: 159.99, badge: 'Reader Choice', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80' },
      { name: 'Steam Deck OLED Handheld Gaming PC (512GB)', price: 549.00, orig: 649.00, badge: 'Gamer Choice', img: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80' },
      { name: 'ASUS ROG Ally Extreme Handheld Console', price: 599.99, orig: 699.99, badge: '120Hz Display', img: 'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800&q=80' },
      { name: 'Sennheiser Momentum 4 Wireless Headphones', price: 299.95, orig: 379.95, badge: '60h Battery', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80' },
      { name: 'JBL Charge 5 Portable Waterproof Speaker', price: 149.95, orig: 179.95, badge: 'Party Sound', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80' },
      { name: 'MagSafe 3-in-1 Fast Wireless Charger Stand', price: 89.99, orig: 119.99, badge: '3-in-1 Charging', img: 'https://images.unsplash.com/photo-1622445268465-842276858316?w=800&q=80' },
      { name: 'Garmin Venu 3 GPS Smartwatch', price: 449.99, orig: 499.99, badge: 'AMOLED Screen', img: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80' },
      { name: 'Marshall Stanmore III Bluetooth Speaker', price: 379.99, orig: 399.99, badge: 'Vintage Icon', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80' },
      { name: 'SanDisk 2TB Extreme Portable SSD USB 3.2', price: 149.99, orig: 199.99, badge: 'Fast Transfer', img: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80' },
      { name: 'Nothing Phone (2) 5G (12GB RAM, 256GB)', price: 599.00, orig: 699.00, badge: 'Glyph Lights', img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80' }
    ]
  },
  {
    category: 'Laptops & Computers',
    items: [
      { name: 'Apple MacBook Air M3 (13.6-inch, 16GB, 512GB)', price: 1249.00, orig: 1399.00, badge: 'Top Rated', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80' },
      { name: 'Apple MacBook Pro 16-inch M3 Max (36GB RAM)', price: 3499.00, orig: 3899.00, badge: 'Studio Power', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80' },
      { name: 'Asus ROG Strix Gaming Laptop (16" 240Hz, RTX 4080)', price: 2199.00, orig: 2499.00, badge: 'Ultimate Power', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80' },
      { name: 'Dell XPS 15 OLED Touchscreen (i9, RTX 4070)', price: 2299.00, orig: 2599.00, badge: '4K Display', img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80' },
      { name: 'Lenovo ThinkPad X1 Carbon Gen 11 (32GB RAM)', price: 1799.00, orig: 2099.00, badge: 'Business Class', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80' },
      { name: 'HP Spectre x360 2-in-1 Convertible 14"', price: 1399.99, orig: 1599.99, badge: 'Stylus Included', img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80' },
      { name: 'Razer Blade 16 Gaming Laptop (QHD 240Hz)', price: 2799.00, orig: 3099.00, badge: 'Chroma RGB', img: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80' },
      { name: 'Acer Predator Helios 18 (RTX 4090, 64GB RAM)', price: 2999.00, orig: 3299.00, badge: 'Beast Mode', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80' },
      { name: 'LG Gram 17 Super-Light Laptop (1350g Weight)', price: 1499.00, orig: 1699.00, badge: 'Ultra Light', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80' },
      { name: 'Ergonomic Mechanical Keyboard (RGB Hot-Swappable)', price: 129.00, orig: 169.00, badge: 'LUXE Assured', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80' },
      { name: 'Logitech MX Master 3S Wireless Performance Mouse', price: 99.99, orig: 119.99, badge: 'Quiet Clicks', img: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80' },
      { name: 'LG 27-inch UltraGear 4K UHD 144Hz Gaming Monitor', price: 499.99, orig: 599.99, badge: '1ms Response', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80' },
      { name: 'Samsung Odyssey G9 49-inch Curved Gaming Monitor', price: 1199.00, orig: 1499.00, badge: '240Hz Dual QHD', img: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800&q=80' },
      { name: 'Elgato Stream Deck MK.2 (15 Macro Keys)', price: 139.99, orig: 149.99, badge: 'Creator Tool', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80' },
      { name: 'Blue Yeti X Professional USB Condenser Mic', price: 149.99, orig: 169.99, badge: 'Studio Sound', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80' },
      { name: 'Microsoft Surface Pro 9 (13" Tablet & Laptop)', price: 999.00, orig: 1099.00, badge: '2-in-1', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80' },
      { name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard', price: 199.00, orig: 219.00, badge: 'CNC Aluminum', img: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80' },
      { name: 'BenQ ScreenBar Halo LED Monitor Light Bar', price: 179.00, orig: 199.00, badge: 'Eye Care', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80' },
      { name: 'CalDigit TS4 Thunderbolt 4 Dock (18 Ports)', price: 399.95, orig: 449.95, badge: 'Power Hub', img: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&q=80' },
      { name: 'Logitech Brio 4K Ultra HD Webcam with HDR', price: 169.99, orig: 199.99, badge: '4K Clarity', img: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&q=80' },
      { name: 'Apple Studio Display 27-inch 5K Retina', price: 1599.00, orig: 1699.00, badge: '5K Resolution', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80' },
      { name: 'Alienware Aurora R16 Gaming Desktop (i9, RTX 4090)', price: 3199.00, orig: 3599.00, badge: 'Liquid Cooled', img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80' },
      { name: 'Secretlab TITAN Evo Ergonomic Gaming Chair', price: 549.00, orig: 599.00, badge: 'Lumbar Support', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80' },
      { name: 'Anker 10-in-1 USB-C Hub Docking Station', price: 69.99, orig: 89.99, badge: 'Multi-Port', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80' },
      { name: 'Corsair Vengeance RGB 64GB DDR5 RAM Kit', price: 219.99, orig: 249.99, badge: 'DDR5 Speed', img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80' }
    ]
  },
  {
    category: 'Fashion & Apparel',
    items: [
      { name: 'Nike Air Jordan 1 Retro High OG (Chicago Red)', price: 180.00, orig: 220.00, badge: 'Hot Deal', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' },
      { name: 'Levi\'s Original Denim Trucker Jacket', price: 89.99, orig: 119.99, badge: 'Classic Style', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80' },
      { name: 'Elegant Emerald Silk Evening Gown', price: 240.00, orig: 320.00, badge: 'Exclusive', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80' },
      { name: 'Luxury Chronograph Stainless Steel Watch', price: 210.00, orig: 290.00, badge: 'LUXE Assured', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80' },
      { name: 'Adidas Ultraboost Light Running Shoes', price: 140.00, orig: 190.00, badge: 'Top Rated', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80' },
      { name: 'Polo Ralph Lauren Classic Fit Oxford Shirt', price: 98.50, orig: 125.00, badge: 'Preppy Icon', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80' },
      { name: 'Ray-Ban Original Wayfarer Sunglasses', price: 163.00, orig: 190.00, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80' },
      { name: 'North Face Thermoball Eco Hooded Jacket', price: 220.00, orig: 260.00, badge: 'Warmth', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80' },
      { name: 'Zara Tailored Double-Breasted Blazer', price: 119.00, orig: 149.00, badge: 'Office Chic', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80' },
      { name: 'Gucci Horsebit Designer Leather Crossbody Bag', price: 1890.00, orig: 2100.00, badge: 'Designer LUXE', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80' },
      { name: 'Tommy Hilfiger Genuine Leather Dress Belt', price: 42.00, orig: 55.00, badge: 'Essential', img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80' },
      { name: 'Calvin Klein Organic Cotton Crewneck T-Shirt (3 Pack)', price: 45.00, orig: 60.00, badge: 'Comfort Fit', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80' },
      { name: 'Puma Suede Classic XXI Unisex Sneakers', price: 75.00, orig: 90.00, badge: 'Heritage', img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80' },
      { name: 'Cashmere Ribbed Knit Beanie & Scarf Set', price: 85.00, orig: 110.00, badge: 'Winter Soft', img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80' },
      { name: 'Birkenstock Arizona Unisex Leather Sandals', price: 110.00, orig: 130.00, badge: 'Comfort Footbed', img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80' },
      { name: 'Organic Cotton Heavyweight Oversized Hoodie', price: 68.00, orig: 89.00, badge: 'Trending', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80' },
      { name: 'New Balance 550 Retro Basketball Sneakers', price: 120.00, orig: 140.00, badge: 'Hype Pick', img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80' },
      { name: 'Fjallraven Kanken Classic Canvas Backpack', price: 85.00, orig: 100.00, badge: 'Nordic Style', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' },
      { name: 'Dr. Martens 1460 Smooth Leather 8-Eye Boots', price: 170.00, orig: 190.00, badge: 'Iconic Boot', img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80' },
      { name: 'Prada Linea Rossa Polarized Aviator Sunglasses', price: 340.00, orig: 390.00, badge: 'High Fashion', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80' },
      { name: 'Uniqlo Ultra Light Down Puffer Jacket', price: 79.90, orig: 99.90, badge: 'Packable', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80' },
      { name: 'Michael Kors Jet Set Large Tote Handbag', price: 178.00, orig: 228.00, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80' },
      { name: 'Lululemon Align High-Rise Leggings 25"', price: 98.00, orig: 118.00, badge: 'Buttery Soft', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80' },
      { name: 'Timberland 6-Inch Premium Waterproof Boots', price: 198.00, orig: 220.00, badge: 'Rugged Style', img: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&q=80' },
      { name: 'Stussy Stock Logo Heavy Fleece Hoodie', price: 118.00, orig: 140.00, badge: 'Streetwear', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80' }
    ]
  },
  {
    category: 'Beauty & Personal Care',
    items: [
      { name: 'Radiant Glow Vitamin C & Hyaluronic Serum', price: 34.99, orig: 49.99, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' },
      { name: 'French Velvet Rose Eau De Parfum (100ml)', price: 95.00, orig: 130.00, badge: 'Luxury Scent', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80' },
      { name: 'Dyson Airwrap Multi-Styler Complete Long', price: 599.99, orig: 649.99, badge: 'Top Rated', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' },
      { name: 'Philips Norelco All-in-One Cordless Trimmer Kit', price: 59.99, orig: 79.99, badge: 'Amazon Choice', img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80' },
      { name: 'CeraVe Hydrating Facial Cleanser (473ml)', price: 16.99, orig: 21.99, badge: 'Dermatologist Recommended', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80' },
      { name: 'Estée Lauder Advanced Night Repair Serum (50ml)', price: 115.00, orig: 135.00, badge: 'Anti-Aging', img: 'https://images.unsplash.com/photo-1608248597261-e4d091444116?w=800&q=80' },
      { name: 'Chanel N°5 Eau de Parfum Vaporisateur Spray', price: 165.00, orig: 185.00, badge: 'Iconic Perfume', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80' },
      { name: 'Olaplex No.3 Hair Perfector Repairing Treatment', price: 30.00, orig: 38.00, badge: 'Hair Bond Repair', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80' },
      { name: 'Urban Decay Naked 3 Eyeshadow Palette', price: 54.00, orig: 65.00, badge: 'Neutrals', img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80' },
      { name: 'L\'Oréal Revitalift 1.5% Pure Hyaluronic Acid Serum', price: 23.99, orig: 32.99, badge: 'Plumping', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' },
      { name: 'Braun Silk-Expert Pro 5 IPL Hair Removal Device', price: 379.99, orig: 429.99, badge: 'Permanent Smooth', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' },
      { name: 'MAC Retro Matte Lipstick (Ruby Woo Icon)', price: 23.00, orig: 28.00, badge: 'Classic Red', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80' },
      { name: 'Sol de Janeiro Brazilian Bum Bum Cream (240ml)', price: 48.00, orig: 56.00, badge: 'Pistachio Salted Caramel', img: 'https://images.unsplash.com/photo-1608248597261-e4d091444116?w=800&q=80' },
      { name: 'Kiehl\'s Ultra Facial Cream with Squalane (125ml)', price: 67.00, orig: 75.00, badge: '24h Hydration', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80' },

      { name: 'La Mer Crème de la Mer Moisturizing Cream', price: 380.00, orig: 420.00, badge: 'Miracle Broth', img: 'https://images.unsplash.com/photo-1608248597261-e4d091444116?w=800&q=80' },
      { name: 'Oral-B iO Series 9 Electric Toothbrush', price: 249.99, orig: 299.99, badge: 'Smart Sensor', img: 'https://images.unsplash.com/photo-1559671980-b55822d28d8b?w=800&q=80' },
      { name: 'Waterpik Aquarius Water Flosser', price: 79.99, orig: 99.99, badge: 'Dental Care', img: 'https://images.unsplash.com/photo-1559671980-b55822d28d8b?w=800&q=80' },
      { name: 'Paula\'s Choice 2% BHA Liquid Salicylic Acid Exfoliant', price: 35.00, orig: 42.00, badge: 'Pore Clearing', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' },
      { name: 'Supergoop! Unseen Sunscreen SPF 40 (73ml)', price: 38.00, orig: 45.00, badge: 'Invisible Sun Protection', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80' },
      { name: 'Maison Francis Kurkdjian Baccarat Rouge 540', price: 325.00, orig: 365.00, badge: 'Luxury Niche', img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80' },
      { name: 'GHD Gold Professional Styler Flat Iron', price: 239.00, orig: 279.00, badge: 'Dual Zone', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' },
      { name: 'Foreo LUNA 4 Smart Facial Cleansing Brush', price: 219.00, orig: 249.00, badge: 'Sonic Pulse', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' },
      { name: 'Moroccanoil Treatment Hair Oil (100ml)', price: 48.00, orig: 55.00, badge: 'Argan Infused', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&q=80' },
      { name: 'The Ordinary Niacinamide 10% + Zinc 1%', price: 10.90, orig: 14.90, badge: 'Blemish Formula', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' },
      { name: 'Charlotte Tilbury Pillow Talk Lip Kit', price: 35.00, orig: 44.00, badge: 'Iconic Nude', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80' }
    ]
  },
  {
    category: 'Sports & Fitness',
    items: [
      { name: 'Adjustable Rubber Coated Dumbbell Set (20kg)', price: 119.99, orig: 159.99, badge: 'Fitness Essential', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80' },
      { name: 'Non-Slip Premium Eco Yoga & Pilates Mat (6mm)', price: 39.95, orig: 59.95, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80' },
      { name: 'Smart Folding Electric Treadmill with LCD Screen', price: 499.00, orig: 649.00, badge: 'Big Savings', img: 'https://images.unsplash.com/photo-1576678927484-cc909957088c?w=800&q=80' },
      { name: 'Bowflex SelectTech 552 Adjustable Dumbbells', price: 429.00, orig: 549.00, badge: '5 to 52 lbs', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80' },
      { name: 'Resistance Bands Set (5 Heavy Duty Exercise Tubes)', price: 29.99, orig: 44.99, badge: 'Home Gym', img: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80' },
      { name: 'Theragun PRO Percussive Therapy Deep Tissue Massager', price: 499.00, orig: 599.00, badge: 'Muscle Recovery', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80' },
      { name: 'Garmin Forerunner 265 Running Smartwatch', price: 449.99, orig: 499.99, badge: 'AMOLED GPS', img: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=800&q=80' },
      { name: 'TRX All-in-One Suspension Trainer System', price: 169.95, orig: 199.95, badge: 'Full Body', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80' },
      { name: 'Concept2 Model D Indoor Rowing Machine with PM5', price: 990.00, orig: 1100.00, badge: 'Rowing Standard', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80' },
      { name: 'Hydro Flask 32 oz Wide Mouth Insulated Bottle', price: 44.95, orig: 54.95, badge: 'Cold 24 Hours', img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80' },
      { name: 'Under Armour Undeniable 5.0 Gym Duffle Bag', price: 45.00, orig: 55.00, badge: 'Water Resistant', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' },
      { name: 'Schwinn IC4 Indoor Cycling Exercise Bike', price: 799.00, orig: 999.00, badge: 'Magnetic Resistance', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80' },
      { name: 'Rogue Fitness AB-3 Adjustable Weight Bench', price: 349.00, orig: 399.00, badge: 'Heavy Duty Steel', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80' },
      { name: 'Manduka PRO Yoga & Pilates Mat (6mm Black)', price: 138.00, orig: 158.00, badge: 'Lifetime Guarantee', img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80' },
      { name: 'Iron Gym Total Upper Body Workout Bar', price: 29.99, orig: 39.99, badge: 'Doorway Pullup', img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80' },
      { name: 'Hyperice Hypervolt 2 Pro Massage Gun', price: 329.00, orig: 399.00, badge: 'Quiet Glide', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80' },
      { name: 'Spalding NBA Official Leather Game Basketball', price: 169.99, orig: 199.99, badge: 'Official Game Ball', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80' },
      { name: 'Wilson Pro Staff 97 v14 Tennis Racket', price: 279.00, orig: 299.00, badge: 'Precision Control', img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80' },
      { name: 'Speedo Vanquisher 2.0 Mirrored Swim Goggles', price: 24.99, orig: 29.99, badge: 'Anti-Fog UV', img: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80' },
      { name: 'Titleist Pro V1 Golf Balls (12 Pack)', price: 54.99, orig: 62.99, badge: '#1 Ball in Golf', img: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80' },
      { name: 'Everlast Pro Style Training Boxing Gloves (16oz)', price: 39.99, orig: 49.99, badge: 'Wrist Support', img: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80' },
      { name: 'Ab Roller Wheel with Knee Pad Mat', price: 19.99, orig: 29.99, badge: 'Core Carver', img: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80' },
      { name: 'Gaiam Yoga Block & Strap Combo Pack', price: 18.99, orig: 24.99, badge: 'Flexibility Helper', img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80' },
      { name: 'Powerblock Elite EXP Adjustable Dumbbells (50 lbs)', price: 419.00, orig: 499.00, badge: 'Compact Gym', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80' },
      { name: 'CamelBak HydroBak Hydration Backpack (1.5L)', price: 55.00, orig: 65.00, badge: 'Running & Biking', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' }
    ]
  },
  {
    category: 'Food & Healthcare',
    items: [
      { name: 'Organic Grass-Fed Whey Protein Isolate (2.2kg)', price: 64.99, orig: 84.99, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80' },
      { name: 'Ceremonial Grade Japanese Matcha Green Tea (100g)', price: 29.99, orig: 39.99, badge: 'Superfood', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80' },
      { name: 'Artisanal Swiss Dark Chocolate Gift Box (24 Pcs)', price: 38.00, orig: 48.00, badge: 'Gourmet Treat', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80' },
      { name: 'Daily Multivitamin & Immunity Softgels (90 Count)', price: 24.95, orig: 34.95, badge: 'Health Essential', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' },
      { name: 'Optimum Nutrition Gold Standard 100% Whey Protein', price: 79.99, orig: 94.99, badge: 'World #1 Whey', img: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80' },
      { name: 'Manuka Honey MGO 400+ Raw New Zealand (500g)', price: 58.00, orig: 72.00, badge: 'Immune Power', img: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800&q=80' },
      { name: 'Vital Proteins Unflavored Collagen Peptides Powder', price: 47.00, orig: 56.00, badge: 'Hair Skin Nails', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' },
      { name: 'Nutiva Organic Cold-Pressed Virgin Coconut Oil (1.6L)', price: 22.99, orig: 29.99, badge: 'Pure Organic', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80' },
      { name: 'Ferrero Rocher Fine Hazelnut Chocolates (48 Pcs)', price: 24.99, orig: 32.99, badge: 'Gift Favorite', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80' },
      { name: 'Nordic Naturals Ultimate Omega 3 Fish Oil (180 Softgels)', price: 49.95, orig: 59.95, badge: 'Heart & Brain Health', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' },
      { name: 'Omron Platinum Wireless Upper Arm Blood Pressure Monitor', price: 79.99, orig: 99.99, badge: 'FDA Cleared', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80' },
      { name: 'Accu-Chek Guide Me Blood Glucose Meter Kit', price: 29.99, orig: 39.99, badge: 'Diabetes Care', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80' },
      { name: 'Nespresso Vertuo Line Master Origin Coffee Pods (50 Ct)', price: 62.50, orig: 75.00, badge: 'Gourmet Roast', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80' },
      { name: 'Celestial Seasonings Herbal Tea Sampler (6 Boxes)', price: 19.99, orig: 26.99, badge: 'Caffeine Free', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80' },
      { name: 'MuscleBlaze Biozyme Performance Whey (2kg Chocolate)', price: 69.99, orig: 89.99, badge: 'Enhanced Absorption', img: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80' },
      { name: 'Kirkland Signature Organic Raw Wildflower Honey (1.36kg)', price: 18.99, orig: 24.99, badge: 'Pure Honey', img: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800&q=80' },
      { name: 'Godiva Chocolatier Gold Rigid Gift Box (36 Pieces)', price: 54.00, orig: 65.00, badge: 'Belgian Heritage', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80' },
      { name: 'Sports Research Organic Apple Cider Vinegar Gummies', price: 19.95, orig: 26.95, badge: 'Gut Health', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' },
      { name: 'Emergen-C 1000mg Vitamin C Super Orange (90 Packets)', price: 29.99, orig: 36.99, badge: 'Fizzy Immune Drink', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' },
      { name: 'Lindt EXCELLENCE 85% Cocoa Dark Chocolate Bar (12 Pack)', price: 39.99, orig: 49.99, badge: 'Intense Cocoa', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80' },
      { name: 'Garden of Life Raw Organic Plant Protein Powder', price: 42.99, orig: 52.99, badge: '100% Vegan', img: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80' },
      { name: 'Nature Made Melatonin 5mg Sleep Support (120 Gummies)', price: 15.99, orig: 21.99, badge: 'Restful Sleep', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' },
      { name: 'Viva Naturals Organic Extra Virgin Coconut Oil', price: 19.99, orig: 24.99, badge: 'Cold-Pressed', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80' },
      { name: 'Keto Friendly Raw Almonds & Macadamia Mix (1kg)', price: 24.99, orig: 32.99, badge: 'Healthy Snack', img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80' },
      { name: 'TheraTears Dry Eye Therapy Lubricant Eye Drops', price: 14.99, orig: 19.99, badge: 'Soothe & Hydrate', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80' }
    ]
  },
  {
    category: 'Toys & Games',
    items: [
      { name: 'LEGO Technic Porsche 911 GT3 RS Building Kit', price: 349.99, orig: 399.99, badge: 'Collector Item', img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80' },
      { name: '4K Camera Foldable GPS Mini Drone for Beginners', price: 189.00, orig: 249.00, badge: 'Hot Gift', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80' },
      { name: 'Catan Strategy Board Game (5th Edition)', price: 44.99, orig: 59.99, badge: 'Top Board Game', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80' },
      { name: 'Giant Soft Teddy Bear Plush Toy (3 Feet)', price: 39.99, orig: 54.99, badge: 'Popular Gift', img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&q=80' },
      { name: 'PlayStation 5 DualSense Wireless Controller (Midnight Black)', price: 69.99, orig: 74.99, badge: 'Haptic Feedback', img: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80' },
      { name: 'Nintendo Switch OLED Model with White Joy-Con', price: 349.99, orig: 379.99, badge: 'Handheld Gaming', img: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80' },
      { name: 'LEGO Star Wars Millennium Falcon Model Set', price: 169.99, orig: 199.99, badge: 'Star Wars Icon', img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80' },
      { name: 'Monopoly Deluxe Edition Board Game with Metallic Tokens', price: 34.99, orig: 44.99, badge: 'Family Night', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80' },
      { name: 'Hot Wheels 20-Car Die-Cast Vehicle Gift Pack', price: 24.99, orig: 32.99, badge: 'Die-Cast Cars', img: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&q=80' },
      { name: 'Barbie Dreamhouse 3-Story Dollhouse with Slide', price: 199.99, orig: 249.99, badge: 'Huge Dollhouse', img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&q=80' },
      { name: 'Nerf Elite 2.0 Commander RD-6 Motorized Blaster', price: 14.99, orig: 19.99, badge: '6 Darts Included', img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80' },
      { name: 'Ticket to Ride Strategy Board Game (North America)', price: 47.99, orig: 59.99, badge: 'Best Seller Game', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80' },
      { name: 'Rubik\'s Connected Bluetooth Smart Speed Cube 3x3', price: 39.95, orig: 49.95, badge: 'App Connected', img: 'https://images.unsplash.com/photo-1591994843349-f415893b3a6b?w=800&q=80' },
      { name: 'Funko Pop! Marvel Iron Man Mark 85 Vinyl Figure', price: 14.99, orig: 19.99, badge: 'Collectible', img: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=800&q=80' },
      { name: '4WD Remote Control High Speed Off-Road Monster Truck', price: 59.99, orig: 79.99, badge: '30 km/h Speed', img: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&q=80' },
      { name: 'UNO Flip! Card Game for Kids & Adults', price: 6.99, orig: 9.99, badge: 'Double Sided', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80' },
      { name: 'Fisher-Price Laugh & Learn Smart Stages Puppy', price: 17.99, orig: 24.99, badge: 'Infant Learning', img: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&q=80' },
      { name: 'Play-Doh Modeling Compound 24-Pack Color Set', price: 21.99, orig: 27.99, badge: 'Creative Play', img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80' },
      { name: 'Exploding Kittens Card Game (Original Party Edition)', price: 19.99, orig: 24.99, badge: 'Hilarious Fun', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80' },
      { name: 'Gartio 10ft Outdoor Trampoline with Safety Enclosure Net', price: 299.99, orig: 379.99, badge: 'Outdoor Fun', img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80' },
      { name: 'Melissa & Doug Wooden Building Blocks Set (100 Pcs)', price: 24.99, orig: 31.99, badge: 'Solid Wood', img: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80' },
      { name: 'Ravensburger Disney Collector Edition 1000 Pc Puzzle', price: 22.99, orig: 29.99, badge: 'Precision Fit', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80' },
      { name: 'Radio Flyer Classic Red Tricycle for Kids', price: 69.99, orig: 89.99, badge: 'Retro Bike', img: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&q=80' },
      { name: 'VTech KidiZoom PrintCam Instant Print Digital Camera', price: 64.99, orig: 79.99, badge: 'Instant Photo', img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80' },
      { name: 'Jenga Classic Hardwood Block Stacking Tower Game', price: 14.99, orig: 19.99, badge: 'Tower Challenge', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&q=80' }
    ]
  },
  {
    category: 'Home & Living',
    items: [
      { name: 'Sony Bravia 55-inch 4K Ultra HD Smart Google TV', price: 649.99, orig: 799.99, badge: 'Big Savings', img: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80' },
      { name: 'Nespresso Vertuo Plus Espresso & Coffee Machine', price: 159.00, orig: 199.00, badge: 'LUXE Assured', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80' },
      { name: 'iRobot Roomba j7+ Self-Emptying Robot Vacuum', price: 599.00, orig: 799.00, badge: 'Obstacle Avoidance', img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80' },
      { name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker (6 Qt)', price: 89.99, orig: 119.99, badge: 'Bestseller', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80' },
      { name: 'Cosori Air Fryer Max XL 5.8 Quart (13 Presets)', price: 99.99, orig: 129.99, badge: '85% Less Oil', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80' },
      { name: 'Philips Hue White & Color Ambiance Smart Starter Kit', price: 179.99, orig: 199.99, badge: 'Voice Control', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80' },
      { name: 'KitchenAid Artisan Series 5-Quart Stand Mixer', price: 379.99, orig: 449.99, badge: 'Baker Pick', img: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80' },
      { name: 'Dyson V15 Detect Cordless Vacuum Cleaner', price: 649.99, orig: 749.99, badge: 'Laser Illumination', img: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80' },
      { name: 'Le Creuset Enameled Cast Iron Dutch Oven (5.5 Qt)', price: 399.95, orig: 449.95, badge: 'French Enamel', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80' },
      { name: 'Vitamix 5200 Professional-Grade Blender (64 oz)', price: 449.95, orig: 529.95, badge: 'Self-Cleaning', img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80' },
      { name: 'Ultrasonic Essential Oil Aroma Diffuser (7 LED)', price: 39.99, orig: 59.99, badge: 'Whisper Quiet', img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80' },
      { name: 'Coop Home Goods Shredded Memory Foam Pillow', price: 72.00, orig: 89.00, badge: 'Adjustable Loft', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80' },
      { name: 'Bialetti Moka Express Stovetop Espresso Maker (6 Cup)', price: 38.99, orig: 49.99, badge: 'Italian Classic', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80' },
      { name: 'Shark FlexStyle Air Drying & Styling System', price: 299.99, orig: 349.99, badge: 'Versatile Dryer', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80' },
      { name: 'Ninja Foodi 10-in-1 XL Pro Air Fry Oven', price: 229.99, orig: 299.99, badge: 'Convection Oven', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80' },
      { name: 'Breville Barista Touch Espresso Machine (Stainless)', price: 999.95, orig: 1099.95, badge: 'Touchscreen Barista', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80' },
      { name: 'Cuisinart 14-Cup Custom Food Processor', price: 229.95, orig: 279.95, badge: 'Stainless Steel Blades', img: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80' },
      { name: 'SodaStream Terra Sparkling Water Maker Bundle', price: 89.99, orig: 109.99, badge: 'Fizz at Home', img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80' },
      { name: 'Zojirushi Neuro Fuzzy Rice Cooker & Warmer (5.5 Cup)', price: 199.99, orig: 239.99, badge: 'Fuzzy Logic', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80' },
      { name: 'Simplehuman 45L Rectangular Hands-Free Step Can', price: 139.99, orig: 169.99, badge: 'Lid Shox Tech', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80' },
      { name: 'Keurig K-Elite Single Serve K-Cup Pod Coffee Maker', price: 149.99, orig: 189.99, badge: 'Iced Coffee Mode', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80' },
      { name: 'Bounty Soft & Heavyweight Egyptian Cotton Towel Set', price: 49.99, orig: 69.99, badge: 'Hotel Quality', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80' },
      { name: 'Lodge 10.25 Inch Cast Iron Skillet with Handle Holder', price: 24.90, orig: 34.90, badge: 'Pre-Seasoned', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80' },
      { name: 'Levoit Core 450S HEPA Air Purifier for Large Rooms', price: 219.99, orig: 259.99, badge: '99.97% Filtration', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80' },
      { name: 'Casper Sleep Original Foam Queen Mattress', price: 895.00, orig: 995.00, badge: 'Zoned Support', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80' }
    ]
  }
];

// Flatten into 200 Products
const mockProducts = [];
let idCounter = 1;

CATEGORY_DEFINITIONS.forEach((catDef) => {
  catDef.items.forEach((item) => {
    mockProducts.push({
      id: idCounter++,
      name: item.name,
      description: item.name + ' — Premium high performance quality product engineered for superior reliability and comfort.',
      price: item.price,
      original_price: item.orig,
      discount_percent: Math.round(((item.orig - item.price) / item.orig) * 100),
      rating: parseFloat((4.5 + Math.random() * 0.4).toFixed(1)),
      reviews_count: Math.floor(500 + Math.random() * 4500),
      badge: item.badge,
      image: item.img,
      category: catDef.category,
      stock: Math.floor(10 + Math.random() * 40),
      created_at: new Date()
    });
  });
});

let mockUsers = [];
let mockCartItems = [];
let mockWishlistItems = [];
let mockOrders = [];
let mockOrderItems = [];
let isUsingMock = false;

// Universal query wrapper
const db = {
  async query(sql, params = []) {
    if (!isUsingMock) {
      try {
        const [results] = await pool.query(sql, params);
        return [results];
      } catch (err) {
        if (['ECONNREFUSED', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'ENOTFOUND'].includes(err.code) || err.message.includes('connect')) {
          console.warn(`[DB WARNING] MySQL error (${err.code}). Falling back to internal mock DB state.`);
          isUsingMock = true;
          return this.queryMock(sql, params);
        }
        throw err;
      }
    } else {
      return this.queryMock(sql, params);
    }
  },

  async queryMock(sql, params) {
    const normalizedSql = sql.trim().toLowerCase();

    // 1. Users Queries
    if (normalizedSql.includes('from users where email =')) {
      const email = params[0];
      const user = mockUsers.find(u => u.email === email);
      return [user ? [user] : []];
    }
    if (normalizedSql.includes('from users where id =')) {
      const id = params[0];
      const user = mockUsers.find(u => u.id === Number(id));
      return [user ? [user] : []];
    }
    if (normalizedSql.includes('insert into users')) {
      const [name, email, password] = params;
      const newUser = { id: mockUsers.length + 1, name, email, password, created_at: new Date() };
      mockUsers.push(newUser);
      return [{ insertId: newUser.id, affectedRows: 1 }];
    }

    // 2. Products Queries
    if (normalizedSql.includes('from products')) {
      let filtered = [...mockProducts];

      // single product detail
      if (normalizedSql.includes('where p.id =') || normalizedSql.includes('where id =')) {
        const productId = Number(params[0]);
        const product = filtered.find(p => p.id === productId);
        if (!product) return [[]];

        let liked = false;
        if (params.length > 1) {
          const userId = Number(params[1]);
          liked = mockWishlistItems.some(w => w.user_id === userId && w.product_id === productId);
        }
        return [[{ ...product, liked: liked ? 1 : 0 }]];
      }

      let userId = null;
      let categoryParam = null;
      let searchParam = null;

      params.forEach(param => {
        if (typeof param === 'number') userId = param;
        else if (typeof param === 'string') {
          if (param.startsWith('%') && param.endsWith('%')) searchParam = param.replace(/%/g, '').toLowerCase();
          else categoryParam = param;
        }
      });

      if (categoryParam) {
        filtered = filtered.filter(p => p.category.toLowerCase() === categoryParam.toLowerCase());
      }
      if (searchParam) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchParam) || (p.description && p.description.toLowerCase().includes(searchParam)));
      }

      const results = filtered.map(p => {
        const liked = userId ? mockWishlistItems.some(w => w.user_id === userId && w.product_id === p.id) : false;
        return { ...p, liked: liked ? 1 : 0 };
      });
      return [results];
    }

    // 3. Cart Queries
    if (normalizedSql.includes('from cart_items') && normalizedSql.includes('join products')) {
      const userId = Number(params[0]);
      const items = mockCartItems
        .filter(c => c.user_id === userId)
        .map(c => {
          const p = mockProducts.find(prod => prod.id === c.product_id);
          return {
            id: c.id,
            user_id: c.user_id,
            product_id: c.product_id,
            quantity: c.quantity,
            name: p ? p.name : 'Unknown Product',
            price: p ? p.price : 0,
            image: p ? p.image : '',
            stock: p ? p.stock : 0,
            category: p ? p.category : ''
          };
        });
      return [items];
    }
    if (normalizedSql.includes('from cart_items where user_id =') && normalizedSql.includes('product_id =')) {
      const [userId, productId] = params.map(Number);
      const item = mockCartItems.find(c => c.user_id === userId && c.product_id === productId);
      return [item ? [item] : []];
    }
    if (normalizedSql.includes('insert into cart_items')) {
      const [userId, productId, qty] = params.map(Number);
      const existing = mockCartItems.find(c => c.user_id === userId && c.product_id === productId);
      if (existing) {
        existing.quantity += qty;
        return [{ affectedRows: 1 }];
      } else {
        const newItem = { id: mockCartItems.length + 1, user_id: userId, product_id: productId, quantity: qty, created_at: new Date() };
        mockCartItems.push(newItem);
        return [{ insertId: newItem.id, affectedRows: 1 }];
      }
    }
    if (normalizedSql.includes('update cart_items set quantity =')) {
      const [qty, userId, productId] = params.map(Number);
      const item = mockCartItems.find(c => c.user_id === userId && c.product_id === productId);
      if (item) {
        item.quantity = qty;
        return [{ affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    if (normalizedSql.includes('delete from cart_items where user_id =') && normalizedSql.includes('product_id =')) {
      const [userId, productId] = params.map(Number);
      const initialLen = mockCartItems.length;
      mockCartItems = mockCartItems.filter(c => !(c.user_id === userId && c.product_id === productId));
      return [{ affectedRows: initialLen - mockCartItems.length }];
    }
    if (normalizedSql.includes('delete from cart_items where user_id =')) {
      const userId = Number(params[0]);
      const initialLen = mockCartItems.length;
      mockCartItems = mockCartItems.filter(c => c.user_id !== userId);
      return [{ affectedRows: initialLen - mockCartItems.length }];
    }

    // 4. Wishlist Queries
    if (normalizedSql.includes('from wishlist_items') && normalizedSql.includes('join products')) {
      const userId = Number(params[0]);
      const items = mockWishlistItems
        .filter(w => w.user_id === userId)
        .map(w => {
          const p = mockProducts.find(prod => prod.id === w.product_id);
          return {
            id: w.id,
            user_id: w.user_id,
            product_id: w.product_id,
            created_at: w.created_at,
            name: p ? p.name : 'Unknown Product',
            price: p ? p.price : 0,
            image: p ? p.image : '',
            stock: p ? p.stock : 0,
            category: p ? p.category : '',
            description: p ? p.description : ''
          };
        });
      return [items];
    }
    if (normalizedSql.includes('insert into wishlist_items') || normalizedSql.includes('insert ignore into wishlist_items')) {
      const [userId, productId] = params.map(Number);
      const existing = mockWishlistItems.find(w => w.user_id === userId && w.product_id === productId);
      if (!existing) {
        const newItem = { id: mockWishlistItems.length + 1, user_id: userId, product_id: productId, created_at: new Date() };
        mockWishlistItems.push(newItem);
        return [{ insertId: newItem.id, affectedRows: 1 }];
      }
      return [{ affectedRows: 0 }];
    }
    if (normalizedSql.includes('delete from wishlist_items where user_id =') && normalizedSql.includes('product_id =')) {
      const [userId, productId] = params.map(Number);
      const initialLen = mockWishlistItems.length;
      mockWishlistItems = mockWishlistItems.filter(w => !(w.user_id === userId && w.product_id === productId));
      return [{ affectedRows: initialLen - mockWishlistItems.length }];
    }

    // 5. Orders Queries
    if (normalizedSql.includes('insert into orders')) {
      const [userId, totalAmount, shippingAddress] = params;
      const newOrder = {
        id: mockOrders.length + 1001,
        user_id: Number(userId),
        total_amount: Number(totalAmount),
        status: 'paid',
        shipping_address: typeof shippingAddress === 'object' ? `${shippingAddress.name}, ${shippingAddress.address}, ${shippingAddress.city} - ${shippingAddress.pincode}` : (shippingAddress || 'Standard Delivery'),
        created_at: new Date()
      };
      mockOrders.push(newOrder);
      return [{ insertId: newOrder.id, affectedRows: 1 }];
    }
    if (normalizedSql.includes('insert into order_items')) {
      const orderId = Number(params[0]);
      const productId = Number(params[1]);
      const qty = Number(params[2]);
      const price = Number(params[3]);
      const newItem = { id: mockOrderItems.length + 1, order_id: orderId, product_id: productId, quantity: qty, price };
      mockOrderItems.push(newItem);
      return [{ insertId: newItem.id, affectedRows: 1 }];
    }
    if (normalizedSql.includes('from orders') && normalizedSql.includes('where user_id =')) {
      const userId = Number(params[0]);
      const userOrders = mockOrders
        .filter(o => o.user_id === userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return [userOrders];
    }
    if (normalizedSql.includes('from orders') && normalizedSql.includes('where id =')) {
      const orderId = Number(params[0]);
      const userId = Number(params[1]);
      const order = mockOrders.find(o => o.id === orderId && o.user_id === userId);
      if (!order) return [[]];

      const items = mockOrderItems
        .filter(oi => oi.order_id === orderId)
        .map(oi => {
          const p = mockProducts.find(prod => prod.id === oi.product_id);
          return {
            ...oi,
            name: p ? p.name : 'Product',
            image: p ? p.image : ''
          };
        });

      return [[{ ...order, items }]];
    }

    return [[]];
  }
};

module.exports = db;
