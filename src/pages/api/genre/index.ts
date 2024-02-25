import { createActions } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { generateId } from 'lucia'
import {
  type Output,
  flatten,
  object,
  pick,
  safeParse,
  string,
  minLength,
  omit,
  optional,
  number,
} from 'valibot'

const GenreSchema = object({
  id: string([minLength(15, '')]),
  name: string([minLength(4, 'Name is required')]),
  description: string([minLength(20, 'Must be atleast 20 characters')]),
  created_on: optional(number()),
})

export type Genre = Required<Output<typeof GenreSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(GenreSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const genre: Genre = {
      id: generateId(15),
      name: result.output.name,
      description: result.output.description,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO genres
        (id, name, description, created_on) 
        VALUES (?, ?, ?, ?)`
      )
      .bind(...Object.values(genre))
      .run()

    return Response.json(
      { data: genre, success: true, errors: null },
      { status: 201 }
    )
  },
  edit: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(GenreSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const genre: Omit<Genre, 'id' | 'created_on'> = {
      name: result.output.name,
      description: result.output.description,
    }

    await db
      .prepare(
        `UPDATE genres
        SET name=?, description=?
        WHERE id=?`
      )
      .bind(...Object.values(genre), result.output.id)
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

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(pick(GenreSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare(`DELETE FROM genres WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
