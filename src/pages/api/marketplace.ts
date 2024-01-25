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
  number,
  optional,
  url,
} from 'valibot'

const MarketplaceSchema = object({
  id: string([minLength(15, 'ID is required')]),
  icon: string('Icon is required', [minLength(15, 'Icon is required')]),
  name: string([minLength(4, 'Name is required')]),
  url: string('URL is required', [url('Please provide valid url')]),
  description: string([minLength(20, 'Must be atleast 20 characters')]),
  created_on: optional(number()),
})

export type Marketplace = Required<Output<typeof MarketplaceSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(MarketplaceSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const marketplace: Marketplace = {
      id: generateId(15),
      icon: result.output.icon,
      name: result.output.name,
      description: result.output.description,
      url: result.output.url,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO marketplaces
        (id, icon, name, description, url, created_on) 
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(marketplace))
      .run()

    return Response.json(
      { data: marketplace, success: true, errors: null },
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
    const result = safeParse(MarketplaceSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const marketplace: Omit<Marketplace, 'id' | 'created_on'> = {
      icon: result.output.icon,
      name: result.output.name,
      description: result.output.description,
      url: result.output.url,
    }

    await db
      .prepare(
        `UPDATE marketplaces
        SET icon=?, name=?, description=?, url=?
        WHERE id=?`
      )
      .bind(...Object.values(marketplace), result.output.id)
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
    const result = safeParse(pick(MarketplaceSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const iconKey = await db
      .prepare(`SELECT icon FROM marketplaces WHERE id=?`)
      .bind(result.output.id)
      .first<string>('icon')

    if (iconKey) bucket.delete(iconKey)

    await db
      .prepare(`DELETE FROM marketplaces WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
