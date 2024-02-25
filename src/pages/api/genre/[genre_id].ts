import type { APIRoute } from 'astro'

export const GET = (async ({ params, locals }) => {
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const id = params.genre_id
  if (!id) {
    return Response.json(
      { data: null, success: false, error: null },
      { status: 404 }
    )
  }

  const result = await db
    .prepare(`SELECT id AS value, name AS label FROM genres WHERE id=?`)
    .bind(id)
    .first<Record<'value' | 'label', string>>()

  return Response.json({ data: result }, { status: 200 })
}) satisfies APIRoute
