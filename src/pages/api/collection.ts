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

const CollectionSchema = object({
  id: string([minLength(15, '')]),
  name: string([minLength(4, 'Name is required')]),
  description: string([minLength(20, 'Must be atleast 20 characters')]),
  image: string('Image is required', [minLength(15, 'Image is required')]),
  created_on: optional(number()),
})

export type Collection = Required<Output<typeof CollectionSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(CollectionSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const collection: Collection = {
      id: generateId(15),
      name: result.output.name,
      description: result.output.description,
      image: result.output.image,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO collections
        (id, name, description, image, created_on) 
        VALUES (?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(collection))
      .run()

    return Response.json(
      { data: collection, success: true, errors: null },
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
    const result = safeParse(CollectionSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const collection: Omit<Collection, 'id' | 'created_on'> = {
      name: result.output.name,
      description: result.output.description,
      image: result.output.image,
    }

    await db
      .prepare(
        `UPDATE collections
        SET name=?, description=?, image=?
        WHERE id=?`
      )
      .bind(...Object.values(collection), result.output.id)
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
    const result = safeParse(pick(CollectionSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const imageKey = await db
      .prepare(`SELECT image FROM collections WHERE id=?`)
      .bind(result.output.id)
      .first<string>('image')

    if (imageKey) bucket.delete(imageKey)

    await db
      .prepare(`DELETE FROM collections WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
