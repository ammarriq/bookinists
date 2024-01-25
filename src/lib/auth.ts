import type { D1Database } from '@cloudflare/workers-types'
import { Lucia } from 'lucia'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { Google } from 'arctic'

export const initLucia = (db: D1Database) => {
  const adapter = new D1Adapter(db, {
    user: 'users',
    session: 'sessions',
  })

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: import.meta.env.PROD,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        name: attributes.name,
        picture: attributes.picture,
        email: attributes.email,
        role: attributes.role,
      }
    },
  })
}

export const initGoogleAuth = () =>
  new Google(
    import.meta.env.GOOGLE_CLIENT_ID,
    import.meta.env.GOOGLE_CLIENT_SECRET,
    import.meta.env.GOOGLE_REDIRECT_URI
  )

declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof initLucia>
  }

  interface DatabaseUserAttributes extends User {}
}

export interface User {
  id: string
  name?: string
  picture?: string
  email: string
  role: string
  social_id?: string
  network?: string
  last_login?: string
  last_ip?: string
  last_country?: string
}
