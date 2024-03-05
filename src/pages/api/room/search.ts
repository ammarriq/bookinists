import type { APIRoute } from 'astro'

export const GET = (async ({ url, locals }) => {
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const query = url.searchParams.get('query') ?? ''
  const value = `"${query}"*`

  const res = await db
    .prepare(
      `SELECT id AS value, name AS label FROM rooms_fts
      WHERE rooms_fts MATCH ?`
    )
    .bind(value)
    .all<Record<'value' | 'label', string>>()

  return Response.json({ data: res.results }, { status: 200 })
}) satisfies APIRoute
