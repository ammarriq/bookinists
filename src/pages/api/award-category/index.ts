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

const AwardCategorySchema = object({
  id: string([minLength(15, 'ID is required')]),
  name: string([minLength(4, 'Name is required')]),
  description: string([minLength(20, 'Must be atleast 20 characters')]),
  url: string('URL is required', [url('Please provide valid url')]),
  created_on: optional(number()),
})

export type AwardCategory = Required<Output<typeof AwardCategorySchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(AwardCategorySchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const award_category: AwardCategory = {
      id: generateId(15),
      name: result.output.name,
      description: result.output.description,
      url: result.output.url,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO awards_categories
        (id, name, description, url, created_on) 
        VALUES (?, ?, ?, ?, ?)`
      )
      .bind(...values(award_category))
      .run()

    return Response.json(
      { data: award_category, success: true, errors: null },
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
    const result = safeParse(AwardCategorySchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const award_category: Omit<AwardCategory, 'id' | 'created_on'> = {
      name: result.output.name,
      description: result.output.description,
      url: result.output.url,
    }

    await db
      .prepare(
        `UPDATE awards_categories
        SET name=?, description=?, url=?
        WHERE id=?`
      )
      .bind(...values(award_category), result.output.id)
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
    const result = safeParse(pick(AwardCategorySchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare(`DELETE FROM awards_categories WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
