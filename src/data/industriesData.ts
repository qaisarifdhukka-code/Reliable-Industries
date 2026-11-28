import type { ImageMetadata } from 'astro';
import industriesRaw from '@/data/industries.json';
import industrialImg from '@/assets/images/hero_industrial_1790081823152.jpg';
import chemicalImg from '@/assets/images/industry_chemical.jpg';
import pharmaImg from '@/assets/images/hero_pharma_light.jpg';
import missionImg from '@/assets/images/mission_hero_bg.jpg';
import energyImg from '@/assets/images/industry_energy_1790083113983.jpg';
import industrialNewImg from '@/assets/images/hero_industrial_new.jpg';
import cadImg from '@/assets/images/engineering_cad.jpg';
import rotaryHeroImg from '@/assets/images/hero_rotary_joint_product.jpg';
import industryPharmaImg from '@/assets/images/industry_pharma.jpg';
import industryPulpPaperImg from '@/assets/images/industry_pulp_paper.jpg';
import industryFoodBeverageImg from '@/assets/images/industry_food_beverage.jpg';
import industryWaterSystemsImg from '@/assets/images/industry_water_systems.jpg';
import industryRefrigerationImg from '@/assets/images/industry_refrigeration.jpg';
import industryOilGasImg from '@/assets/images/industry_oil_gas.jpg';

export interface RecommendedProductRef {
  name: string;
  slug: string;
  category: string;
  desc: string;
}

export interface IndustryRecord {
  id: string;
  slug: string;
  tag: string;
  title: string;
  headline: string;
  desc: string;
  fullText: string;
  image: string;
  sector: string;
  keyEquipment: string[];
  operatingConditions: Record<string, string>;
  recommendedProducts: RecommendedProductRef[];
}

export interface IndustryWithAsset extends Omit<IndustryRecord, 'image'> {
  imageMeta: ImageMetadata;
}

const IMAGE_BY_REF_PATH: Record<string, ImageMetadata> = {
  '/images/hero_industrial_1790081823152.jpg': industrialImg,
  '/images/industry_chemical.jpg': chemicalImg,
  '/images/hero_pharma_light.jpg': pharmaImg,
  '/images/mission_hero_bg.jpg': missionImg,
  '/images/industry_energy_1790083113983.jpg': energyImg,
  '/images/hero_industrial_new.jpg': industrialNewImg,
  '/images/engineering_cad.jpg': cadImg,
  '/images/hero_rotary_joint_product.jpg': rotaryHeroImg,
};

const CATEGORY_ROUTE_MAP: Record<string, string> = {
  products: '/products',
  'dairy-seal': '/products/single-spring-series-seal',
};

export function resolveIndustryCategoryHref(categorySlug: string): string {
  return CATEGORY_ROUTE_MAP[categorySlug] ?? `/products/${categorySlug}`;
}

const IMAGE_BY_SLUG: Record<string, ImageMetadata> = {
  'oil-and-gas': industryOilGasImg,
  'oil-gas': industryOilGasImg,
  'pharmaceutical': industryPharmaImg,
  'pulp-and-paper': industryPulpPaperImg,
  'pulp-paper': industryPulpPaperImg,
  'food-and-beverage': industryFoodBeverageImg,
  'food-beverage': industryFoodBeverageImg,
  'water-systems': industryWaterSystemsImg,
  'refrigeration-compressors': industryRefrigerationImg,
};

export const INDUSTRIES_LIST: IndustryWithAsset[] = (
  industriesRaw as unknown as IndustryRecord[]
).map((item) => ({
  ...item,
  imageMeta: IMAGE_BY_SLUG[item.slug] ?? IMAGE_BY_REF_PATH[item.image] ?? industrialImg,
}));
