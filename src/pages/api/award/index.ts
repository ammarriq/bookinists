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
  url,
  nullable,
} from 'valibot'

const AwardSchema = object({
  id: string([minLength(15, 'ID is required')]),
  image: string('Image is required', [minLength(15, 'Image is required')]),
  name: string([minLength(4, 'Name is required')]),
  description: string([minLength(20, 'Must be atleast 20 characters')]),
  url: string('URL is required', [url('Please provide valid url')]),
  country_id: nullable(string()),
  genre_id: nullable(string()),
  created_on: optional(number()),
})

export type Award = Required<Output<typeof AwardSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(AwardSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const award: Award = {
      id: generateId(15),
      image: result.output.image,
      name: result.output.name,
      description: result.output.description,
      url: result.output.url,
      country_id: result.output.country_id || null,
      genre_id: result.output.genre_id || null,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO awards
        (id, image, name, description, url, country_id, genre_id, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(award))
      .run()

    return Response.json(
      { data: award, success: true, errors: null },
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
    const result = safeParse(AwardSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const award: Omit<Award, 'id' | 'created_on'> = {
      image: result.output.image,
      name: result.output.name,
      description: result.output.description,
      url: result.output.url,
      country_id: result.output.country_id,
      genre_id: result.output.genre_id,
    }

    await db
      .prepare(
        `UPDATE awards
        SET image=?, name=?, description=?, url=?, country_id=?, genre_id=?
        WHERE id=?`
      )
      .bind(...values(award), result.output.id)
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
    const result = safeParse(pick(AwardSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const imageKey = await db
      .prepare(`SELECT image FROM awards WHERE id=?`)
      .bind(result.output.id)
      .first<string>('image')

    if (imageKey) bucket.delete(imageKey)

    await db
      .prepare(`DELETE FROM awards WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
