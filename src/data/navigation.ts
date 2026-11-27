import navProductsRaw from '@/data/navProducts.json';
import { SITE_CONFIG } from '@/config/site';

export interface NavSpec {
  label: string;
  value: string;
}

export interface NavProductItem {
  id: number | string;
  name: string;
  category: string;
  categorySlug: string;
  slug: string;
  href: string;
  thumbSrc?: string;
  specs: NavSpec[];
}

export interface NavSubCategory {
  id: string;
  title: string;
  slug: string;
  products: NavProductItem[];
}

export interface NavSuperCategory {
  id: string;
  title: string;
  subcategories: NavSubCategory[];
}

export interface MegaMenuLink {
  title: string;
  href: string;
}

export interface MegaMenuColumn {
  columnTitle: string;
  links: MegaMenuLink[];
}

export interface MegaMenuPromo {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export interface TopMenuConfig {
  id: 'products' | 'services' | 'industries' | 'company';
  label: string;
  href: string;
  active?: boolean;
  promo?: MegaMenuPromo;
  columns?: MegaMenuColumn[];
}

interface RawCatalogProduct {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  slug: string;
  specs: NavSpec[];
}

const catalogProducts: NavProductItem[] = (
  navProductsRaw as RawCatalogProduct[]
).map((item) => ({
  ...item,
  href: `/products/${item.categorySlug}/${item.slug}`,
}));

const filterByCategory = (slugs: string[]): NavProductItem[] =>
  catalogProducts
    .filter((item) => slugs.includes(item.categorySlug))
    .slice(0, 9);

const customBearingIsolators: NavProductItem[] = [
  {
    id: 'bi-1',
    name: 'Non-Contact Metallic Bearing Isolator',
    category: 'Bearing Isolators',
    categorySlug: 'products',
    slug: 'bearing-isolator-pro',
    href: '/contact?inquiry=Non-Contact%20Metallic%20Bearing%20Isolator',
    specs: [
      { label: 'Size', value: '20 - 150mm' },
      { label: 'Temp', value: '-40 to 200°C' },
    ],
  },
  {
    id: 'bi-2',
    name: 'Flanged Pump Bearing Protection Seal',
    category: 'Bearing Isolators',
    categorySlug: 'products',
    slug: 'bearing-protection-seal',
    href: '/contact?inquiry=Flanged%20Pump%20Bearing%20Protection%20Seal',
    specs: [
      { label: 'Size', value: '25 - 120mm' },
      { label: 'Temp', value: '-30 to 180°C' },
    ],
  },
  {
    id: 'bi-3',
    name: 'Heavy-Duty Gearbox Isolator Seal',
    category: 'Bearing Isolators',
    categorySlug: 'products',
    slug: 'gearbox-isolator-seal',
    href: '/contact?inquiry=Heavy-Duty%20Gearbox%20Isolator%20Seal',
    specs: [
      { label: 'Size', value: '30 - 200mm' },
      { label: 'Temp', value: '-40 to 220°C' },
    ],
  },
];

const customSpares: NavProductItem[] = [
  {
    id: 'sp-1',
    name: 'Silicon / Tungsten Carbide',
    category: 'Spares',
    categorySlug: 'products',
    slug: 'silicon-tungsten-carbide',
    href: '/contact?inquiry=Silicon%20%2F%20Tungsten%20Carbide%20Faces',
    specs: [
      { label: 'Material', value: 'SiC / TC' },
      { label: 'Type', value: 'Lapped Seal Face' },
    ],
  },
  {
    id: 'sp-2',
    name: 'Carbon',
    category: 'Spares',
    categorySlug: 'products',
    slug: 'carbon-seal-faces',
    href: '/contact?inquiry=Carbon%20Seal%20Faces',
    specs: [
      { label: 'Material', value: 'Carbon Graphite' },
      { label: 'Temp', value: '-50 to 260°C' },
    ],
  },
  {
    id: 'sp-3',
    name: 'Ceramic',
    category: 'Spares',
    categorySlug: 'products',
    slug: 'ceramic-seal-faces',
    href: '/contact?inquiry=Ceramic%20Seal%20Faces',
    specs: [
      { label: 'Material', value: '99.5% Alumina' },
      { label: 'Property', value: 'Corrosion Resistant' },
    ],
  },
  {
    id: 'sp-4',
    name: 'Teflon',
    category: 'Spares',
    categorySlug: 'products',
    slug: 'teflon-components',
    href: '/contact?inquiry=Teflon%20PTFE%20Components',
    specs: [
      { label: 'Material', value: 'Virgin / Glass PTFE' },
      { label: 'Temp', value: '-70 to 260°C' },
    ],
  },
  {
    id: 'sp-5',
    name: 'Grafoil',
    category: 'Spares',
    categorySlug: 'products',
    slug: 'grafoil-packing',
    href: '/contact?inquiry=Grafoil%20Packing',
    specs: [
      { label: 'Material', value: 'Flexible Grafoil' },
      { label: 'Temp', value: 'Up to 650°C' },
    ],
  },
  {
    id: 'sp-6',
    name: 'Rubber',
    category: 'Spares',
    categorySlug: 'products',
    slug: 'rubber-elastomers',
    href: '/contact?inquiry=Elastomer%20O-Rings%20%26%20Bellows',
    specs: [
      { label: 'Material', value: 'FKM / Viton / EPDM' },
      { label: 'Standard', value: 'AS568 / Metric' },
    ],
  },
];

export const PRODUCT_SUPER_CATEGORIES: NavSuperCategory[] = [
  {
    id: 'mechanical-seal',
    title: 'Mechanical Seal',
    subcategories: [
      {
        id: 'multi-spring',
        title: 'Multi Spring Seal',
        slug: 'multi-spring-series-seal',
        products: filterByCategory(['multi-spring-series-seal', 'mechanical-seal']),
      },
      {
        id: 'single-spring',
        title: 'Single Spring Seal',
        slug: 'single-spring-series-seal',
        products: filterByCategory(['single-spring-series-seal']),
      },
      {
        id: 'rubber-bellow',
        title: 'Rubber Bellow Seal',
        slug: 'water-seal',
        products: filterByCategory(['water-seal']),
      },
      {
        id: 'high-temp',
        title: 'High Temperature Seal',
        slug: 'high-temp-seal',
        products: filterByCategory(['high-temp-seal']),
      },
      {
        id: 'cartridge',
        title: 'Cartridge Seal',
        slug: 'cartridge-seal',
        products: filterByCategory(['cartridge-seal']),
      },
      {
        id: 'reactor-seal',
        title: 'Reactor Seal',
        slug: 'reactor-seal',
        products: filterByCategory(['reactor-seal']),
      },
      {
        id: 'agitator-seal',
        title: 'Agitator Seal',
        slug: 'agitator-seal',
        products: filterByCategory(['agitator-seal']),
      },
    ],
  },
  {
    id: 'rotary-joints',
    title: 'Rotary Joints',
    subcategories: [
      {
        id: 'water-rotary',
        title: 'Water Rotary Joints',
        slug: 'water-rotary-joints',
        products: filterByCategory(['water-rotary-joints']),
      },
      {
        id: 'hot-oil-rotary',
        title: 'Hot Oil Rotary Joints',
        slug: 'hot-oil-rotary-joints',
        products: filterByCategory(['hot-oil-rotary-joints']),
      },
      {
        id: 'steam-rotary',
        title: 'Steam Rotary Joints',
        slug: 'steam-rotary-joints',
        products: filterByCategory(['steam-rotary-joints']),
      },
      {
        id: 'hydraulic-rotary',
        title: 'Hydraulic Rotary Joints',
        slug: 'hydrolic-rotary-joints',
        products: filterByCategory(['hydrolic-rotary-joints']),
      },
      {
        id: 'high-temp-rotary',
        title: 'High Temperature Rotary Joint',
        slug: 'high-temp-rotary-joints',
        products: filterByCategory(['high-temp-rotary-joints']),
      },
    ],
  },
  {
    id: 'seal-support-system',
    title: 'Seal Support System',
    subcategories: [
      {
        id: 'thermosyphon-sys',
        title: 'Thermosyphon System',
        slug: 'thermosyphon',
        products: filterByCategory(['thermosyphon']),
      },
      {
        id: 'heat-exchanger-sys',
        title: 'Heat Exchanger System',
        slug: 'heat-exchanged-system',
        products: filterByCategory(['heat-exchanged-system']),
      },
    ],
  },
  {
    id: 'bearing-isolators',
    title: 'Bearing Isolators',
    subcategories: [
      {
        id: 'bearing-isolator-pro',
        title: 'Bearing Isolator Pro',
        slug: 'products',
        products: customBearingIsolators,
      },
    ],
  },
  {
    id: 'spares',
    title: 'Spares',
    subcategories: [
      {
        id: 'lapped-seal-face',
        title: 'Lapped Seal Face',
        slug: 'products',
        products: customSpares,
      },
    ],
  },
];

export const TOP_NAV_MENUS: TopMenuConfig[] = [
  {
    id: 'products',
    label: 'Products',
    href: '/products',
    active: true,
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    promo: {
      title: 'Comprehensive Service Support',
      description:
        'From process consultation to preventive maintenance programmes — our service team ensures your seals and pumps run at peak performance.',
      buttonText: 'View All Services',
      buttonHref: '/services',
    },
    columns: [
      {
        columnTitle: 'Support Services',
        links: [
          { title: 'Consultation & Analysis', href: '/services#consultation' },
          { title: 'Technical Support', href: '/services#technical-support' },
          { title: 'Maintenance', href: '/services#maintenance' },
          { title: 'Repair & Refurbishment', href: '/services#repair-refurbishment' },
        ],
      },
      {
        columnTitle: 'Training & Planning',
        links: [
          { title: 'Training Programmes', href: '/services#training' },
          { title: 'Inventory Control', href: '/services#inventory-control' },
          { title: 'Preventive Maintenance', href: '/services#preventive-maintenance' },
        ],
      },
    ],
  },
  {
    id: 'industries',
    label: 'Industries',
    href: '/industries',
    promo: {
      title: 'Engineered for Oil & Gas',
      description:
        'Read our latest case study on how we eliminated leakage in extreme high-pressure pumping systems.',
      buttonText: 'View All Industries',
      buttonHref: '/industries',
    },
    columns: [
      {
        columnTitle: 'Primary Sectors',
        links: [
          { title: 'Oil & Gas', href: '/industries/oil-and-gas' },
          { title: 'Chemical Process', href: '/industries/chemical-process' },
          { title: 'Pharmaceutical', href: '/industries/pharmaceutical' },
          { title: 'Pulp & Paper', href: '/industries/pulp-and-paper' },
          { title: 'Power Generation', href: '/industries/power-generation' },
        ],
      },
      {
        columnTitle: 'Specialized',
        links: [
          { title: 'Mining & Minerals', href: '/industries/mining-and-minerals' },
          { title: 'Food & Beverage', href: '/industries/food-and-beverage' },
          { title: 'Water Systems', href: '/industries/water-systems' },
          {
            title: 'Refrigeration Compressors',
            href: '/industries/refrigeration-compressors',
          },
          { title: 'Textile', href: '/industries/textile' },
        ],
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    href: '/about',
    promo: {
      title: 'Join Our Team',
      description:
        'We are always looking for talented engineers and specialists to join our global team.',
      buttonText: 'View Careers',
      buttonHref: '/contact?inquiry=Careers%20%26%20Opportunities',
    },
    columns: [
      {
        columnTitle: 'About Us',
        links: [
          { title: 'Our History', href: '/about' },
          { title: 'Management Team', href: '/management-team' },
          { title: 'Certifications', href: '/certifications' },
          { title: 'News & Press', href: '/news-press' },
          { title: 'Events & Trade Fairs', href: '/events-trade-fairs' },
        ],
      },
    ],
  },
];

export const SEARCHABLE_PRODUCTS: NavProductItem[] = [
  ...catalogProducts,
  ...customBearingIsolators,
  ...customSpares,
];

export const BROCHURE_LINK = {
  label: 'Technical Catalogue',
  href: SITE_CONFIG.brochurePath,
  download: SITE_CONFIG.brochureDownloadName,
};

export interface UtilityLink {
  label: string;
  href: string;
  download?: string;
}

export const UTILITY_LINKS: UtilityLink[] = [
  {
    label: 'Download Catalogue',
    href: SITE_CONFIG.brochurePath,
    download: SITE_CONFIG.brochureDownloadName,
  },
  { label: 'Request a Quote', href: '/contact?inquiry=Quote+Request' },
  { label: 'Technical Support', href: '/contact?inquiry=Technical+Support' },
  { label: 'Contact Us', href: '/contact' },
];
