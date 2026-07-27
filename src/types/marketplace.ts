export type DamageGrade = 'A' | 'B' | 'C' | 'D' | 'E';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'sold' | 'rejected' | 'expired';
export type FuelType = 'benzin' | 'dizel' | 'lpg' | 'elektrik' | 'hibrit';
export type TransmissionType = 'manuel' | 'otomatik';
export type ContactType = 'whatsapp' | 'phone' | 'message';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type DealerSubscriptionStatus = 'pending' | 'active' | 'suspended' | 'expired';
export type DealerSubscriptionPlan = 'basic' | 'professional' | 'premium';

export interface Dealer {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  city: string;
  district: string | null;
  logo_url: string | null;
  description: string | null;
  slug: string | null;
  subscription_status: DealerSubscriptionStatus;
  subscription_plan: DealerSubscriptionPlan | null;
  subscription_start: string | null;
  subscription_end: string | null;
  is_approved: boolean;
  is_verified: boolean;
  total_listings: number;
  total_views: number;
  total_contacts: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  dealer_id: string;
  slug: string;
  status: ListingStatus;
  title: string;
  brand: string;
  model: string;
  year: number;
  fuel_type: FuelType | null;
  transmission: TransmissionType | null;
  km: number | null;
  color: string | null;
  city: string;
  district: string | null;
  damage_type: string[];
  damage_grade: DamageGrade | null;
  damage_description: string | null;
  description: string | null;
  has_tramer: boolean;
  tramer_amount: number | null;
  asking_price: number;
  is_price_negotiable: boolean;
  is_featured: boolean;
  featured_until: string | null;
  images: string[];
  primary_image: string | null;
  view_count: number;
  whatsapp_click_count: number;
  phone_click_count: number;
  favorite_count: number;
  locale: string;
  plate_hidden: boolean;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  sold_at: string | null;
  expires_at: string | null;
  dealer?: Dealer;
}

export interface ListingFilters {
  brand?: string;
  model?: string;
  district?: string;
  year_min?: string;
  year_max?: string;
  km_min?: string;
  km_max?: string;
  price_min?: string;
  price_max?: string;
  damage_type?: string;
  grade?: string;
  city?: string;
  fuel_type?: string;
  transmission?: string;
  has_tramer?: string;
  negotiable?: string;
  verified_dealer?: string;
  featured?: string;
  has_photos?: string;
  has_damage_note?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'views_desc' | 'km_asc' | 'year_desc';
  page?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price_monthly: number;
  max_listings: number;
  listing_duration_days: number;
  can_feature_listings: boolean;
  featured_slots: number;
  can_see_analytics: boolean;
  has_verified_badge: boolean;
  has_priority_support: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface DealerMessage {
  id: string;
  listing_id: string;
  dealer_id: string;
  sender_name: string;
  sender_phone: string;
  sender_email: string | null;
  message: string;
  is_read: boolean;
  replied_at: string | null;
  created_at: string;
}

export const GRADE_COLORS: Record<DamageGrade, { bg: string; label: string }> = {
  A: { bg: '#16a34a', label: 'A — Çok Az Hasar' },
  B: { bg: '#65a30d', label: 'B — Az Hasar' },
  C: { bg: '#d97706', label: 'C — Orta Hasar' },
  D: { bg: '#ea580c', label: 'D — Ağır Hasar' },
  E: { bg: '#B22300', label: 'E — Çok Ağır Hasar' },
};

export const GRADE_DESCRIPTIONS: Record<DamageGrade, string> = {
  A: 'Cosmetic hasar — araç sürülabilir ve kolayca onarılabilir',
  B: 'Hafif hasar — onarım maliyeti düşük',
  C: 'Orta hasar — önemli onarım gerektirir ama ekonomik',
  D: 'Ağır hasar — yüksek onarım maliyeti',
  E: 'Çok ağır hasar / pert — ekonomik onarım mümkün değil',
};

export const LISTINGS_PER_PAGE = 20;
