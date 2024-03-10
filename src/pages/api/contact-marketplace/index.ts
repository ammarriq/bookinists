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

const MarketplaceSchema = object({
  id: string([minLength(15, 'ID is required')]),
  name: string([minLength(4, 'Name is required')]),
  shop_url: string('URL is required', [url('Please provide valid url')]),
  description: string([minLength(20, 'Must be atleast 20 characters')]),
  contact_id: nullable(string()),
  marketplace_id: nullable(string()),
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
      name: result.output.name,
      description: result.output.description,
      shop_url: result.output.shop_url,
      contact_id: result.output.contact_id || null,
      marketplace_id: result.output.marketplace_id || null,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO contacts_marketplaces
        (id, name, description, shop_url, contact_id, marketplace_id, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(marketplace))
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
      name: result.output.name,
      description: result.output.description,
      shop_url: result.output.shop_url,
      contact_id: result.output.contact_id || null,
      marketplace_id: result.output.marketplace_id || null,
    }

    await db
      .prepare(
        `UPDATE contacts_marketplaces
        SET name=?, description=?, shop_url=?, contact_id=?, marketplace_id=?
        WHERE id=?`
      )
      .bind(...values(marketplace), result.output.id)
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
    const result = safeParse(pick(MarketplaceSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare(`DELETE FROM contacts_marketplaces WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
