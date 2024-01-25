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

const LocationSchema = object({
  id: string([minLength(15, 'ID is required')]),
  name: string([minLength(4, 'Name is required')]),
  address: string([minLength(5, 'Address is required')]),
  phone: string([minLength(5, 'Phone is required')]),
  url: string('URL is required', [url('Please provide valid url')]),
  notes: string([minLength(1, 'Notes is required')]),
  created_on: optional(number()),
})

const decoder = { numbers: ['width', 'height', 'depth'] }

export type Location = Required<Output<typeof LocationSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData, decoder)
    const result = safeParse(omit(LocationSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const location: Location = {
      id: generateId(15),
      name: result.output.name,
      address: result.output.address,
      phone: result.output.phone,
      url: result.output.url,
      notes: result.output.notes,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO locations
        (id, name, address, phone, url, notes, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(location))
      .run()

    return Response.json(
      { data: location, success: true, errors: null },
      { status: 201 }
    )
  },
  edit: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData, decoder)
    const result = safeParse(LocationSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const location: Omit<Location, 'id' | 'created_on'> = {
      name: result.output.name,
      address: result.output.address,
      phone: result.output.phone,
      url: result.output.url,
      notes: result.output.notes,
    }

    await db
      .prepare(
        `UPDATE locations
        SET name=?, address=?, phone=?, url=?, notes=?
        WHERE id=?`
      )
      .bind(...Object.values(location), result.output.id)
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
    const result = safeParse(pick(LocationSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare(`DELETE FROM locations WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
