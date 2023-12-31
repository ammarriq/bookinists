export type Locales = keyof typeof translations
type Translations = keyof (typeof translations)[Locales]

const translations = {
  en: {
    'admin.nav.admin': 'Admin',
    'admin.nav.users': 'Users',
    'admin.nav.books': 'Books',
    'admin.header.nav.logout': 'Logout',
  },
} as const

export const defaultLang = 'en'
export const languages = ['en']

export const getTranslation = (currentLocale: Locales) => {
  return (key: Translations) => translations[currentLocale][key]
}
