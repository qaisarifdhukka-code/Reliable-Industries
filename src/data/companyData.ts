export interface ContactDepartment {
  id: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  accent: 'cyan' | 'yellow' | 'navy';
}

export interface CertificationCardDetail {
  id: string;
  badge: string;
  title: string;
  description: string;
  status: string;
  accent: 'navy' | 'cyan';
}

export interface ExecutiveMember {
  id: string;
  initials: string;
  role: string;
  name: string;
  bio: string;
}

export interface NewsArticle {
  id: string;
  meta: string;
  title: string;
  summary: string;
  imageKey: 'cnc' | 'cad' | 'chemical';
}

export interface TradeEvent {
  id: string;
  month: string;
  days: string;
  year: string;
  sector: string;
  title: string;
  location: string;
  summary: string;
}

export const CONTACT_DEPARTMENTS: ContactDepartment[] = [
  {
    id: 'technical',
    title: 'Technical & Engineering',
    description:
      'Seal selection, CAD drawings, operating limits, and customized troubleshooting.',
    email: 'info@reliableseal.com',
    phone: '+91- 78880 65557',
    accent: 'cyan',
  },
  {
    id: 'sales',
    title: 'Sales & Quotations',
    description:
      'Domestic and export RFQs, volume pricing, and commercial procurement inquiries.',
    email: 'sales@reliableseal.com',
    phone: '+91- 78880 65558',
    accent: 'yellow',
  },
];

export const CERTIFICATION_CARDS_DETAIL: CertificationCardDetail[] = [
  {
    id: 'api-q1',
    badge: 'PETROLEUM & GAS',
    title: 'API Spec Q1 / ISO 29001',
    description:
      'Quality management system specifications for manufacturing organizations in the petroleum and natural gas industries (API 682 4th Edition compliant).',
    status: 'Status: Active & Audited',
    accent: 'cyan',
  },
  {
    id: 'asme-u',
    badge: 'PRESSURE VESSELS',
    title: 'ASME "U" Stamp (115366 BPV)',
    description:
      'American Society of Mechanical Engineers authorization for manufacturing unfired pressure vessels, barrier fluid reservoirs, and heat exchanger systems.',
    status: 'Status: Certified & Registered',
    accent: 'navy',
  },
  {
    id: 'iso-9001',
    badge: 'QUALITY MANAGEMENT',
    title: 'ISO 9001:2015',
    description:
      'International standard for Quality Management Systems covering precision design, raw material traceability, CNC production, and final QA hydro-testing.',
    status: 'Status: Certified QA System',
    accent: 'cyan',
  },
  {
    id: 'atex',
    badge: 'EXPLOSION PROOF',
    title: 'ATEX Directive 2014/34/EU',
    description:
      'Certification of mechanical seals and components for safe, non-sparking operation in explosive gas, vapor, and combustible dust environments (Zone 1 & 2).',
    status: 'Status: CE / Ex Marked',
    accent: 'navy',
  },
  {
    id: 'ehs-iso',
    badge: 'EHS COMPLIANCE',
    title: 'ISO 14001 & ISO 45001',
    description:
      'Integrated Environmental Management and Occupational Health & Safety Systems ensuring eco-friendly operations, zero hazardous emissions, and workplace safety.',
    status: 'Status: Fully Compliant',
    accent: 'cyan',
  },
  {
    id: 'fda-eu',
    badge: 'SANITARY & PHARMA',
    title: 'FDA & EU 1935/2004 Sanitary',
    description:
      'Compliance certificates for seal elastomers and face materials contacting food, beverages, and active pharmaceutical ingredients (USP Class VI certified).',
    status: 'Status: Approved Materials',
    accent: 'navy',
  },
];

export const EXECUTIVE_TEAM: ExecutiveMember[] = [
  {
    id: 'sr-sharma',
    initials: 'SR',
    role: 'Managing Director & Founder',
    name: 'S. R. Sharma',
    bio: 'Over 35 years steering sealing design, international partnerships, and high-precision CNC manufacturing standards across India and global markets.',
  },
  {
    id: 'rajesh-mehta',
    initials: 'RM',
    role: 'VP - Technical & Application Engineering',
    name: 'Er. Rajesh Mehta',
    bio: 'Specialist in API 682 seal plans, CAD/FEA simulation, and high-pressure chemical reactor sealing solutions for extreme temperature services.',
  },
  {
    id: 'kv-joshi',
    initials: 'KJ',
    role: 'Head of Quality Assurance & Compliance',
    name: 'Dr. K. V. Joshi',
    bio: 'Directs metallurgical verification, hydrostatic testing procedures, ISO 9001, ASME, ATEX, and FDA regulatory accreditations.',
  },
];

export const NEWS_RELEASES: NewsArticle[] = [
  {
    id: 'cnc-expansion',
    meta: 'Press Release • October 2026',
    title:
      'Reliable Industries Expands CNC Machining Facility to Meet Global Export Demand',
    summary:
      'Commissioning of new automated 5-axis DMG MORI turning centers accelerates production capacity for API 682 heavy-duty cartridge seals.',
    imageKey: 'cnc',
  },
  {
    id: 'metal-bellows',
    meta: 'Technical Milestone • September 2026',
    title:
      'Development of Next-Gen Metal Bellows Seals for Extreme Temperature Hot Oil',
    summary:
      "Reliable's R&D division achieves operational qualification for high-temperature welded metal bellows seals operating up to 400°C without external cooling.",
    imageKey: 'cad',
  },
  {
    id: 'refinery-upgrade',
    meta: 'Contract Win • August 2026',
    title:
      'Major Petrochemical Refinery Upgrades 80+ Reactor Pumps to Reliable Cartridge Systems',
    summary:
      'Successful plant turnaround retrofit demonstrates zero leakage in highly corrosive acidic solvent handling applications.',
    imageKey: 'chemical',
  },
];

export const TRADE_EVENTS: TradeEvent[] = [
  {
    id: 'adipec-2026',
    month: 'NOV',
    days: '10 - 13',
    year: '2026',
    sector: 'Oil, Gas & Energy',
    title: 'ADIPEC Abu Dhabi International Exhibition',
    location:
      'Abu Dhabi National Exhibition Centre (ADNEC), UAE • Stand Hall 8, Booth 8320',
    summary:
      'Showcasing API 682 4th Edition dual cartridge seals and thermosyphon auxiliary barrier systems.',
  },
  {
    id: 'chemtech-2026',
    month: 'DEC',
    days: '03 - 06',
    year: '2026',
    sector: 'Chemical & Process Engineering',
    title: 'CHEMTECH World Expo Mumbai',
    location:
      'Bombay Exhibition Centre (NESCO), Mumbai, India • Hall 1, Stall B-14',
    summary:
      'Demonstrating sanitary agitator seals for pharma and heavy-duty slurry seals for chemical plants.',
  },
  {
    id: 'hannover-2027',
    month: 'FEB',
    days: '18 - 22',
    year: '2027',
    sector: 'Global Industrial Automation',
    title: 'Hannover Messe Industrial Expo',
    location: 'Hannover Exhibition Grounds, Germany • Hall 24, Stand C45',
    summary:
      'Presenting high-speed rotating unions for water, steam, and high-pressure hydraulic services.',
  },
];
