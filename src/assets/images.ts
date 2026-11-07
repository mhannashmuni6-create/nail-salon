/**
 * Static image imports bundled via Vite for GitHub Pages & production deployment.
 * All images feature photorealistic, anatomically correct hands with professional salon finishes.
 */
import heroNudePinkBiab from './images/hero_nude_pink_biab_1793957638110.jpg';
import galNudeBiab from './images/gal_nude_biab_1793957639509.jpg';
import galFrenchTips from './images/gal_french_tips_1793957639546.jpg';
import galChocolateBrown from './images/gal_chocolate_brown_1793957639801.jpg';
import galPinkChrome from './images/gal_pink_chrome_1793957640615.jpg';
import galMinimalistFloral from './images/gal_minimalist_floral_1793957640758.jpg';
import galMilkyWhite from './images/gal_milky_white_1793957642244.jpg';
import galBurgundyAlmond from './images/gal_burgundy_almond_1793957642997.jpg';
import galSubtleGlitter from './images/gal_subtle_glitter_1793957642907.jpg';
import salonInteriorImg from './images/salon_interior_boutique_1793849479225.jpg';

// Dedicated, unique service card photography
import svcClassicManicure from './images/svc_classic_manicure_1794015326094.jpg';
import svcBiabManicure from './images/svc_biab_manicure_1794015326367.jpg';
import svcGelManicure from './images/svc_gel_manicure_1794015326759.jpg';
import svcGelExtensions from './images/svc_gel_ext_fingertips_1794016428589.jpg';
import svcAcrylicFullSet from './images/svc_acrylic_full_set_1794015328570.jpg';
import svcSpaPedicure from './images/svc_spa_pedicure_1794015342410.jpg';
import svcDetailedNailArt from './images/svc_detailed_nail_art_1794016955788.jpg';

export const Images = {
  // Hero & Interior (Preserved)
  heroManicure: heroNudePinkBiab,
  salonInterior: salonInteriorImg,

  // 8 Unique Gallery Images (Preserved)
  galNudeBiab,
  galFrenchTips,
  galChocolateBrown,
  galPinkChrome,
  galMinimalistFloral,
  galMilkyWhite,
  galBurgundyAlmond,
  galSubtleGlitter,

  // Dedicated Service Card Images
  svcClassicManicure,
  svcBiabManicure,
  svcGelManicure,
  svcGelExtensions,
  svcAcrylicFullSet,
  svcSpaPedicure,
  svcDetailedNailArt,

  // Legacy mappings for safe fallback
  biabNude: svcBiabManicure,
  frenchChrome: galFrenchTips,
  artCreative: galMinimalistFloral,
};
