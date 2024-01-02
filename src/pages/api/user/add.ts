import type { APIRoute } from 'astro'
import { decode } from 'decode-formdata'
import { generateId } from 'lucia'
import { email, flatten, object, picklist, safeParse, string } from 'valibot'

export const POST = (async (context) => {
  const { locals, request } = context
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const formData = await request.formData()
  const data = decode(formData)
  const result = safeParse(UserSchema, data)

  if (!result.success) {
    const errors = flatten(result.issues).nested
    return Response.json(
      { data: null, success: false, errors },
      { status: 400 }
    )
  }

  const { results } = await db
    .prepare('SELECT * FROM users WHERE email=?')
    .bind(result.output.email)
    .run()

  if (results.length) {
    const errors = { email: ['User with that already exists'] }
    return Response.json(
      { data: null, success: false, errors },
      { status: 400 }
    )
  }

  const uid = generateId(15)
  await db
    .prepare('INSERT INTO users (id, email, role) VALUES (?, ?, ?)')
    .bind(uid, result.output.email, result.output.role)
    .run()

  const user = { uid, ...result.output }
  return Response.json(
    { data: user, success: true, errors: null },
    { status: 201 }
  )
}) satisfies APIRoute

const UserSchema = object({
  email: string([email('Email is required')]),
  role: picklist(['admin', 'manager'], 'Invalid role provided'),
})
