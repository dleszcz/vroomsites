export type ServiceType =
  | "car_buying"
  | "car_sales"
  | "towing"
  | "roadside_assistance"
  | "car_import"
  | "car_transport"
  | "financing"
  | "trade_in";

export interface DealerService {
  id: string;
  type: ServiceType;
  enabled: boolean;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaType?: "phone" | "whatsapp" | "lead_form" | "link";
  ctaValue?: string;
}

export interface DealerBranding {
  logoUrl?: string | null;
  logoDarkUrl?: string | null;
  faviconUrl?: string | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  colors: {
    primary: string;
    primaryForeground: string;
    background: string;
    foreground: string;
    accent: string;
    accentForeground: string;
    surface?: string;
    muted?: string;
    headerBg?: string;
    footerBg?: string;
  };
  media?: {
    heroImageUrl?: string;
    heroMobileImageUrl?: string;
    ogImageUrl?: string;
  };
}


export interface HeroConfig {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
  primaryCta?: { label?: string; sublabel?: string; href?: string };
  secondaryCta?: { label?: string; sublabel?: string; href?: string };
  benefits?: { label: string; icon?: "cash" | "check" | "truck" | "scale" }[];
  showAccent?: boolean;
}
export type SectionType =
  | "hero"
  | "services"
  | "trust"
  | "process"
  | "vehicles"
  | "reviews"
  | "about"
  | "faq"
  | "lead_form"
  | "map"
  | "contact"
  | "service_areas";


export interface SectionConfig {
  id: string;
  type: SectionType;
  variant?: string;
  enabled: boolean;
  title?: string;
  subtitle?: string;
  data?: Record<string, unknown>;
}

export interface LandingPageConfig {
  sections: SectionConfig[];
}

export interface PrimaryLocation {
  city: string;
  locality?: string | null;
  county?: string | null;
  region?: string | null;
  postalCode?: string | null;
}

export interface ServiceArea {
  city: string;
  slug: string;
  enabled: boolean;
  indexable: boolean;
  priority: number;
}

export interface LocalPageSeo {
  title?: string;
  metaDescription?: string;
  h1?: string;
}

export interface LocalPageFaq {
  q: string;
  a: string;
}

export interface LocalPageContent {
  intro?: string;
  serviceDescription?: string;
  locationNote?: string;
  faq?: LocalPageFaq[];
}

export interface LocalPageConfig {
  slug: string;
  city: string;
  enabled: boolean;
  indexable: boolean;
  priority: number;
  showInLocalAreaLinks?: boolean;
  showInFooter?: boolean;
  relatedLocations?: string[];
  seo?: LocalPageSeo;
  content?: LocalPageContent;
  media?: {
    heroImage?: string;
  };
}


export interface LocalSeoConfig {
  primaryLocation?: PrimaryLocation;
  serviceAreas?: ServiceArea[];
  localPages?: LocalPageConfig[];
}

export interface TradeInRule {
  enabled: boolean;
  title?: string;
  description?: string;
}

export interface PurchasePriceLimitRule {
  enabled: boolean;
  maxAmount: number;
  currency: string;
  description?: string;
}

export interface DealerBusinessRules {
  tradeIn?: TradeInRule;
  purchasePriceLimit?: PurchasePriceLimitRule;
}

export interface DealerTenant {
  id: string;
  slug: string;
  customDomain?: string | null;
  businessName: string;
  businessDescription?: string | null;
  logoUrl?: string | null;
  contact: {
    phone?: string | null;
    whatsapp?: string | null;
    email?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
  };
  location?: {
    address?: string | null;
    city?: string | null;
    postalCode?: string | null;
    county?: string | null;
    region?: string | null;
    mapCoordinates?: { lat: number; lng: number };
  };
  branding: DealerBranding;
  services: DealerService[];
  pageConfig: LandingPageConfig;
  analytics?: {
    pixelId?: string | null;
    googleAnalyticsId?: string | null;
  };
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
  localSeo?: LocalSeoConfig;
  businessRules?: DealerBusinessRules;
  features?: DealerFeatures;
}

/** Tenant feature flags. Missing flag = enabled (backwards compatible). */
export interface DealerFeatures {
  /** "Skup aut" – buying cars from customers (lead form, /skup-aut, CTAs) */
  carBuying: boolean;
}

export function hasCarBuying(tenant: { features?: DealerFeatures } | null | undefined): boolean {
  return tenant?.features?.carBuying !== false;
}



export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "offer_made"
  | "purchased"
  | "rejected"
  | "lost";

export interface LeadVehicleData {
  brand?: string;
  make?: string;
  model?: string;
  year?: number | string;
  mileage?: number | string;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  expectedPrice?: number | string;
  description?: string;
  dealerName?: string;
  city?: string;
  note?: string;
}

export interface LeadAttribution {
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  localSeoCity?: string;
}

export interface Lead {
  id?: string;
  dealerId: string;
  source: string;
  campaign?: string;
  landingPath: string;
  customerName?: string;
  customerPhone: string;
  customerEmail?: string;
  vehicleDetails?: LeadVehicleData;
  attribution?: LeadAttribution;
  localSeoCity?: string;
  photos?: string[];
  tenantEmail?: string;
  status: LeadStatus;
  createdAt?: string;
}
