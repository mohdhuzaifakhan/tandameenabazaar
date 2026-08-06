export const COLOR_PALETTES = {
  emerald: {
    name: 'Mint Emerald',
    bgColor: 'bg-[#eaf5ef]',
    borderColor: 'border-emerald-100/90',
    tagColor: 'text-[#056839]',
    btnBg: 'bg-[#056839]'
  },
  indigo: {
    name: 'Indigo Blue',
    bgColor: 'bg-[#eef2ff]',
    borderColor: 'border-indigo-100',
    tagColor: 'text-indigo-700',
    btnBg: 'bg-indigo-700'
  },
  rose: {
    name: 'Rose Pink',
    bgColor: 'bg-[#fff1f2]',
    borderColor: 'border-rose-100',
    tagColor: 'text-rose-700',
    btnBg: 'bg-rose-700'
  },
  amber: {
    name: 'Warm Amber / Beige',
    bgColor: 'bg-[#f4efe8]',
    borderColor: 'border-amber-200/60',
    tagColor: 'text-amber-800',
    btnBg: 'bg-[#056839]'
  }
};

export const INITIAL_BANNER_FORM = {
  type: 'special_offer',
  tag: 'SPECIAL OFFER',
  title: '',
  subtitle: '',
  discount: '20% OFF',
  image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
  themeKey: 'emerald',
  link: '/categories',
  active: true
};

export const BANNER_TYPE_OPTIONS = [
  { value: 'special_offer', label: 'Special Offer Hero Slider (Home Screen)' },
  { value: 'new_arrival', label: 'New Arrival Promotion Banner (Home Screen)' }
];

export const FILTER_TYPE_TABS = [
  { id: 'all', label: 'All Banners' },
  { id: 'special_offer', label: 'Special Offers' },
  { id: 'new_arrival', label: 'New Arrivals' }
];
