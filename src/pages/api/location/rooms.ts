import type { APIRoute } from 'astro'

import { createActions, values } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { array, minLength, object, string, safeParse, flatten } from 'valibot'
import { generateId } from 'lucia'

export const GET = (async ({ url, locals }) => {
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const location_id = url.searchParams.get('location_id')
  if (!location_id) {
    return Response.json(
      { data: null, success: false, error: null },
      { status: 404 }
    )
  }

  const res = await db
    .prepare(
      `SELECT rooms.id AS value, rooms.name AS label, locations_rooms.id AS location_room
      FROM locations_rooms
      LEFT JOIN rooms ON rooms.id=locations_rooms.room_id
      WHERE locations_rooms.location_id=?`
    )
    .bind(location_id)
    .all()

  return Response.json({ data: res.results }, { status: 200 })
}) satisfies APIRoute

export const POST = createActions({
  update: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const schema = object({
      location_id: string([minLength(15, 'ID is required.')]),
      add_rooms: array(string()),
      remove_rooms: array(string()),
    })

    const formData = await request.formData()
    const data = decode(formData, {
      arrays: ['add_rooms', 'remove_rooms'],
    })
    const result = safeParse(schema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const { add_rooms, remove_rooms, location_id } = result.output

    const location_rooms = add_rooms.map((o) => ({
      id: generateId(15),
      location_id,
      room_id: o,
      created_on: Date.now(),
    }))

    const insert_stmt = db.prepare(`INSERT INTO locations_rooms
    (id, location_id, room_id, created_on)
    VALUES(? ,?, ?, ?)`)

    const delete_stmt = db.prepare(`DELETE FROM locations_rooms WHERE id=?`)

    try {
      await db.batch([
        ...location_rooms.map((o) => insert_stmt.bind(...values(o))),
        ...remove_rooms.map((o) => delete_stmt.bind(o)),
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
