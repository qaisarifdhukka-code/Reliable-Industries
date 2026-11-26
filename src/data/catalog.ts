import type { ImageMetadata } from 'astro';
import productsCatalogRaw from '@/data/productsCatalog.json';
import cadFallbackImg from '@/assets/images/engineering_cad.jpg';

export interface CatalogGalleryFile {
  file: string;
  label: string;
  type: 'photo' | 'diagram';
}

export interface CatalogSpecBadge {
  label: string;
  value: string;
}

export interface CatalogProduct {
  id: number;
  name: string;
  shortName: string;
  category: string;
  categorySlug: string;
  slug: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  badgeSpecs: CatalogSpecBadge[];
  galleryFiles: CatalogGalleryFile[];
}

export interface SubCategoryGroupDef {
  title: string;
  slug: string;
  superCategory: string;
  match: (product: CatalogProduct) => boolean;
}

export interface ResolvedGalleryItem {
  image: ImageMetadata;
  label: string;
  type: 'photo' | 'diagram';
}

const sealImageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/sealproduct/*.{jpg,jpeg,png}',
  { eager: true }
);

const imageByBasename = new Map<string, ImageMetadata>();
for (const [assetPath, mod] of Object.entries(sealImageModules)) {
  const filename = assetPath.split('/').pop();
  if (filename && mod?.default) {
    imageByBasename.set(filename, mod.default);
  }
}

const SPEC_LABEL_MAP: Record<string, string> = {
  Rotaryjoinsizeavilable: 'Rotary Joint Size',
  'Rotary joint size available': 'Rotary Joint Size',
  'Temperature range': 'Temperature Range',
  'Moc of body': 'MOC of Body',
  Rpm: 'RPM',
};

export function normalizeSpecEntries(
  specs: Record<string, string>
): Array<[string, string]> {
  return Object.entries(specs)
    .filter(([, value]) => Boolean(value && value.trim()))
    .map(([key, value]) => [SPEC_LABEL_MAP[key] ?? key, value]);
}

export const CATALOG_PRODUCTS: CatalogProduct[] =
  productsCatalogRaw as unknown as CatalogProduct[];

export function getPrimaryImageMeta(product: CatalogProduct): ImageMetadata {
  const firstFile = product.galleryFiles[0]?.file;
  if (firstFile && imageByBasename.has(firstFile)) {
    return imageByBasename.get(firstFile)!;
  }
  return cadFallbackImg;
}

export function getGalleryImageMetas(
  product: CatalogProduct
): ResolvedGalleryItem[] {
  const items: ResolvedGalleryItem[] = [];
  for (const item of product.galleryFiles) {
    const found = imageByBasename.get(item.file);
    if (found) {
      items.push({
        image: found,
        label: item.label,
        type: item.type,
      });
    }
  }
  if (items.length === 0) {
    items.push({
      image: cadFallbackImg,
      label: 'Product Photo',
      type: 'photo',
    });
  }
  if (items.length === 1) {
    items.push({
      image: cadFallbackImg,
      label: 'Technical Schematic / CAD',
      type: 'diagram',
    });
  }
  return items;
}

export const SUBCATEGORY_GROUPS: SubCategoryGroupDef[] = [
  {
    title: 'Multi Spring Seal',
    slug: 'multi-spring-series-seal',
    superCategory: 'Mechanical Seal',
    match: (p) =>
      p.categorySlug === 'multi-spring-series-seal' ||
      p.categorySlug === 'mechanical-seal',
  },
  {
    title: 'Single Spring Seal',
    slug: 'single-spring-series-seal',
    superCategory: 'Mechanical Seal',
    match: (p) => p.categorySlug === 'single-spring-series-seal',
  },
  {
    title: 'Rubber Bellow Seal',
    slug: 'water-seal',
    superCategory: 'Mechanical Seal',
    match: (p) => p.categorySlug === 'water-seal',
  },
  {
    title: 'High Temperature Seal',
    slug: 'high-temp-seal',
    superCategory: 'Mechanical Seal',
    match: (p) => p.categorySlug === 'high-temp-seal',
  },
  {
    title: 'Cartridge Seal',
    slug: 'cartridge-seal',
    superCategory: 'Mechanical Seal',
    match: (p) => p.categorySlug === 'cartridge-seal',
  },
  {
    title: 'Reactor Seal',
    slug: 'reactor-seal',
    superCategory: 'Mechanical Seal',
    match: (p) => p.categorySlug === 'reactor-seal',
  },
  {
    title: 'Agitator Seal',
    slug: 'agitator-seal',
    superCategory: 'Mechanical Seal',
    match: (p) => p.categorySlug === 'agitator-seal',
  },
  {
    title: 'Rotary Joints Overview',
    slug: 'rotary-joints',
    superCategory: 'Rotary Joints',
    match: (p) => p.categorySlug === 'rotary-joints',
  },
  {
    title: 'Water Rotary Joints',
    slug: 'water-rotary-joints',
    superCategory: 'Rotary Joints',
    match: (p) => p.categorySlug === 'water-rotary-joints',
  },
  {
    title: 'Hot Oil Rotary Joints',
    slug: 'hot-oil-rotary-joints',
    superCategory: 'Rotary Joints',
    match: (p) => p.categorySlug === 'hot-oil-rotary-joints',
  },
  {
    title: 'Steam Rotary Joints',
    slug: 'steam-rotary-joints',
    superCategory: 'Rotary Joints',
    match: (p) => p.categorySlug === 'steam-rotary-joints',
  },
  {
    title: 'Hydraulic Rotary Joints',
    slug: 'hydrolic-rotary-joints',
    superCategory: 'Rotary Joints',
    match: (p) => p.categorySlug === 'hydrolic-rotary-joints',
  },
  {
    title: 'High Temperature Rotary Joint',
    slug: 'high-temp-rotary-joints',
    superCategory: 'Rotary Joints',
    match: (p) => p.categorySlug === 'high-temp-rotary-joints',
  },
  {
    title: 'Thermosyphon System',
    slug: 'thermosyphon',
    superCategory: 'Seal Support System',
    match: (p) => p.categorySlug === 'thermosyphon',
  },
  {
    title: 'Heat Exchanger System',
    slug: 'heat-exchanged-system',
    superCategory: 'Seal Support System',
    match: (p) => p.categorySlug === 'heat-exchanged-system',
  },
];

export function getRelatedProducts(product: CatalogProduct): CatalogProduct[] {
  const group = SUBCATEGORY_GROUPS.find(
    (g) => g.match(product) || g.slug === product.categorySlug
  );
  if (group) {
    const matches = CATALOG_PRODUCTS.filter((p) => group.match(p));
    if (matches.length > 0) return matches;
  }
  const byCategory = CATALOG_PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug
  );
  return byCategory.length > 0 ? byCategory : [product];
}
