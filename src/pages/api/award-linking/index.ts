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
} from 'valibot'

const AwardLinkingSchema = object({
  id: string([minLength(15, 'ID is required')]),
  book_id: string([minLength(15, 'Book is required')]),
  award_id: string([minLength(15, 'Award is required')]),
  award_category_id: string([minLength(15, 'Category is required')]),
  created_on: optional(number()),
})

export type AwardLinking = Required<Output<typeof AwardLinkingSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(AwardLinkingSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const award_category: AwardLinking = {
      id: generateId(15),
      book_id: result.output.book_id,
      award_id: result.output.award_id,
      award_category_id: result.output.award_category_id,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO books_awards
        (id, book_id, award_id, award_category_id, created_on) 
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
    const result = safeParse(AwardLinkingSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const award_category: Omit<AwardLinking, 'id' | 'created_on'> = {
      book_id: result.output.book_id,
      award_id: result.output.award_id,
      award_category_id: result.output.award_category_id,
    }

    await db
      .prepare(
        `UPDATE books_awards
        SET book_id=?, award_id=?, award_category_id=?
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

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(pick(AwardLinkingSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare(`DELETE FROM books_awards WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
