import type { APIRoute } from 'astro'

import { createActions, values } from '@/lib/utils'
import { list_type } from '@/lib/constants'
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
  picklist,
} from 'valibot'

const ListSchema = object({
  id: string([minLength(15, 'ID is required')]),
  name: string([minLength(4, 'Name is required')]),
  image: string('Image is required', [minLength(15, 'Image is required')]),
  list_type: picklist(list_type, 'Invalid list type selected.'),
  url: string('URL is required', [url('Please provide valid url')]),
  description: string([minLength(20, 'Description is required')]),
  created_on: optional(number()),
})

export type List = Required<Output<typeof ListSchema>>

export const GET = (async ({ url, locals }) => {
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const query = url.searchParams.get('query') ?? ''
  const value = `"${query}"*`

  const res = await db
    .prepare(
      `SELECT id AS value, name AS label FROM lists_fts
      WHERE lists_fts MATCH ?`
    )
    .bind(value)
    .all<Record<'value' | 'label', string>>()

  return Response.json({ data: res.results }, { status: 200 })
}) satisfies APIRoute

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(ListSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const list: List = {
      id: generateId(15),
      image: result.output.image,
      name: result.output.name,
      list_type: result.output.list_type,
      url: result.output.url,
      description: result.output.description,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO lists
        (id, image, name, list_type, url, description, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(list))
      .run()

    return Response.json(
      { data: list, success: true, errors: null },
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
    const result = safeParse(ListSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const list: Omit<List, 'id' | 'created_on'> = {
      image: result.output.image,
      name: result.output.name,
      list_type: result.output.list_type,
      url: result.output.url,
      description: result.output.description,
    }

    await db
      .prepare(
        `UPDATE lists
        SET image=?, name=?, list_type=?, url=?, description=?
        WHERE id=?`
      )
      .bind(...values(list), result.output.id)
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
    const result = safeParse(pick(ListSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const imageKey = await db
      .prepare(`SELECT image FROM lists WHERE id=?`)
      .bind(result.output.id)
      .first<string>('image')

    if (imageKey) bucket.delete(imageKey)

    await db
      .prepare(`DELETE FROM lists WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
