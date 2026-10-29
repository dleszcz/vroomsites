export interface SettingsTenantData {
  business_name: string | null;
  business_description: string | null;
  custom_domain: string | null;
  notification_email: string | null;
  google_sheets_webhook_url: string | null;
  contact_phone: string | null;
  whatsapp_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  county: string | null;
  region: string | null;
  pixel_id: string | null;
  autoplac_enabled?: boolean | null;
  slug?: string | null;
  branding: Record<string, unknown> | null;
  analytics: Record<string, unknown> | null;
  opening_hours: Record<string, unknown> | null;
  business_rules: Record<string, unknown> | null;
  seo: Record<string, unknown> | null;
  local_seo?: Record<string, unknown> | null;
  page_config?: Record<string, unknown> | null;
}

export interface SettingsContainerProps {
  tenant: SettingsTenantData;
  targetSlug?: string;
  dealerSlug: string;
}

export type SettingsTabId =
  | "general"
  | "branding"
  | "contact"
  | "integrations"
  | "seo";
