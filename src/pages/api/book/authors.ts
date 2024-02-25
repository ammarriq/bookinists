import type { APIRoute } from 'astro'

import { createActions } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { array, minLength, object, string, safeParse, flatten } from 'valibot'
import { generateId } from 'lucia'

export type BookAuthor = {
  id: string
  book_id: string
  author_id: string
  order: number
  created_on: number
}

export const GET = (async ({ url, locals }) => {
  const db = locals.runtime.env.SITE_DB

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const book_id = url.searchParams.get('book_id')
  if (!book_id) {
    return Response.json(
      { data: null, success: false, error: null },
      { status: 404 }
    )
  }

  const res = await db
    .prepare(
      `SELECT authors.id AS value, authors.name AS label, books_authors.id AS book_author
      FROM books_authors
      LEFT JOIN authors ON authors.id=books_authors.author_id
      WHERE books_authors.book_id=?`
    )
    .bind(book_id)
    .all<BookAuthor>()

  return Response.json({ data: res.results }, { status: 200 })
}) satisfies APIRoute

export const POST = createActions({
  update: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const schema = object({
      book_id: string([minLength(15, 'ID is required.')]),
      add_authors: array(string()),
      remove_authors: array(string()),
    })

    const formData = await request.formData()
    const data = decode(formData, { arrays: ['add_authors', 'remove_authors'] })
    const result = safeParse(schema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const { add_authors, remove_authors, book_id } = result.output

    const book_authors = add_authors.map((o) => ({
      id: generateId(15),
      book_id,
      author_id: o,
      created_on: Date.now(),
    }))

    const insert_stmt = db.prepare(`INSERT INTO books_authors
    (id, book_id, author_id, created_on)
    VALUES(? ,?, ?, ?)`)

    const delete_stmt = db.prepare(`DELETE FROM books_authors WHERE id=?`)

    try {
      await db.batch([
        ...book_authors.map((o) => insert_stmt.bind(...Object.values(o))),
        ...remove_authors.map((o) => delete_stmt.bind(o)),
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
