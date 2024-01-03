import type { APIRoute } from 'astro'
import { decode } from 'decode-formdata'
import { generateId } from 'lucia'
import { email, flatten, object, picklist, safeParse, string } from 'valibot'

const AddUserSchema = object({
  email: string([email('Email is required')]),
  role: picklist(['admin', 'manager'], 'Invalid role provided'),
})

const EditUserSchema = object({
  id: string('ID is required'),
  role: picklist(['admin', 'manager'], 'Invalid role provided'),
})

export const POST = (async (context) => {
  const { locals, request } = context
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  if (locals.user.role !== 'admin') {
    return new Response(null, { status: 403 })
  }

  const formData = await request.formData()
  const data = decode(formData)
  const result = safeParse(AddUserSchema, data)

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

export const PUT = (async (context) => {
  const { locals, request } = context
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  if (locals.user.role !== 'admin') {
    return new Response(null, { status: 403 })
  }

  const formData = await request.formData()
  const data = decode(formData)
  const result = safeParse(EditUserSchema, data)

  if (!result.success) {
    const errors = flatten(result.issues).nested
    return Response.json(
      { data: null, success: false, errors },
      { status: 400 }
    )
  }

  await db
    .prepare('UPDATE users SET role=? WHERE id=?')
    .bind(result.output.role, result.output.id)
    .run()

  return Response.json(
    { data: result.output, success: true, errors: null },
    { status: 201 }
  )
}) satisfies APIRoute

export const DELETE = (async (context) => {
  const { locals, request } = context
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  if (locals.user.role !== 'admin') {
    return new Response(null, { status: 403 })
  }

  const id = await request.text()
  const result = safeParse(string('id is required'), id)

  if (!result.success) {
    const errors = flatten(result.issues).nested
    return Response.json(
      { data: null, success: false, errors },
      { status: 400 }
    )
  }

  await db.prepare(`DELETE FROM users WHERE id=?`).bind(id).run()

  return Response.json(
    { data: { id }, success: true, errors: null },
    { status: 202 }
  )
}) satisfies APIRoute
