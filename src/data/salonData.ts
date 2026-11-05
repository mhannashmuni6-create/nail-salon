import { ServiceItem, GalleryItem, ReviewItem, FAQItem } from '../types';
import { Images } from '../assets/images';

export const SALON_INFO = {
  name: 'Nail Muse Studio',
  tagline: 'Your Nails, Your Muse.',
  location: 'Melbourne, Victoria, Australia',
  city: 'Melbourne',
  state: 'VIC',
  country: 'Australia',
  phone: '+61 (03) 9000 8472',
  phoneDisplay: '(03) 9000 8472',
  email: 'hello@nailmusestudio.com.au',
  instagram: '@nailmusestudio',
  instagramUrl: 'https://instagram.com',
  tiktok: '@nailmusestudio',
  tiktokUrl: 'https://tiktok.com',
  hours: [
    { days: 'Tuesday – Wednesday', hours: '9:30 AM – 6:30 PM' },
    { days: 'Thursday (Late Night)', hours: '9:30 AM – 8:00 PM' },
    { days: 'Friday', hours: '9:30 AM – 6:30 PM' },
    { days: 'Saturday', hours: '9:30 AM – 5:30 PM' },
    { days: 'Sunday', hours: '10:00 AM – 4:00 PM' },
    { days: 'Monday', hours: 'Closed for Salon Deep Clean' },
  ],
};

export const SERVICES: ServiceItem[] = [
  // Manicures
  {
    id: 'classic-manicure',
    name: 'Classic Manicure',
    category: 'manicures',
    price: 45,
    durationMinutes: 45,
    description: 'Precision nail shaping, gentle cuticle tidy, hydrating hand massage, and regular polish finish.',
    image: Images.biabNude,
  },
  {
    id: 'gel-manicure',
    name: 'Gel Manicure',
    category: 'manicures',
    price: 65,
    durationMinutes: 60,
    description: 'Complete cuticle preparation, nourishing treatment, and chip-free premium gel polish cured under low-heat LED.',
    isPopular: true,
    image: Images.heroManicure,
  },
  {
    id: 'biab-manicure',
    name: 'BIAB / Builder Gel Manicure',
    category: 'manicures',
    price: 85,
    durationMinutes: 75,
    description: 'Our signature strengthening builder gel overlay designed to nurture and protect your natural nails for 3–4 weeks.',
    isPopular: true,
    image: Images.biabNude,
  },
  {
    id: 'french-addon',
    name: 'French Tip Add-On',
    category: 'manicures',
    price: 15,
    durationMinutes: 15,
    description: 'Timeless crisp white, glazed chrome, or modern micro-French smile lines hand-painted to complement your natural shape.',
    image: Images.frenchChrome,
  },

  // Nail Extensions
  {
    id: 'acrylic-full-set',
    name: 'Acrylic Full Set',
    category: 'extensions',
    price: 95,
    durationMinutes: 90,
    description: 'Custom-sculpted acrylic extensions built to your preferred length, curve, and signature silhouette.',
    image: Images.heroManicure,
  },
  {
    id: 'acrylic-refill',
    name: 'Acrylic Refill',
    category: 'extensions',
    price: 75,
    durationMinutes: 70,
    description: 'Careful regrowth infill, structural rebalance, cuticle maintenance, and fresh gel color polish.',
  },
  {
    id: 'gel-extensions',
    name: 'Gel Extensions (Apres / Soft Gel)',
    category: 'extensions',
    price: 105,
    durationMinutes: 90,
    description: 'Lightweight, ultra-flexible full cover soft gel extensions that feel weightless while providing superior durability.',
    isPopular: true,
    image: Images.frenchChrome,
  },
  {
    id: 'extension-removal',
    name: 'Extension Removal',
    category: 'extensions',
    price: 35,
    durationMinutes: 30,
    description: 'Gentle, non-destructive soak-off removal of artificial enhancements followed by keratin strengthening oil.',
  },

  // Pedicures
  {
    id: 'classic-pedicure',
    name: 'Classic Pedicure',
    category: 'pedicures',
    price: 55,
    durationMinutes: 45,
    description: 'Aromatic foot soak, gentle heel buffing, nail trimming, cuticle hydration, and classic polish.',
  },
  {
    id: 'spa-pedicure',
    name: 'Spa Pedicure',
    category: 'pedicures',
    price: 80,
    durationMinutes: 60,
    description: 'Botanical foot bath, exfoliating pink Himalayan salt scrub, deep tension-relieving calf massage, and warm towel wrap.',
    isPopular: true,
  },
  {
    id: 'gel-pedicure',
    name: 'Gel Pedicure',
    category: 'pedicures',
    price: 75,
    durationMinutes: 60,
    description: 'Complete classic pedicure ritual followed by long-wearing high-shine gel polish that walks out instantly dry.',
  },

  // Nail Art & Extras
  {
    id: 'simple-nail-art',
    name: 'Simple Nail Art',
    category: 'nail-art',
    price: 20,
    durationMinutes: 20,
    description: 'Minimalist accents including delicate aura airbrushing, dainty dots, subtle chrome glaze, or single line art on 2–4 nails.',
    image: Images.frenchChrome,
  },
  {
    id: 'detailed-nail-art',
    name: 'Detailed Nail Art',
    category: 'nail-art',
    price: 45,
    durationMinutes: 40,
    description: 'Bespoke hand-painted creative designs, custom abstract swirls, metallic 3D charms, and gold leaf on all 10 nails.',
    isPopular: true,
    image: Images.artCreative,
  },
  {
    id: 'chrome-finish',
    name: 'Chrome Finish Powder',
    category: 'nail-art',
    price: 15,
    durationMinutes: 15,
    description: 'Trending glazed donut, iridescent pearl, or reflective rose gold chrome powder buffed over your set.',
    image: Images.heroManicure,
  },
  {
    id: 'nail-repair',
    name: 'Nail Repair (Per Nail)',
    category: 'nail-art',
    price: 15,
    durationMinutes: 15,
    description: 'Quick recovery repair for chipped extensions, broken tips, or split natural nails.',
  },
  {
    id: 'product-removal',
    name: 'Safe Product Removal',
    category: 'nail-art',
    price: 30,
    durationMinutes: 30,
    description: 'Safe soak-off for existing gel or BIAB, followed by nourishing cuticle serum and nail plate conditioning.',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Glazed Pearl Chrome Almonds',
    category: 'chrome',
    categoryLabel: 'Chrome Nails',
    description: 'Hailey Bieber-inspired iridescent glaze over soft translucent milky pink base, shaped into medium almond.',
    image: Images.heroManicure,
    tags: ['Chrome Finish', 'Almond Shape', 'Glazed Donut'],
    suggestedServiceId: 'biab-manicure',
  },
  {
    id: 'gal-2',
    title: 'Signature Minimal Nude BIAB',
    category: 'biab',
    categoryLabel: 'BIAB Nails',
    description: 'Flawless apex sculpting with warm beige builder gel and subtle micro-gold foil crescent at the cuticle.',
    image: Images.biabNude,
    tags: ['BIAB Overlay', 'Natural Nails', 'Clean Girl Aesthetic'],
    suggestedServiceId: 'biab-manicure',
  },
  {
    id: 'gal-3',
    title: 'Modern Micro-French Tips',
    category: 'french-tips',
    categoryLabel: 'French Tips',
    description: 'Whisper-thin porcelain white smile lines over a healthy rosy sheer bed, finished with a subtle satin gloss.',
    image: Images.frenchChrome,
    tags: ['French Tip', 'Minimalist', 'Timeless Elegance'],
    suggestedServiceId: 'gel-manicure',
  },
  {
    id: 'gal-4',
    title: 'Ethereal Pastel & Rose Foil Swirls',
    category: 'creative',
    categoryLabel: 'Creative Nail Art',
    description: 'Freeform hand-painted botanical swirls in sage, lavender, and soft blush with delicate rose gold flecks.',
    image: Images.artCreative,
    tags: ['Hand-Painted', 'Abstract Swirls', 'Pastel Muse'],
    suggestedServiceId: 'detailed-nail-art',
  },
  {
    id: 'gal-5',
    title: 'Sculpted Soft Gel Glass Extensions',
    category: 'acrylic',
    categoryLabel: 'Acrylic & Extensions',
    description: 'Crystal-clear gel-x tips shaped into elegant soft ballerina squares with sheer peach jelly tint.',
    image: Images.heroManicure,
    tags: ['Gel Extensions', 'Jelly Polish', 'Square Silhouette'],
    suggestedServiceId: 'gel-extensions',
  },
  {
    id: 'gal-6',
    title: 'Blush Velvet Cat-Eye Polish',
    category: 'minimalist',
    categoryLabel: 'Minimalist Nails',
    description: 'Magnetic velvet dimension creating a liquid silk shimmer effect under Melbourne daylight.',
    image: Images.biabNude,
    tags: ['Cat-Eye Gel', 'Velvet Effect', 'Understated Chic'],
    suggestedServiceId: 'gel-manicure',
  },
  {
    id: 'gal-7',
    title: 'Subtle Spring Petal Accents',
    category: 'seasonal',
    categoryLabel: 'Seasonal Designs',
    description: 'Delicate floral negative-space accents celebrating Melbourne springtime blooms on short natural nails.',
    image: Images.artCreative,
    tags: ['Seasonal', 'Spring Flora', 'Negative Space'],
    suggestedServiceId: 'simple-nail-art',
  },
  {
    id: 'gal-8',
    title: 'Chrome French Duo',
    category: 'french-tips',
    categoryLabel: 'French Tips',
    description: 'Classic French tips upgraded with reflective champagne chrome powder and glass topcoat.',
    image: Images.frenchChrome,
    tags: ['Chrome Tips', 'Modern French', 'Boutique Luxe'],
    suggestedServiceId: 'french-addon',
  },
];

export const TESTIMONIALS: ReviewItem[] = [
  {
    id: 'rev-1',
    clientName: 'Chloe Henderson',
    suburb: 'South Yarra',
    rating: 5,
    service: 'BIAB Manicure + Chrome Finish',
    reviewText:
      'My natural nails have never been stronger since starting BIAB at Nail Muse. The studio is so serene, calm, and impeccably clean. The chrome finish lasted 4 full weeks without a single chip!',
    date: 'October 2026',
  },
  {
    id: 'rev-2',
    clientName: 'Elena Rostova',
    suburb: 'Melbourne CBD',
    rating: 5,
    service: 'Detailed Nail Art & Gel Extensions',
    reviewText:
      'I brought in a tricky Pinterest moodboard and the artist translated it onto my nails with such precision and artistry. Every single detail was immaculate. An absolute gem in Melbourne.',
    date: 'September 2026',
  },
  {
    id: 'rev-3',
    clientName: 'Maya Patel',
    suburb: 'Fitzroy',
    rating: 5,
    service: 'Classic Spa Pedicure & Gel Manicure',
    reviewText:
      'The attention to detail and cuticle care is unmatched. Plus, the warm ivory and blush interior makes it feel like an escape from the city hustle. Will definitely be a regular client.',
    date: 'November 2026',
  },
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I book an appointment?',
    answer:
      'You can easily book online through our website booking portal by selecting your preferred treatment, date, and time. We also accept direct booking inquiries via our contact form and Instagram DM for bespoke bridal or event packages.',
  },
  {
    id: 'faq-2',
    question: 'How long do nail appointments take?',
    answer:
      'Appointment times vary based on the service. A Classic or Gel Manicure typically takes 45 to 60 minutes. BIAB builder gel and extensions require 75 to 90 minutes. If you are adding intricate hand-painted nail art, please allow an extra 20 to 40 minutes so we never have to rush your artistry.',
  },
  {
    id: 'faq-3',
    question: 'Can I bring a nail inspiration photo?',
    answer:
      'Absolutely! We warmly encourage bringing photos from Instagram, Pinterest, or TikTok. During our complimentary consultation at the start of your appointment, we will review your inspo together and tailor colors, shapes, and techniques to best flatter your hands.',
  },
  {
    id: 'faq-4',
    question: 'Do you offer nail removal?',
    answer:
      'Yes, we provide safe, damage-free removal for gel polish, BIAB builder gel, and artificial extensions. We never forcefully pry off enhancements; instead, we use gentle soaking and nourishing cuticles oils to safeguard your natural nail plate health.',
  },
  {
    id: 'faq-5',
    question: 'What if I need to cancel or reschedule?',
    answer:
      'We understand plans change. We kindly request at least 24 hours notice for any cancellations or reschedules so we may offer your reserved time to someone on our waitlist. You can manage your appointment online or contact our team directly.',
  },
  {
    id: 'faq-6',
    question: 'How much does nail art cost?',
    answer:
      'Our nail art starts from $15–$20 for minimalist accents (subtle chrome glazes, single micro-dots, or negative-space lines on 2–4 nails) and ranges up to $45+ for intricate hand-painted patterns or multi-finger 3D charm sets. You can view all pricing on our Services page.',
  },
];

export const BRAND_VALUES = [
  {
    id: 'val-1',
    title: 'Quality & Attention to Detail',
    subtitle: 'Precision cuticle work and pristine application',
    description:
      'Every appointment begins with meticulous preparation and structured apex sculpting. We use industry-leading hypoallergenic, 10-free gels that keep your natural nails strong and resilient.',
  },
  {
    id: 'val-2',
    title: 'Personalised Nail Designs',
    subtitle: 'Tailored to your aesthetic and hand anatomy',
    description:
      'No one-size-fits-all sets. From delicate minimalist glazes to bold editorial statements, we consult with you to select the exact nail shape, length, and palette that reflects your personality.',
  },
  {
    id: 'val-3',
    title: 'Clean & Comfortable Environment',
    subtitle: 'Hospital-grade autoclaving and single-use files',
    description:
      'Your well-being is our highest priority. We uphold rigorous Australian hygiene standards with medical-grade sterilization, individual sanitized tool pouches, and a serene, odor-free sanctuary.',
  },
  {
    id: 'val-4',
    title: 'Affordable Luxury',
    subtitle: 'High-end beauty without intimidating pretension',
    description:
      'We believe premium self-care should be transparent, accessible, and delightful. Enjoy warm herbal tea, plush boucle seating, and exceptional salon treatments at honest, upfront prices.',
  },
];
