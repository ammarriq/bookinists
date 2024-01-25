import type { APIRoute } from 'astro'

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

const CountrySchema = object({
  id: string([minLength(15, '')]),
  name: string([minLength(4, 'Name is required')]),
  flag: string('Flag is required', [minLength(15, 'Flag is required')]),
  created_on: optional(number()),
})

export type Country = Required<Output<typeof CountrySchema>>

export const GET = (async ({ locals }) => {
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const { results } = await db.prepare('SELECT * FROM countries').run<Country>()

  return Response.json(
    { data: results, success: true, errors: null },
    { status: 200 }
  )
}) satisfies APIRoute

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(CountrySchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const country: Country = {
      id: generateId(15),
      name: result.output.name,
      flag: result.output.flag,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO countries
        (id, name, flag, created_on) 
        VALUES (?, ?, ?, ?)`
      )
      .bind(...Object.values(country))
      .run()

    return Response.json(
      { data: country, success: true, errors: null },
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
    const result = safeParse(CountrySchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const country: Omit<Country, 'id' | 'created_on'> = {
      name: result.output.name,
      flag: result.output.flag,
    }

    await db
      .prepare(
        `UPDATE countries
        SET name=?, flag=?
        WHERE id=?`
      )
      .bind(...Object.values(country), result.output.id)
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
    const result = safeParse(pick(CountrySchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const flagKey = await db
      .prepare(`SELECT flag FROM countries WHERE id=?`)
      .bind(result.output.id)
      .first<string>('flag')

    if (flagKey) bucket.delete(flagKey)

    await db
      .prepare(`DELETE FROM countries WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
