import { createActions } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { generateId } from 'lucia'
import {
  flatten,
  object,
  optional,
  pick,
  required,
  safeParse,
  string,
  type Output,
  minLength,
  merge,
  omit,
} from 'valibot'

const TagSchema = object({
  id: string([minLength(15, '')]),
  name: string([minLength(4, 'Name is required')]),
  description: string([minLength(20, 'Description is required')]),
  icon: string('Icon is required'),
  text_color: string('Text color is required'),
  bg_color: string('Background color is required'),
})

export type Tag = Required<Output<typeof TagSchema>>

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

    const tag = {
      id: generateId(15),
      name: result.output.name,
      description: result.output.description,
      icon: result.output.icon,
      text_color: result.output.text_color,
      bg_color: result.output.bg_color,
    }

    await db
      .prepare(
        `INSERT INTO tags
        (id, name, description, icon, text_color, bg_color) 
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(tag))
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
      console.log(data.icon)
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const tag = {
      name: result.output.name,
      description: result.output.description,
      icon: result.output.icon,
      text_color: result.output.text_color,
      bg_color: result.output.bg_color,
      id: result.output.id,
    }

    await db
      .prepare(
        `UPDATE tags
        SET name=?, description=?, icon=?, text_color=?, bg_color=?
        WHERE id=?`
      )
      .bind(...Object.keys(tag))
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
    const result = safeParse(pick(TagSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

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
