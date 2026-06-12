export type FilterCountOption = {
  value: string;
  label: string;
  count: number;
};

export type MarketplaceFilterOptions = {
  brands: FilterCountOption[];
  modelsByBrand: Record<string, FilterCountOption[]>;
  cities: FilterCountOption[];
  districtsByCity: Record<string, FilterCountOption[]>;
  damageCounts: Record<string, number>;
  gradeCounts: Record<string, number>;
  fuelCounts: Record<string, number>;
  transmissionCounts: Record<string, number>;
  tramerYes: number;
  tramerNo: number;
  negotiable: number;
  verifiedDealers: number;
  featured: number;
  photos: number;
  damageNotes: number;
  priceMin: number | null;
  priceMax: number | null;
  yearMin: number | null;
  yearMax: number | null;
  kmMin: number | null;
  kmMax: number | null;
};

export const EMPTY_MARKETPLACE_FILTER_OPTIONS: MarketplaceFilterOptions = {
  brands: [],
  modelsByBrand: {},
  cities: [],
  districtsByCity: {},
  damageCounts: {},
  gradeCounts: {},
  fuelCounts: {},
  transmissionCounts: {},
  tramerYes: 0,
  tramerNo: 0,
  negotiable: 0,
  verifiedDealers: 0,
  featured: 0,
  photos: 0,
  damageNotes: 0,
  priceMin: null,
  priceMax: null,
  yearMin: null,
  yearMax: null,
  kmMin: null,
  kmMax: null,
};
