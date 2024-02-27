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
  optional,
  number,
  nullable,
} from 'valibot'

const PublisherSchema = object({
  id: string([minLength(15, 'ID is required')]),
  name: string([minLength(4, 'Name is required')]),
  logo: string('Logo is required', [minLength(15, 'Logo is required')]),
  info: string([minLength(20, 'Must be atleast 20 characters')]),
  country_id: nullable(string()),
  created_on: optional(number()),
})

export type Publisher = Required<Output<typeof PublisherSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(PublisherSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const publisher: Publisher = {
      id: generateId(15),
      name: result.output.name,
      logo: result.output.logo,
      info: result.output.info,
      country_id: result.output.country_id || null,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO publishers
        (id, name, logo, info, country_id, created_on) 
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(publisher))
      .run()

    return Response.json(
      { data: publisher, success: true, errors: null },
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
    const result = safeParse(PublisherSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const publisher: Omit<Publisher, 'id' | 'created_on'> = {
      name: result.output.name,
      logo: result.output.logo,
      info: result.output.info,
      country_id: result.output.country_id || null,
    }

    await db
      .prepare(
        `UPDATE publishers
        SET name=?, logo=?, info=?, country_id=?
        WHERE id=?`
      )
      .bind(...values(publisher), result.output.id)
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
    const result = safeParse(pick(PublisherSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const logoKey = await db
      .prepare(`SELECT logo FROM publishers WHERE id=?`)
      .bind(result.output.id)
      .first<string>('logo')

    if (logoKey) bucket.delete(logoKey)

    await db
      .prepare(`DELETE FROM publishers WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
