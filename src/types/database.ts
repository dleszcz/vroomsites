export interface Tenant {
  id: string;
  slug: string;
  business_name: string;
  business_description: string | null;
  logo_url: string | null;
  pixel_id: string | null;
  whatsapp_number: string | null;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  postal_code?: string | null;
  county?: string | null;
  region?: string | null;
  custom_domain?: string | null;
  branding?: Record<string, unknown>;
  services?: Record<string, unknown>[];
  page_config?: Record<string, unknown>;
  seo?: Record<string, unknown>;
  local_seo?: Record<string, unknown>;
  business_rules?: Record<string, unknown>;
  analytics?: Record<string, unknown>;
  user_id?: string | null;
  notification_email?: string | null;
  google_sheets_webhook_url?: string | null;
  opening_hours?: Record<string, unknown>;
  is_super_admin?: boolean;
  has_active_site?: boolean;
  created_at: string;
}


export interface Car {
  id: string;
  tenant_id: string;
  slug: string;
  make: string;
  model: string;
  year: number | null;
  price: number | null;
  mileage: number | null;
  fuel_type: string | null;
  engine_capacity: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  images: string[];
  is_sold: boolean;
  is_featured: boolean;
  created_at: string;
}
