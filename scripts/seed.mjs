import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ReWear Luxury Rental Boutique database...');

  // 1. Clean existing records
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteContent.deleteMany();

  // 2. Seed Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Rohan Singhania (Head Stylist)',
      email: 'admin@rewear.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+91 98201 44552',
      isActive: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Priya Sharma (Bride-to-Be)',
      email: 'user@rewear.com',
      passwordHash: userPasswordHash,
      role: 'CUSTOMER',
      phone: '+91 98450 12345',
      isActive: true,
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Arjun Mehra',
      email: 'arjun@rewear.com',
      passwordHash: userPasswordHash,
      role: 'CUSTOMER',
      phone: '+91 97110 98765',
      isActive: true,
    },
  });

  // Seed addresses for customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'Priya Sharma',
      addressLine1: 'Villa 14, Palm Meadows, Whitefield',
      addressLine2: 'Near Forum Value Mall',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560066',
      country: 'India',
      phone: '+91 98450 12345',
      isDefault: true,
    },
  });

  // 3. Seed Rental Categories
  const categoriesData = [
    {
      name: 'Bridal & Wedding Lehengas',
      slug: 'bridal-lehengas',
      description: 'Heirloom zardozi velvet lehengas, pastel organza bridal ensembles, and hand-embroidered silhouettes for pheras and weddings.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 1,
    },
    {
      name: 'Groom & Royal Sherwanis',
      slug: 'groom-sherwanis',
      description: 'Embroidered raw silk achkans, nawabi angrakha sherwanis, and jodhpuri bandhgalas crafted for grooms and baraatis.',
      image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 2,
    },
    {
      name: 'Cocktail & Reception Gowns',
      slug: 'cocktail-gowns',
      description: 'Floor-sweeping trails, structured corset silhouettes, and scintillating metallic sequin gowns for red carpet receptions.',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 3,
    },
    {
      name: 'Sangeet & Mehendi Ensembles',
      slug: 'sangeet-mehendi',
      description: 'Vibrant mirror-work ghagras, tiered kalidar anarkalis, and breezy floral silk kurta sets for lively dancing nights.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 4,
    },
    {
      name: 'Tuxedos & Bandhgalas',
      slug: 'tuxedos-bandhgalas',
      description: 'Italian velvet dinner jackets, black tie notch-lapel tuxedos, and silk-threaded prince coats for formal wedding banquets.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 5,
    },
    {
      name: 'Jewellery & Royal Accents',
      slug: 'jewellery-accessories',
      description: 'Authentic 22K gold-plated Kundan choker sets, polki mathapattis, regal safas, and pearl malas to complete your look.',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1200&auto=format&fit=crop',
      displayOrder: 6,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }

  // Common sizes and durations
  const womenVariants = JSON.stringify([
    { name: 'Fit Size', options: ['XS (Bust 32)', 'S (Bust 34)', 'M (Bust 36)', 'L (Bust 38)', 'XL (Bust 40)', 'Custom Measurements'] },
    { name: 'Rental Period', options: ['3 Days Rental', '7 Days Rental (+₹1,500)', '10 Days Rental (+₹2,500)'] }
  ]);

  const menVariants = JSON.stringify([
    { name: 'Chest Size', options: ['38 Regular', '40 Regular', '42 Regular', '44 Regular', 'Custom Fitted'] },
    { name: 'Rental Period', options: ['3 Days Rental', '7 Days Rental (+₹1,500)', '10 Days Rental (+₹2,500)'] }
  ]);

  const jewelleryVariants = JSON.stringify([
    { name: 'Rental Period', options: ['3 Days Rental', '7 Days Rental (+₹500)'] }
  ]);

  // 4. Seed 33 Boutique Rental Products (prices ₹500 to ₹20,000)
  const productsData = [
    // 1. Bridal & Wedding Lehengas
    {
      name: 'Imperial Crimson Velvet Zardozi Bridal Lehenga',
      slug: 'imperial-crimson-velvet-bridal-lehenga',
      description: 'An iconic bridal lehenga handcrafted in deep mulberry velvet, embroidered with heavy dabka, zardozi, and resham floral motifs. Comes with double dupattas in sheer organza and tissue.',
      craftsmanship: 'Over 480 artisan hours of hand-embroidery. Sanitized with hospital-grade eco dry cleaning between bookings.',
      materials: 'Micro-velvet lehenga skirt, Raw silk blouse, Handcrafted French wire zardozi, Glass bead tassels.',
      origin: 'Chandni Chowk Atelier, New Delhi',
      careInstructions: 'Zero maintenance required by you. Keep in provided hanger bag; our team handles pickup and steam sanitization.',
      price: 18500,
      originalPrice: 165000,
      rating: 5.0,
      reviewsCount: 38,
      stock: 4,
      isFeatured: true,
      isNewArrival: false,
      categoryId: categories['bridal-lehengas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Noor Rose Dust Pastel Floral Bridal Lehenga',
      slug: 'noor-rose-dust-pastel-bridal-lehenga',
      description: 'Bespoke daydream bridal ensemble in antique blush pink featuring 16 kalis embroidered with fine pearls, silver threadwork, and Swarovski crystal dewdrops.',
      craftsmanship: 'Featherweight multi-layer can-can underskirt for natural royal flare without heavy weight.',
      materials: 'Pure Raw Silk, Silver tilla, Cutdana, Mother of pearl sequins, Italian tulle veil.',
      origin: 'Jaipur, Rajasthan',
      careInstructions: 'Delivered in steam-pressed garment trunk 48 hours prior to your wedding day.',
      price: 16999,
      originalPrice: 145000,
      rating: 4.9,
      reviewsCount: 29,
      stock: 3,
      isFeatured: true,
      isNewArrival: true,
      categoryId: categories['bridal-lehengas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Emerald Royal Heritage Banarasi Silk Lehenga',
      slug: 'emerald-heritage-banarasi-silk-lehenga',
      description: 'Woven with gold and silver kadwa zari over pure katan silk, paired with an embroidered sweetheart blouse and a scalloped organza dupatta.',
      craftsmanship: 'Handloom certified Varanasi weave finished with hand-dyed latkans.',
      materials: 'Pure Katan Silk, Gold Zari, Pure Chiffon dupatta.',
      origin: 'Varanasi & Lucknow Atelier',
      careInstructions: 'Complimentary alteration kit and safety pins provided in ReWear travel kit.',
      price: 11500,
      originalPrice: 95000,
      rating: 4.9,
      reviewsCount: 22,
      stock: 5,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['bridal-lehengas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Sunehri Golden Tissue Pheras Lehenga',
      slug: 'sunehri-golden-tissue-pheras-lehenga',
      description: 'Luminous metallic tissue lehenga that glimmers warmly under mandap flames. Features antique marodi work and an unstitched waist tie for adjustable comfort.',
      craftsmanship: 'Custom tailored waist and blouse padding customized upon reservation.',
      materials: 'Handwoven metallic tissue, Resham, Dull antique gold gota patti.',
      origin: 'Ahmedabad, Gujarat',
      careInstructions: 'Sanitized and sealed in protective garment bag.',
      price: 14200,
      originalPrice: 120000,
      rating: 4.8,
      reviewsCount: 16,
      stock: 3,
      isFeatured: true,
      isNewArrival: true,
      categoryId: categories['bridal-lehengas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Ivory & Gold Lucknowi Chikankari Bridal Set',
      slug: 'ivory-lucknowi-chikankari-bridal-set',
      description: 'Intricate Lucknowi shadow-work chikankari embellished with mukaish and baby pearls over an ivory georgette base with a blush pink contrast veil.',
      craftsmanship: 'Handcrafted by master Lucknow karigars. Ultra-soft inner satin lining.',
      materials: 'Pure Viscose Georgette, Mukaish badla, Pearl embroidery.',
      origin: 'Lucknow, Uttar Pradesh',
      careInstructions: 'Complimentary return door-step pickup after wedding function.',
      price: 12900,
      originalPrice: 110000,
      rating: 5.0,
      reviewsCount: 19,
      stock: 4,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['bridal-lehengas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },

    // 2. Groom & Royal Sherwanis
    {
      name: 'Nawabi Ivory Raw Silk Hand-Embroidered Sherwani',
      slug: 'nawabi-ivory-raw-silk-groom-sherwani',
      description: 'A sovereign groom ensemble in hand-spun raw silk featuring all-over subtle tone-on-tone resham and cutdana embroidery. Includes matching churidar, stole, and safa fabric.',
      craftsmanship: 'Concealed button placket with jeweled detachable buttons. Tailored with structured horsehair canvas.',
      materials: '100% Pure Raw Silk, Japanese micro-beads, Silk organza stole.',
      origin: 'Kolkata, West Bengal',
      careInstructions: 'Custom shoulder and sleeve alteration included in rental price.',
      price: 9999,
      originalPrice: 85000,
      rating: 4.9,
      reviewsCount: 42,
      stock: 6,
      isFeatured: true,
      isNewArrival: false,
      categoryId: categories['groom-sherwanis'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },
    {
      name: 'Royal Heritage Velvet Jodhpur Achkan',
      slug: 'royal-heritage-velvet-jodhpur-achkan',
      description: 'Deep midnight navy velvet achkan adorned with antique gold crested metal buttons and intricate mandarin collar zardozi embroidery.',
      craftsmanship: 'Structured bespoke silhouette designed to elongate posture. Includes silk peshwaj lining.',
      materials: 'Plush Italian velvet, Gold bullion embroidery, Bemberg lining.',
      origin: 'Jodhpur, Rajasthan',
      careInstructions: 'Delivered in moisture-free wooden hanger bag.',
      price: 8499,
      originalPrice: 72000,
      rating: 4.8,
      reviewsCount: 26,
      stock: 5,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['groom-sherwanis'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },
    {
      name: 'Muted Sage Green Floral Embroidered Angrakha',
      slug: 'sage-green-floral-groom-angrakha',
      description: 'A modern day-wedding groom silhouette with asymmetric overlapping front tie-ups and delicate ivory threadwork across the hem and cuffs.',
      craftsmanship: 'Breathable lightweight silk blend ideal for outdoor beach and destination weddings.',
      materials: 'Matka Silk, Fine resham embroidery, Cotton silk lining.',
      origin: 'Mumbai Atelier',
      careInstructions: 'Doorstep measurement trial available in metro cities.',
      price: 7499,
      originalPrice: 65000,
      rating: 4.9,
      reviewsCount: 18,
      stock: 4,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['groom-sherwanis'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },
    {
      name: 'Maharaja Brocade Gold Jacquard Sherwani Set',
      slug: 'maharaja-brocade-gold-sherwani-set',
      description: 'Woven in antique gold Banarasi brocade with traditional paisley bootas. Accompanied by maroon velvet kamarbandh and pearl necklace.',
      craftsmanship: 'Regal silhouette with reinforced lapels and padded shoulders.',
      materials: 'Pure Brocade Silk, Micro-velvet accents, Zari threads.',
      origin: 'Varanasi Atelier',
      careInstructions: 'Professional steam pressed before delivery.',
      price: 10999,
      originalPrice: 92000,
      rating: 5.0,
      reviewsCount: 31,
      stock: 3,
      isFeatured: true,
      isNewArrival: true,
      categoryId: categories['groom-sherwanis'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },

    // 3. Cocktail & Reception Gowns
    {
      name: 'Starlight Champagne Sequin Corset Evening Gown',
      slug: 'starlight-champagne-sequin-corset-gown',
      description: 'A dazzling red-carpet couture gown engineered with internal boning for waist synching, an asymmetric thigh-high slit, and a cascading trailing train.',
      craftsmanship: 'Hand-sewn micro sequins that catch stage light without snagging or shedding.',
      materials: 'Stretch Italian lurex, High-density sequins, Internal corset boning.',
      origin: 'Bandra Atelier, Mumbai',
      careInstructions: 'Free alternate size shipped if measurements feel snug.',
      price: 6499,
      originalPrice: 58000,
      rating: 4.9,
      reviewsCount: 45,
      stock: 7,
      isFeatured: true,
      isNewArrival: false,
      categoryId: categories['cocktail-gowns'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Midnight Black Sculpted Mermaid Trail Gown',
      slug: 'midnight-black-sculpted-mermaid-gown',
      description: 'Sculptural architectural evening gown with one-shoulder dramatic winged cape and a body-contouring mermaid silhouette.',
      craftsmanship: 'Double bonded crepe fabric that sculpts and smooths effortlessly.',
      materials: 'Heavy Japanese crepe, Invisible YKK back closure.',
      origin: 'New Delhi Studio',
      careInstructions: 'Hanger with custom garment bag included.',
      price: 5499,
      originalPrice: 48000,
      rating: 4.8,
      reviewsCount: 34,
      stock: 6,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['cocktail-gowns'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Ruby Scarlet Pleated Organza Ballgown',
      slug: 'ruby-scarlet-pleated-organza-ballgown',
      description: 'Dramatic tiered ballroom gown with 40 meters of knife-pleated crimson organza, sweetheart neckline, and detachable puff sleeves.',
      craftsmanship: 'Engineered lightweight crinoline cage provides ballroom volume without heavy weight.',
      materials: 'Glass organza, Satin base, French horsehair hem braid.',
      origin: 'Bengaluru Atelier',
      careInstructions: 'Sanitized and pre-steamed before dispatch.',
      price: 7999,
      originalPrice: 75000,
      rating: 5.0,
      reviewsCount: 20,
      stock: 3,
      isFeatured: true,
      isNewArrival: false,
      categoryId: categories['cocktail-gowns'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Emerald Metallic Foil Draped Reception Saree-Gown',
      slug: 'emerald-metallic-draped-saree-gown',
      description: 'The elegance of a pre-stitched pleated saree merged with modern red-carpet gown architecture. Zero draping hassle with instant zip closure.',
      craftsmanship: 'Pre-pleated pallu anchored with hand-embroidered crystal brooch.',
      materials: 'Metallic liquid foil jersey, Cutdana embellishment.',
      origin: 'Mumbai Atelier',
      careInstructions: 'Wear directly out of the box — zero pinning required.',
      price: 4999,
      originalPrice: 44000,
      rating: 4.9,
      reviewsCount: 38,
      stock: 8,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['cocktail-gowns'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },

    // 4. Sangeet & Mehendi Ensembles
    {
      name: 'Sunflower Yellow Mirror-Work Sangeet Ghagra',
      slug: 'sunflower-yellow-mirror-work-sangeet-ghagra',
      description: 'Joyous mustard yellow ghagra adorned with hundreds of genuine hand-set abhla mirrors that spin dazzlingly on the dance floor. Accompanied by a tasselled halter choli.',
      craftsmanship: 'Reinforced mirror settings guarantee zero detachment during energetic dances.',
      materials: 'Georgette skirt, Real mirrors, Resham threadwork, Organza dupatta.',
      origin: 'Kutch & Jaipur Atelier',
      careInstructions: 'Pre-hemmed to standard 42 inch length with adjustable waistband.',
      price: 3999,
      originalPrice: 38000,
      rating: 4.9,
      reviewsCount: 52,
      stock: 9,
      isFeatured: true,
      isNewArrival: false,
      categoryId: categories['sangeet-mehendi'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Mint Teal Botanical Tiered Anarkali Set',
      slug: 'mint-teal-botanical-tiered-anarkali-set',
      description: 'Floor-length flared anarkali featuring hand-painted botanical gulmohar blossoms accented with gota patti and zardozi yolk embroidery. Paired with churidar and scallop dupatta.',
      craftsmanship: 'Over 28 meters of flare for breathtaking spinning photos.',
      materials: 'Pure Chanderi Silk, Mulmul lining, Handcrafted gota lace.',
      origin: 'Chanderi & Jaipur',
      careInstructions: 'Eco-friendly dry cleaned and scented with organic rosewater.',
      price: 3499,
      originalPrice: 32000,
      rating: 4.8,
      reviewsCount: 27,
      stock: 8,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['sangeet-mehendi'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Fuchsia Rani Pink Sharara Suit with Gota Patti',
      slug: 'fuchsia-rani-pink-sharara-suit',
      description: 'Peppy traditional 3-piece sharara set with short peplum kurti and exaggerated kalidar flared sharara pants bordered with heritage dori work.',
      craftsmanship: 'Lightweight elasticated waistband for maximum dance movement.',
      materials: 'Crepe silk, Lappa lace, Pure cotton voile lining.',
      origin: 'Jaipur, Rajasthan',
      careInstructions: 'Ready-to-wear with pre-adjusted blouse cups.',
      price: 2999,
      originalPrice: 28000,
      rating: 4.7,
      reviewsCount: 31,
      stock: 10,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['sangeet-mehendi'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Men’s Mustard Mehendi Silk Kurta & Bundi Jacket',
      slug: 'mens-mustard-mehendi-silk-kurta-bundi',
      description: 'Gentleman’s festive outfit featuring a raw silk embroidered bundi waistcoat paired over a crisp off-white tailored kurta and slim churidar.',
      craftsmanship: 'Tailored with metallic crest buttons and pocket square detail.',
      materials: 'Art Raw Silk, Cotton lining, Antique brass buttons.',
      origin: 'Delhi Atelier',
      careInstructions: 'Sanitized with UV-C garment sanitization.',
      price: 2499,
      originalPrice: 22000,
      rating: 4.9,
      reviewsCount: 36,
      stock: 12,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['sangeet-mehendi'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },

    // 5. Tuxedos & Bandhgalas
    {
      name: 'Royal Black Velvet Jodhpuri Bandhgala Suit',
      slug: 'royal-black-velvet-jodhpuri-bandhgala',
      description: 'The pinnacle of formal Indian wedding elegance. Features a closed high neck collar with matte black satin piping and tailored slim-fit formal trousers.',
      craftsmanship: 'Hand-basted canvas chest piece for perfect drape across shoulders.',
      materials: 'Super 120s Italian Wool & Micro-velvet blend, Mother of pearl buttons.',
      origin: 'Savile Row Trained Master Tailor, Mumbai',
      careInstructions: 'Pants altered to your exact inseam length upon booking.',
      price: 5999,
      originalPrice: 52000,
      rating: 5.0,
      reviewsCount: 40,
      stock: 8,
      isFeatured: true,
      isNewArrival: false,
      categoryId: categories['tuxedos-bandhgalas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },
    {
      name: 'Midnight Blue Shawl-Lapel Black Tie Tuxedo',
      slug: 'midnight-blue-shawl-lapel-tuxedo',
      description: 'Classic western cocktail tuxedo jacket in rich midnight blue wool with black silk grosgrain shawl lapels. Complete with formal pleated shirt, bowtie, and trousers.',
      craftsmanship: 'Includes cummerbund, silk bow tie, and cufflink set.',
      materials: 'Pure Merino Wool, Pure Mulberry Silk lapels.',
      origin: 'Milan & Mumbai Workshop',
      careInstructions: 'Pre-steamed and wrinkle-resistant packaging.',
      price: 5499,
      originalPrice: 48000,
      rating: 4.8,
      reviewsCount: 29,
      stock: 6,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['tuxedos-bandhgalas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },
    {
      name: 'Wine Burgundy Jacquard Prince Coat',
      slug: 'wine-burgundy-jacquard-prince-coat',
      description: 'Tailored evening bandhgala with subtle woven self-jacquard pattern, pocket square, and matching charcoal tailored trousers.',
      craftsmanship: 'Deep wine tone that stands out elegantly under banquet hall chandeliers.',
      materials: 'Wool-silk blend jacquard, Horn buttons.',
      origin: 'Bengaluru Tailoring Studio',
      careInstructions: 'Delivered ready to wear.',
      price: 4499,
      originalPrice: 38000,
      rating: 4.9,
      reviewsCount: 21,
      stock: 7,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['tuxedos-bandhgalas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },

    // 6. Jewellery & Royal Accents (Budget friendly from ₹500 to ₹3,500)
    {
      name: 'Maharani Uncut Polki Kundan Choker Bridal Suite',
      slug: 'maharani-uncut-polki-kundan-choker-set',
      description: '22K yellow gold-plated antique bridal choker with hand-strung emerald droplets, matching heavy jhumkas, and a delicate maang tikka.',
      craftsmanship: 'Handcrafted with foil-backed uncut glass polki stones on meenakari enamel frame.',
      materials: 'Brass base, 22K Gold electroplating, Hydro emerald beads, Shell pearls.',
      origin: 'Jaipur Jewellery Atelier',
      careInstructions: 'Comes in velvet jewellery box. Simply pack back into box after event.',
      price: 2499,
      originalPrice: 28000,
      rating: 5.0,
      reviewsCount: 48,
      stock: 10,
      isFeatured: true,
      isNewArrival: false,
      categoryId: categories['jewellery-accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: jewelleryVariants,
    },
    {
      name: 'Royal Groom Pearl & Emerald Seven-String Haar',
      slug: 'royal-groom-pearl-emerald-seven-string-haar',
      description: 'Seven-row graduated faux South Sea pearl necklace interspersed with carved emerald spacers designed to drape over sherwanis.',
      craftsmanship: 'Knotted on silk thread with antique gold brocade chord tie.',
      materials: 'High-lustre shell pearls, Carved hydro emeralds, Gold plated spacers.',
      origin: 'Hyderabad Atelier',
      careInstructions: 'Store flat in cotton pouch.',
      price: 999,
      originalPrice: 12000,
      rating: 4.9,
      reviewsCount: 35,
      stock: 15,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['jewellery-accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: jewelleryVariants,
    },
    {
      name: 'Royal Heritage Groom Kalgi & Brooch Set',
      slug: 'royal-heritage-groom-kalgi-brooch-set',
      description: 'Feather plume turban jewel (Kalgi) encrusted with emerald green stones and rubies to pin onto the wedding safa.',
      craftsmanship: 'Sturdy safety pin clasp that attaches securely without tearing fabric.',
      materials: 'Gold finished metal, Cz crystals, Natural white plume feather.',
      origin: 'Jaipur',
      careInstructions: 'Pack in provided protective casing.',
      price: 699,
      originalPrice: 7500,
      rating: 4.8,
      reviewsCount: 22,
      stock: 20,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['jewellery-accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: jewelleryVariants,
    },
    {
      name: 'Handcrafted Zardozi Bridal Potli Bag',
      slug: 'handcrafted-zardozi-bridal-potli-bag',
      description: 'Raw silk drawstring potli with heavy golden bead tassels and pearl handle to carry essentials on wedding night.',
      craftsmanship: 'Hand-embroidered zardozi floral vines.',
      materials: 'Raw silk, Beads, Zari, Pearl handle.',
      origin: 'Delhi',
      careInstructions: 'Pack back into bag after function.',
      price: 500,
      originalPrice: 4500,
      rating: 4.7,
      reviewsCount: 41,
      stock: 25,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['jewellery-accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: jewelleryVariants,
    },
    {
      name: 'Chandbali Diamond-Look Sangeet Earrings',
      slug: 'chandbali-diamond-look-sangeet-earrings',
      description: 'Crescent moon shaped oversized statement earrings set with faux polki and pearl drops.',
      craftsmanship: 'Anti-allergy nickel free plating with soft silicone ear supports.',
      materials: 'Brass alloy, Micro pearls, Cz stones.',
      origin: 'Mumbai',
      careInstructions: 'Wipe with soft cloth.',
      price: 799,
      originalPrice: 8500,
      rating: 4.9,
      reviewsCount: 33,
      stock: 14,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['jewellery-accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: jewelleryVariants,
    },
    {
      name: 'Royal Chanderi Silk Wedding Safa / Turban',
      slug: 'royal-chanderi-silk-wedding-safa',
      description: 'Pre-tied ready-to-wear wedding turban in pastel peach with golden zari border. Fits all head sizes comfortably.',
      craftsmanship: 'Structured inner ring for comfortable all-day wear without headaches.',
      materials: 'Pure Chanderi Silk, Zari lace.',
      origin: 'Rajasthan',
      careInstructions: 'Store in hat box provided.',
      price: 899,
      originalPrice: 6500,
      rating: 4.8,
      reviewsCount: 29,
      stock: 15,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['jewellery-accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: jewelleryVariants,
    },
    // Additional items to round out 32 items
    {
      name: 'Lavender Whisper Sequinned Reception Lehenga',
      slug: 'lavender-whisper-sequin-reception-lehenga',
      description: 'Modern pastel lavender lehenga skirt drenched in self-colored sequins and French knots. Complemented by an off-shoulder corset.',
      craftsmanship: 'High impact reception glamour with featherlight weight for non-stop dancing.',
      materials: 'Net, Satin lining, Holographic micro-sequins.',
      origin: 'Mumbai Atelier',
      careInstructions: 'Sanitized with dry clean guarantee.',
      price: 13500,
      originalPrice: 115000,
      rating: 4.9,
      reviewsCount: 17,
      stock: 4,
      isFeatured: true,
      isNewArrival: true,
      categoryId: categories['bridal-lehengas'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Ivory Chikankari Kurta & Silk Dhoti Set',
      slug: 'ivory-chikankari-kurta-dhoti-set',
      description: 'Classic haldi and pooja occasion outfit with hand-embroidered mukaish chikankari kurta and pre-stitched pleated silk dhoti.',
      craftsmanship: 'Elasticated dhoti with drawstring comfort.',
      materials: 'Pure Georgette, Art Silk dhoti.',
      origin: 'Lucknow',
      careInstructions: 'Steam sanitized before handover.',
      price: 2199,
      originalPrice: 20000,
      rating: 4.8,
      reviewsCount: 15,
      stock: 8,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['sangeet-mehendi'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: menVariants,
    },
    {
      name: 'Regal Polki Mathapatti Headpiece',
      slug: 'regal-polki-mathapatti-headpiece',
      description: 'Traditional multi-tier bridal forehead ornament with hanging pearls and kundan flowers.',
      craftsmanship: 'Includes hairpins and loops for secure hairstylist placement.',
      materials: 'Brass, Gold foil, Kundan, Pearls.',
      origin: 'Jaipur',
      careInstructions: 'Pack in jewellery case.',
      price: 1199,
      originalPrice: 14000,
      rating: 5.0,
      reviewsCount: 22,
      stock: 12,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['jewellery-accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: jewelleryVariants,
    },
    {
      name: 'Velvet Shawl with Antique Embroidered Borders',
      slug: 'velvet-shawl-antique-embroidered-borders',
      description: 'Unisex groom / royal guest velvet shawl in bottle green with 4-inch heavy tilla embroidered border.',
      craftsmanship: 'Adds instant nawabi grandeur to any plain sherwani or kurta.',
      materials: 'Plush velvet, Golden tilla work.',
      origin: 'Kashmir',
      careInstructions: 'Dry clean included.',
      price: 1499,
      originalPrice: 15000,
      rating: 4.9,
      reviewsCount: 19,
      stock: 10,
      isFeatured: false,
      isNewArrival: false,
      categoryId: categories['jewellery-accessories'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: jewelleryVariants,
    },
    {
      name: 'Midnight Sequin Pre-Draped Concept Saree',
      slug: 'midnight-sequin-pre-draped-concept-saree',
      description: 'Ready in 30 seconds! Shimmering midnight navy pleated saree with structured ruffled palla and sequin sweetheart blouse.',
      craftsmanship: 'No pleating or pins required; simply hook around waist and throw palla.',
      materials: 'Lycra sequin blend, Crepe lining.',
      origin: 'Surat & Mumbai',
      careInstructions: 'Pack into garment bag.',
      price: 3899,
      originalPrice: 34000,
      rating: 4.8,
      reviewsCount: 27,
      stock: 9,
      isFeatured: true,
      isNewArrival: true,
      categoryId: categories['cocktail-gowns'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
    {
      name: 'Blush Pink Organza Floral Sangeet Lehenga',
      slug: 'blush-pink-organza-floral-sangeet-lehenga',
      description: 'Airy, dancing-friendly organza skirt printed with dreamy watercolor roses and highlighted with subtle silver sequin embroidery.',
      craftsmanship: 'Lightweight volume that does not tire you out on the sangeet stage.',
      materials: 'Pure Silk Organza, Satin underlayer, Handcrafted can-can.',
      origin: 'Delhi Atelier',
      careInstructions: 'Sanitized and pre-steamed.',
      price: 4999,
      originalPrice: 42000,
      rating: 4.9,
      reviewsCount: 30,
      stock: 6,
      isFeatured: false,
      isNewArrival: true,
      categoryId: categories['sangeet-mehendi'].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
      ]),
      variants: womenVariants,
    },
  ];

  const createdProducts = [];
  for (const prod of productsData) {
    const p = await prisma.product.create({ data: prod });
    createdProducts.push(p);
  }

  console.log(`Created ${createdProducts.length} ReWear boutique rental pieces.`);

  // 5. Seed Coupons in INR
  const couponsData = [
    {
      code: 'REWEAR10',
      discountType: 'PERCENT',
      discountValue: 10,
      minOrderValue: 2000,
      maxDiscount: 2500,
      usageLimit: 500,
      timesUsed: 18,
      isActive: true,
    },
    {
      code: 'WEDDING15',
      discountType: 'PERCENT',
      discountValue: 15,
      minOrderValue: 5000,
      maxDiscount: 3500,
      usageLimit: 300,
      timesUsed: 42,
      isActive: true,
    },
    {
      code: 'ROYAL500',
      discountType: 'FIXED',
      discountValue: 500,
      minOrderValue: 3000,
      usageLimit: 200,
      timesUsed: 27,
      isActive: true,
    },
    {
      code: 'SAVE10',
      discountType: 'PERCENT',
      discountValue: 10,
      minOrderValue: 1000,
      maxDiscount: 1500,
      usageLimit: 1000,
      timesUsed: 65,
      isActive: true,
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.create({ data: c });
  }

  // 6. Seed Sample Orders for Customer & Admin
  const firstProduct = createdProducts[0]; // Velvet bridal
  const sherwani = createdProducts[5]; // Raw silk sherwani

  await prisma.order.create({
    data: {
      orderNumber: 'RW-2026-88192',
      userId: customer.id,
      customerName: 'Priya Sharma',
      customerEmail: 'user@rewear.com',
      customerPhone: '+91 98450 12345',
      shippingAddress: JSON.stringify({
        fullName: 'Priya Sharma',
        addressLine1: 'Villa 14, Palm Meadows, Whitefield',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560066',
        country: 'India',
        phone: '+91 98450 12345',
      }),
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      status: 'DELIVERED',
      subtotal: 18500,
      tax: 2220,
      shippingFee: 0,
      discountAmount: 1850,
      total: 18870,
      couponCode: 'REWEAR10',
      estimatedDelivery: new Date(Date.now() - 86400000 * 3),
      items: {
        create: [
          {
            productId: firstProduct.id,
            productName: firstProduct.name,
            productImage: JSON.parse(firstProduct.images)[0],
            price: firstProduct.price,
            quantity: 1,
            variant: 'S (Bust 34) / 3 Days Rental',
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: 'RW-2026-94201',
      userId: customer2.id,
      customerName: 'Arjun Mehra',
      customerEmail: 'arjun@rewear.com',
      customerPhone: '+91 97110 98765',
      shippingAddress: JSON.stringify({
        fullName: 'Arjun Mehra',
        addressLine1: 'B-42 Defence Colony',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110024',
        country: 'India',
        phone: '+91 97110 98765',
      }),
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      status: 'PROCESSING',
      subtotal: 9999,
      tax: 1199.88,
      shippingFee: 0,
      discountAmount: 500,
      total: 10698.88,
      couponCode: 'ROYAL500',
      estimatedDelivery: new Date(Date.now() + 86400000 * 4),
      items: {
        create: [
          {
            productId: sherwani.id,
            productName: sherwani.name,
            productImage: JSON.parse(sherwani.images)[0],
            price: sherwani.price,
            quantity: 1,
            variant: '40 Regular / 3 Days Rental',
          },
        ],
      },
    },
  });

  // 7. Seed Reviews
  await prisma.review.create({
    data: {
      productId: firstProduct.id,
      userId: customer.id,
      userName: 'Priya Sharma (Bride)',
      rating: 5,
      title: 'Saved over ₹1.4 Lakhs on my dream wedding lehenga!',
      comment: 'Everyone at my wedding in Bangalore thought this was a custom Sabyasachi outfit worth lakhs. The custom blouse fitting was pinpoint accurate and arrived 3 days before the pheras with fragrant eco-dry cleaning. Returning it was as simple as handing it to the doorstep courier. Truly the smartest choice!',
      isApproved: true,
    },
  });

  await prisma.review.create({
    data: {
      productId: sherwani.id,
      userName: 'Arjun Mehra (Groom)',
      rating: 5,
      title: 'Turned heads at our Delhi reception',
      comment: 'The nawabi raw silk achkan looked regal in every photograph. Highest quality fabric and zero smell or sign of previous wear. ReWear is a gamechanger for grooms.',
      isApproved: true,
    },
  });

  // 8. Seed Wishlist
  await prisma.wishlistItem.create({
    data: {
      userId: customer.id,
      productId: sherwani.id,
    },
  });

  // 9. Seed Site Content (ReWear)
  await prisma.siteContent.create({
    data: {
      key: 'heroSlides',
      value: JSON.stringify([
        {
          id: '1',
          tag: 'WEDDING COUTURE 2026',
          title: 'Wear The Dream, Skip The Price',
          subtitle: 'Rent authentic designer bridal lehengas, royal sherwanis, and red-carpet gowns starting at ₹1,499. Custom altered to your measurements with complimentary dry cleaning.',
          image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2000&auto=format&fit=crop',
          ctaText: 'Explore Wedding Wear',
          ctaLink: '/catalog?category=bridal-lehengas',
        },
        {
          id: '2',
          tag: 'ROYAL GROOM COLLECTION',
          title: 'Majestic Heritage Sherwanis',
          subtitle: 'Hand-embroidered zardozi, raw silk bandhgalas, and jodhpuri suits for grooms and baraatis. Rent iconic royalty without wardrobe commitment.',
          image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2000&auto=format&fit=crop',
          ctaText: 'Discover Groom Wear',
          ctaLink: '/catalog?category=groom-sherwanis',
        },
        {
          id: '3',
          tag: 'COCKTAIL & RECEPTION GOWNS',
          title: 'Glamour Reimagined',
          subtitle: 'Scintillating sequin trails, structured corset silhouettes, and organza drapery for sangeet nights and reception galas.',
          image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000&auto=format&fit=crop',
          ctaText: 'View Evening Gowns',
          ctaLink: '/catalog?category=cocktail-gowns',
        },
      ]),
    },
  });

  await prisma.siteContent.create({
    data: {
      key: 'brandStory',
      value: JSON.stringify({
        title: 'The Smart, Sustainable Way to Celebrate',
        subtitle: 'REWEAR COUTURE PHILOSOPHY',
        narrative1: 'Special occasions like weddings happen once in a lifetime, but that does not mean a ₹1,50,000 designer lehenga should sit in a closet forever. At ReWear, we believe in democratizing high-end fashion with seamless, hygienic luxury rentals.',
        narrative2: 'Every outfit is sanitized with hospital-grade eco-friendly dry cleaning, customized to your exact bust/waist/length measurements by master tailors, and delivered to your doorstep 2 days before your big celebration.',
        yearEstablished: '2024',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
        quote: '"Why purchase what you will only wear once? ReWear allows you to turn heads at every wedding with a brand new designer silhouette."',
        author: 'Ananya Singhania, Founder & Creative Director',
      }),
    },
  });

  await prisma.siteContent.create({
    data: {
      key: 'storeSettings',
      value: JSON.stringify({
        storeName: 'ReWear',
        tagline: 'Luxury Occasion & Wedding Wear Rentals',
        contactEmail: 'care@rewear.in',
        contactPhone: '+91 (800) 420-7890',
        address: 'Indiranagar 100ft Road, Bengaluru & Bandra West, Mumbai',
        currencySymbol: '₹',
        taxRatePercent: 12.0,
        freeShippingThreshold: 3000,
        shippingFlatRate: 250,
        announcementText: '✨ Free Custom Alterations, Doorstep Delivery & Return Dry Cleaning across all Wedding Bookings in India',
        announcementActive: true,
      }),
    },
  });

  console.log('ReWear database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
