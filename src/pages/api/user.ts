import { createActions } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { generateId, type User } from 'lucia'
import { email, flatten, object, picklist, safeParse, string } from 'valibot'

const AddUserSchema = object({
  email: string([email('Email is required')]),
  role: picklist(['admin', 'manager'], 'Invalid role provided'),
})

const EditUserSchema = object({
  id: string('ID is required'),
  role: picklist(['admin', 'manager'], 'Invalid role provided'),
})

const DeleteUserSchema = object({
  id: string('ID is required'),
})

export const POST = createActions({
  add: async ({ locals, request }) => {
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

    const currentUser = await db
      .prepare('SELECT * FROM users WHERE email=?')
      .bind(result.output.email)
      .first<User>()

    if (currentUser) {
      const errors = { email: ['User with that email already exists'] }
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const user = { id: generateId(15), ...result.output }
    await db
      .prepare('INSERT INTO users (id, email, role) VALUES (?, ?, ?)')
      .bind(user.id, user.email, user.role)
      .run()

    return Response.json(
      { data: user, success: true, errors: null },
      { status: 201 }
    )
  },
  edit: async ({ locals, request }) => {
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
  },
  delete: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    if (locals.user.role !== 'admin') {
      return new Response(null, { status: 403 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(DeleteUserSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    if (locals.user.id === result.output.id) {
      const errors = { message: [`You can't delete yourself.`] }
      return Response.json(
        { data: null, success: false, errors },
        { status: 409 }
      )
    }

    const id = result.output.id
    await db.prepare(`DELETE FROM users WHERE id=?`).bind(id).run()

    return Response.json(
      { data: { id }, success: true, errors: null },
      { status: 202 }
    )
  },
})
