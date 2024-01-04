import { createActions } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { generateId } from 'lucia'
import { email, flatten, object, picklist, safeParse, string } from 'valibot'

const AddBookSchema = object({
  email: string([email('Email is required')]),
  role: picklist(['admin', 'manager'], 'Invalid role provided'),
})

const EditBookSchema = object({
  id: string('ID is required'),
  role: picklist(['admin', 'manager'], 'Invalid role provided'),
})

const DeleteBookSchema = object({
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
    const result = safeParse(AddBookSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const { results } = await db
      .prepare('SELECT * FROM books WHERE email=?')
      .bind(result.output.email)
      .run()

    if (results.length) {
      const errors = { email: ['Book with that email already exists'] }
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const book = { id: generateId(15), ...result.output }
    await db
      .prepare('INSERT INTO books (id, email, role) VALUES (?, ?, ?)')
      .bind(book.id, book.email, book.role)
      .run()

    return Response.json(
      { data: book, success: true, errors: null },
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
    const result = safeParse(EditBookSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare('UPDATE books SET role=? WHERE id=?')
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
    const result = safeParse(DeleteBookSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const id = result.output.id
    await db.prepare(`DELETE FROM sessions WHERE user_id=?`).bind(id).run()
    await db.prepare(`DELETE FROM books WHERE id=?`).bind(id).run()

    return Response.json(
      { data: { id }, success: true, errors: null },
      { status: 202 }
    )
  },
})
