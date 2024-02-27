import { createActions, values } from '@/lib/utils'
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
  number,
  optional,
  nullable,
} from 'valibot'

const AuthorSchema = object({
  id: string([minLength(15, 'ID is required')]),
  name: string([minLength(4, 'Name is required')]),
  avatar: string('Avatar is required', [minLength(15, 'Avatar is required')]),
  info: string([minLength(20, 'Must be atleast 20 characters')]),
  country_id: nullable(string()),
  created_on: optional(number()),
})

export type Author = Required<Output<typeof AuthorSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(AuthorSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const author: Author = {
      id: generateId(15),
      name: result.output.name,
      avatar: result.output.avatar,
      info: result.output.info,
      country_id: result.output.country_id || null,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO authors
        (id, name, avatar, info, country_id, created_on) 
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(author))
      .run()

    return Response.json(
      { data: author, success: true, errors: null },
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
    const result = safeParse(AuthorSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const author: Omit<Author, 'id' | 'created_on'> = {
      name: result.output.name,
      avatar: result.output.avatar,
      info: result.output.info,
      country_id: result.output.country_id,
    }

    await db
      .prepare(
        `UPDATE authors
        SET name=?, avatar=?, info=?, country_id=?
        WHERE id=?`
      )
      .bind(...values(author), result.output.id)
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 201 }
    )
  },
  delete: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB
    const bucket = locals.runtime.env.SITE_BUCKET

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(pick(AuthorSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const avatarKey = await db
      .prepare(`SELECT avatar FROM authors WHERE id=?`)
      .bind(result.output.id)
      .first<string>('avatar')

    if (avatarKey) bucket.delete(avatarKey)

    await db
      .prepare(`DELETE FROM authors WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
