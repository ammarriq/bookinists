import { defineMiddleware } from 'astro:middleware'
import { generateId, verifyRequestOrigin } from 'lucia'
import { initLucia } from '@/lib/auth'

const getSchema = async () => {
  const { readFile } = await import('node:fs/promises')
  const schema = (await readFile('./schema.sql', 'utf-8')).toString()

  return schema
    .replaceAll(/^-.*/gm, '')
    .replaceAll('\r', '')
    .replaceAll('\n', '')
    .replaceAll(';', ';\n')
    .replaceAll(/;\n\s+END;/g, '; END;')
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, cookies, request } = context

  const db = locals.runtime.env.SITE_DB

  if (import.meta.env.DEV) {
    const schema = await getSchema()
    await db.exec(schema)
    // await db
    //   .prepare(`INSERT INTO users (id, email, role) VALUES (?, ?, ?)`)
    //   .bind(generateId(15), 'ammariqbal043@gmail.com', 'admin')
    //   .run()
  }

  const lucia = initLucia(locals.runtime.env.SITE_DB)

  if (request.method !== 'GET') {
    const origin = request.headers.get('Origin')
    const host = request.headers.get('Host')

    if (!origin || !host || !verifyRequestOrigin(origin, [host])) {
      return new Response(null, { status: 403 })
    }
  }

  const sessionId = cookies.get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    locals.user = null
    locals.session = null

    return next()
  }

  const { session, user } = await lucia.validateSession(sessionId)
  if (session && session.fresh) {
    const { name, value, attributes } = lucia.createSessionCookie(session.id)
    cookies.set(name, value, attributes)
  }

  if (!session) {
    const { name, value, attributes } = lucia.createBlankSessionCookie()
    cookies.set(name, value, attributes)
  }

  locals.session = session
  locals.user = user

  return next()
})
