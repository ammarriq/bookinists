import type { APIContext } from 'astro'
import type { D1Result } from '@cloudflare/workers-types'
import type { DatabaseUserAttributes } from 'lucia'

import { OAuth2RequestError } from 'arctic'
import { initGoogleAuth, initLucia } from '@/lib/auth'

export const GET = async (context: APIContext) => {
  const { url, cookies, clientAddress, redirect } = context
  const db = context.locals.runtime.env.SITE_DB

  const lucia = initLucia(db)
  const google = initGoogleAuth()

  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = cookies.get('google_state')?.value ?? null
  const codeVerifier = cookies.get('google_code_verifier')?.value ?? null

  if (!code || !storedState || !codeVerifier || state !== storedState) {
    return new Response(null, { status: 400 })
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier)
    const googleUser = await getGoogleUser(tokens.accessToken)

    const { results } = (await db
      .prepare(`SELECT * FROM users WHERE email = ?`)
      .bind(googleUser.email)
      .run()) as D1Result<DatabaseUserAttributes>

    const user = results[0]

    if (!user) {
      return redirect('/login?error=You+are+not+registered')
    }

    if (user.network && user.network !== 'google') {
      return redirect('login?error=Linked+with+another+provider')
    }

    if (!user.network) {
      const { name, picture, sub } = googleUser
      await db
        .prepare(
          `UPDATE users SET name=?, picture=?, social_id=?, network=? WHERE id=?`
        )
        .bind(name, picture, sub, 'google', user.id)
        .run()
    }

    await db
      .prepare(`UPDATE users SET last_ip=?, last_login=? WHERE id=?`)
      .bind(clientAddress, Date.now(), user.id)
      .run()

    const session = await lucia.createSession(user.id, {})
    const { name, value, attributes } = lucia.createSessionCookie(session.id)
    cookies.set(name, value, attributes)

    return redirect(`/admin`)
  } catch (e) {
    if ((e as OAuth2RequestError).message === 'bad_verification_code') {
      return new Response(null, { status: 400 })
    }
    console.log(e)

    return new Response(null, { status: 500 })
  }
}

const getGoogleUser = async (accessToken: string) => {
  const options = {
    headers: { Authorization: `Bearer ${accessToken}` },
  }

  const res = await fetch(import.meta.env.GOOGLE_USER_URL, options)
  const user = (await res.json()) as User

  return user
}

type User = {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: string
  locale: string
}
