import type { APIRoute } from 'astro'

import { createActions, values } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { array, minLength, object, string, safeParse, flatten } from 'valibot'
import { generateId } from 'lucia'

export type RoomStorage = {
  id: string
  room_id: string
  storage_id: string
}

export const GET = (async ({ url, locals }) => {
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const room_id = url.searchParams.get('room_id')
  if (!room_id) {
    return Response.json(
      { data: null, success: false, error: null },
      { status: 404 }
    )
  }

  const res = await db
    .prepare(
      `SELECT storages.id AS value, storages.name AS label, rooms_storages.id AS room_storage
      FROM rooms_storages
      LEFT JOIN storages ON storages.id=rooms_storages.storage_id
      WHERE rooms_storages.room_id=?`
    )
    .bind(room_id)
    .all<RoomStorage>()

  return Response.json({ data: res.results }, { status: 200 })
}) satisfies APIRoute

export const POST = createActions({
  update: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const schema = object({
      room_id: string([minLength(15, 'ID is required.')]),
      add_storages: array(string()),
      remove_storages: array(string()),
    })

    const formData = await request.formData()
    const data = decode(formData, {
      arrays: ['add_storages', 'remove_storages'],
    })
    const result = safeParse(schema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const { add_storages, remove_storages, room_id } = result.output

    const book_authors = add_storages.map((o) => ({
      id: generateId(15),
      room_id,
      storage_id: o,
      created_on: Date.now(),
    }))

    const insert_stmt = db.prepare(`INSERT INTO rooms_storages
    (id, room_id, storage_id, created_on)
    VALUES(? ,?, ?, ?)`)

    const delete_stmt = db.prepare(`DELETE FROM rooms_storages WHERE id=?`)

    try {
      await db.batch([
        ...book_authors.map((o) => insert_stmt.bind(...values(o))),
        ...remove_storages.map((o) => delete_stmt.bind(o)),
      ])
    } catch (error) {
      console.log(error)
    }

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 201 }
    )
  },
})
