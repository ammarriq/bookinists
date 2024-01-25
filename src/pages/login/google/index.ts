import type { APIContext } from 'astro'
import { generateState, generateCodeVerifier } from 'arctic'
import { initGoogleAuth } from '@/lib/auth'

export const GET = async ({ cookies, redirect }: APIContext) => {
  const google = initGoogleAuth()

  const state = generateState()
  const codeVerifier = generateCodeVerifier()

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ['profile', 'email'],
  })

  cookies.set('google_state', state, {
    path: '/',
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  cookies.set('google_code_verifier', codeVerifier, {
    path: '/',
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  return redirect(url.toString())
}
