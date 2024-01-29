import { createActions } from '@/lib/utils'
import { storage_type } from '@/lib/constants'
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
  picklist,
} from 'valibot'

const StorageSchema = object({
  id: string([minLength(15, 'ID is required')]),
  name: string([minLength(4, 'Name is required')]),
  image: string('Image is required', [minLength(15, 'Image is required')]),
  storage_type: picklist(storage_type, 'Invalid storage type selected.'),
  color: string('Color is required', [minLength(6, 'Color is required')]),
  width: number('Width is required'),
  height: number('Height is required'),
  depth: number('Depth is required'),
  notes: string([minLength(1, 'Notes is required')]),
  created_on: optional(number()),
})

const decoder = { numbers: ['width', 'height', 'depth'] }

export type Storage = Required<Output<typeof StorageSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData, decoder)
    const result = safeParse(omit(StorageSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const storage: Storage = {
      id: generateId(15),
      image: result.output.image,
      name: result.output.name,
      storage_type: result.output.storage_type,
      color: result.output.color,
      width: result.output.width,
      height: result.output.height,
      depth: result.output.depth,
      notes: result.output.notes,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO storages
        (id, image, name, storage_type, color, width, height, depth, notes, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(storage))
      .run()

    return Response.json(
      { data: storage, success: true, errors: null },
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
    const result = safeParse(StorageSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const storage: Omit<Storage, 'id' | 'created_on'> = {
      image: result.output.image,
      name: result.output.name,
      storage_type: result.output.storage_type,
      color: result.output.color,
      width: result.output.width,
      height: result.output.height,
      depth: result.output.depth,
      notes: result.output.notes,
    }

    await db
      .prepare(
        `UPDATE storages
        SET image=?, name=?, storage_type=?, color=?, width=?, height=?, depth=?, notes=?
        WHERE id=?`
      )
      .bind(...Object.values(storage), result.output.id)
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
    const result = safeParse(pick(StorageSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const imageKey = await db
      .prepare(`SELECT image FROM storages WHERE id=?`)
      .bind(result.output.id)
      .first<string>('image')

    if (imageKey) bucket.delete(imageKey)

    await db
      .prepare(`DELETE FROM storages WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
