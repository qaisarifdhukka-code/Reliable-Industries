/**
 * Centralized Site & SEO Configuration
 *
 * Verified business details extracted strictly from `_reference/`.
 * Fields not present in `_reference/` (social profile URLs) remain `TBD`.
 */

export interface SiteConfig {
  brandName: string;
  brandFirst: string;
  brandSecond: string;
  tagline: string;
  mfgSubline1: string;
  mfgSubline2: string;
  defaultTitle: string;
  defaultDescription: string;
  locale: string;
  siteUrl: string;
  copyrightYear: number;
  brochurePath: string;
  brochureDownloadName: string;
  businessDetails: {
    email: string;
    departmentEmails: {
      tech: string;
      sales: string;
      dispatch: string;
      quality: string;
      privacy: string;
      contracts: string;
    };
    phones: string[];
    whatsappUrl: string;
    hours: string;
    emergencyLineLabel: string;
    addressLines: string[];
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  brandName: 'Reliable Industries',
  brandFirst: 'Reliable',
  brandSecond: 'Industries',
  tagline: 'PIONEER IN SEALING',
  mfgSubline1: 'MFG. OF : Mechanical Shaft Seal,',
  mfgSubline2: 'Rotary Joints & Spares',
  defaultTitle: 'Reliable Industries - Pioneer in Sealing',
  defaultDescription:
    'Providing reliable sealing solutions for industrial rotating equipment worldwide.',
  locale: 'en_US',
  siteUrl: import.meta.env.PUBLIC_SITE_URL || 'https://reliableseal.com',
  copyrightYear: 2026,
  brochurePath: '/brochures/product_brochure.pdf',
  brochureDownloadName: 'Reliable_Product_Brochure.pdf',
  businessDetails: {
    email: 'info@reliableseal.com',
    departmentEmails: {
      tech: 'tech@reliableseal.com',
      sales: 'sales@reliableseal.com',
      dispatch: 'dispatch@reliableseal.com',
      quality: 'quality@reliableseal.com',
      privacy: 'privacy@reliableseal.com',
      contracts: 'contracts@reliableseal.com',
    },
    phones: ['+91- 78880 65557', '+91- 78880 65558', '+91- 78880 65559'],
    whatsappUrl:
      'https://wa.me/917888065557?text=Hello%20Reliable%20Industries%2C%20I%20have%20an%20inquiry',
    hours: 'Monday - Saturday: 9:00 AM - 7:00 PM IST',
    emergencyLineLabel: '24/7 Breakdown Emergency Line',
    addressLines: [
      'AF-02, 03, 04 Saraf Kaskar Ind. Prem Co-op. Soc. Ltd.,',
      'S.V.Road, Oshiwara, Jogeshwari (W),',
      'Mumbai - 400102',
    ],
    streetAddress:
      'AF-02, 03, 04 Saraf Kaskar Ind. Prem Co-op. Soc. Ltd., S.V.Road, Oshiwara, Jogeshwari (W)',
    city: 'Mumbai',
    postalCode: '400102',
    country: 'IN',
  },
};
