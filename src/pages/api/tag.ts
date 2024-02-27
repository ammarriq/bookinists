import type { APIRoute } from 'astro'

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
} from 'valibot'

const TagSchema = object({
  id: string([minLength(15, '')]),
  name: string([minLength(4, 'Name is required')]),
  description: string([minLength(20, 'Description is required')]),
  icon: string('Icon is required', [minLength(15, 'Icon is required')]),
  text_color: string([minLength(6, 'Text color is required')]),
  bg_color: string([minLength(6, 'Background color is required')]),
  created_on: optional(number()),
})

export type Tag = Required<Output<typeof TagSchema>>

export const GET = (async ({ url, locals }) => {
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const query = url.searchParams.get('query') ?? ''
  const value = `"${query}"*`

  const res = await db
    .prepare(
      `SELECT id AS value, name AS label FROM tags_fts
      WHERE tags_fts MATCH ?`
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
    const result = safeParse(omit(TagSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const tag: Tag = {
      id: generateId(15),
      name: result.output.name,
      description: result.output.description,
      icon: result.output.icon,
      text_color: result.output.text_color,
      bg_color: result.output.bg_color,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO tags
        (id, name, description, icon, text_color, bg_color, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(tag))
      .run()

    return Response.json(
      { data: tag, success: true, errors: null },
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
    const result = safeParse(TagSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const tag: Omit<Tag, 'id' | 'created_on'> = {
      name: result.output.name,
      description: result.output.description,
      icon: result.output.icon,
      text_color: result.output.text_color,
      bg_color: result.output.bg_color,
    }

    await db
      .prepare(
        `UPDATE tags
        SET name=?, description=?, icon=?, text_color=?, bg_color=?
        WHERE id=?`
      )
      .bind(...values(tag), result.output.id)
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
    const result = safeParse(pick(TagSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const iconKey = await db
      .prepare(`SELECT icon FROM tags WHERE id=?`)
      .bind(result.output.id)
      .first<string>('icon')

    if (iconKey) bucket.delete(iconKey)

    await db
      .prepare(`DELETE FROM tags WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
