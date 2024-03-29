export const storage_type = ['shelve', 'box', 'safe', 'other'] as const

export const list_type = ['serie', 'universe'] as const

export const favorite_contact = ['email', 'whatsapp', 'phone'] as const

export const read_status = ['unread', 'reading', 'read'] as const

export const status = ['want', 'bought', 'own', 'lost', 'sold'] as const

export const protection = [
  'none',
  'mylar',
  'case',
  'mylar_case',
  'multibooks_case',
  'mylar_multibooks_case',
] as const

export const binding = ['hardback', 'paperback'] as const

export const signature_type = [
  'inscribed_flat',
  'inscribed_flat_dated',
  'inscribed_to',
  'inscribed_to_dated',
  'bookplate_flat',
  'bookplate_dated',
  'bookplate_to',
  'bookplate_dated_to',
] as const

export const condition = [
  { value: 'N', label: 'As new' },
  { value: 'F', label: 'Fine' },
  { value: 'NF', label: 'Near fine' },
  { value: 'VG', label: 'Very good' },
  { value: 'G', label: 'Good' },
  { value: 'FR', label: 'Fair' },
  { value: 'P', label: 'Poor' },
] as const

export const lend_status = ['not_lending', 'available', 'lent'] as const

export const thumbnail_type = [
  'cover',
  'back',
  'spine',
  'top',
  'bottom',
  'side',
  'other',
] as const

export const DEFAULT_ERROR = 'Something went wrong. Try again later.'
