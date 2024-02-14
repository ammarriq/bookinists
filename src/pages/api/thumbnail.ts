import { thumbnail_type } from '@/lib/constants'
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
  picklist,
} from 'valibot'

const ThumbnailSchema = object({
  id: string([minLength(15, 'ID is required')]),
  image: string('Image is required', [minLength(15, 'Image is required')]),
  type: picklist(thumbnail_type, 'Invalid value selected'),
  order: optional(number()),
  edition_id: string([minLength(15, 'Edition is missing')]),
  created_on: optional(number()),
})

export type Thumbnail = ToKeyType<
  Required<Output<typeof ThumbnailSchema>>,
  'order' | 'edition_id',
  null
>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(omit(ThumbnailSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const thumbnail: Thumbnail = {
      id: generateId(15),
      image: result.output.image,
      type: result.output.type,
      edition_id: result.output.edition_id,
      order: result.output.order ?? null,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO editions_images
        (id, image, type, edition_id, "order", created_on) 
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(thumbnail))
      .run()

    return Response.json(
      { data: thumbnail, success: true, errors: null },
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
    const result = safeParse(pick(ThumbnailSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const imageKey = await db
      .prepare(`SELECT image FROM editions_images WHERE id=?`)
      .bind(result.output.id)
      .first<string>('image')

    if (imageKey) bucket.delete(imageKey)

    await db
      .prepare(`DELETE FROM editions_images WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
