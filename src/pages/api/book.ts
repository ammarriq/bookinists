import { read_status } from '@/lib/constants'
import { createActions } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { generateId } from 'lucia'
import {
  flatten,
  maxValue,
  minLength,
  minValue,
  nullable,
  number,
  object,
  omit,
  optional,
  picklist,
  safeParse,
  string,
  url,
  type Output,
  pick,
  merge,
  array,
  length,
} from 'valibot'

const BookSchema = object({
  id: string([minLength(15, 'ID is required')]),
  title: string([minLength(1, 'Title is required')]),
  url: string('URL is required', [url('Please provide valid url')]),
  excerpt: string('Excerpt is required'),
  read_status: picklist(read_status, 'Invalid status selected'),
  rating: number([
    minValue(0, 'Must be 0 or greater'),
    maxValue(5, 'Must be less than 5'),
  ]),
  review: string('Review is required'),
  genre_id: nullable(string()),
  created_on: optional(number()),
})

const IsbnSchema = merge([
  BookSchema,
  object({
    tags: array(string()),
    authors: array(string()),
    publisher: string(),
    isbn10: optional(string()),
    isbn13: optional(string()),
    pages: number(),
    thumbnail: string([url()]),
    language_iso: string(),
  }),
])

const decoder = {
  numbers: ['rating', 'pages'],
  arrays: ['tags', 'authors'], // isbn decoder
}

export type Book = Required<Output<typeof BookSchema>>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData, decoder)
    const result = safeParse(omit(BookSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const book: Book = {
      id: generateId(15),
      title: result.output.title,
      url: result.output.url,
      excerpt: result.output.excerpt,
      read_status: result.output.read_status,
      rating: result.output.rating,
      review: result.output.review,
      genre_id: result.output.genre_id || null,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO books
        (id, title, url, excerpt, read_status, rating, review, genre_id, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(book))
      .run()

    return Response.json(
      { data: book, success: true, errors: null },
      { status: 201 }
    )
  },
  add_by_isbn: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData, decoder)
    const result = safeParse(omit(IsbnSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const book: Book = {
      id: generateId(15),
      title: result.output.title,
      url: result.output.url,
      excerpt: result.output.excerpt,
      read_status: result.output.read_status,
      rating: result.output.rating,
      review: result.output.review,
      genre_id: result.output.genre_id || null,
      created_on: Date.now(),
    }

    const authors = result.output.authors.map((a) => ({
      id: generateId(15),
      name: a,
      created_on: Date.now(),
    }))

    const tags = result.output.tags.map((a) => ({
      id: generateId(15),
      name: a,
      created_on: Date.now(),
    }))

    const publisher = {
      id: generateId(15),
      name: result.output.publisher,
      created_on: Date.now(),
    }

    const book_stmt = db.prepare(
      `INSERT INTO books
      (id, title, url, excerpt, read_status, rating, review, genre_id, created_on) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )

    const author_stmt = db.prepare(
      `INSERT INTO authors
      (id, name, created_on) 
      VALUES (?, ?, ?)`
    )

    const tag_stmt = db.prepare(
      `INSERT INTO tags
      (id, name, created_on) 
      VALUES (?, ?, ?)`
    )

    const publisher_stmt = db.prepare(
      `INSERT INTO publishers
      (id, name, created_on) 
      VALUES (?, ?, ?)`
    )

    await db.batch([
      book_stmt.bind(...Object.values(book)),
      ...authors.map((a) => author_stmt.bind(...Object.values(a))),
      ...tags.map((a) => tag_stmt.bind(...Object.values(a))),
      publisher_stmt.bind(...Object.values(publisher)),
    ])

    const edition = {
      id: generateId(15),
      date: Date.now(),
      book_id: book.id,
      publisher_id: publisher.id,
      isbn: result.output.isbn10 ?? '',
      isbn13: result.output.isbn13 ?? '',
      pages: result.output.pages,
      language_iso: result.output.language_iso,
      created_on: Date.now(),
    }

    const edition_stmt = db.prepare(
      `INSERT INTO editions
      (id, date, book_id, publisher_id, isbn, isbn13, pages, language_iso, created_on) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )

    const books_tags_stmt = db.prepare(
      `INSERT INTO books_tags
      (book_id, tag_id)
      VALUES (?, ?)`
    )

    const books_authors_stmt = db.prepare(
      `INSERT INTO books_authors
      (book_id, author_id)
      VALUES (?, ?)`
    )

    await db.batch([
      edition_stmt.bind(...Object.values(edition)),
      ...authors.map((a) => books_authors_stmt.bind(book.id, a.id)),
      ...tags.map((a) => books_tags_stmt.bind(book.id, a.id)),
    ])

    const edition_image = {
      id: generateId(15),
      edition_id: edition.id,
      image: result.output.thumbnail,
      type: 'cover',
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO editions_images
        (id, edition_id, image, type, created_on) 
        VALUES (?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(edition_image))
      .run()

    return Response.json(
      { data: book, success: true, errors: null },
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
    const result = safeParse(BookSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const book: Omit<Book, 'id' | 'created_on'> = {
      title: result.output.title,
      url: result.output.url,
      excerpt: result.output.excerpt,
      read_status: result.output.read_status,
      rating: result.output.rating,
      review: result.output.review,
      genre_id: result.output.genre_id || null,
    }

    await db
      .prepare(
        `UPDATE books
        SET title=?, url=?, excerpt=?, read_status=?, rating=?, review=?, genre_id=?
        WHERE id=?`
      )
      .bind(...Object.values(book), result.output.id)
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
    const result = safeParse(pick(BookSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare(`DELETE FROM books WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
  move_to_list: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const schema = object({
      list_id: string([length(15)]),
      book_ids: array(string([length(15)])),
    })

    const formData = await request.formData()
    const data = decode(formData, { arrays: ['book_ids'] })
    const result = safeParse(schema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const { book_ids, list_id } = result.output
    const stmt = book_ids.map((id) =>
      db //
        .prepare(
          `INSERT INTO books_lists
          (id, book_id, list_id, created_on)
          VALUES(?, ?, ?, ?)`
        )
        .bind(generateId(15), id, list_id, Date.now())
    )

    try {
      await db.batch(stmt)
    } catch (err) {
      console.error(err)
    }

    return Response.json(
      { data: null, success: true, errors: null },
      { status: 202 }
    )
  },
  move_to_tag: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const schema = object({
      tag_id: string([length(15)]),
      book_ids: array(string([length(15)])),
    })

    const formData = await request.formData()
    const data = decode(formData, { arrays: ['book_ids'] })
    const result = safeParse(schema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const { book_ids, tag_id } = result.output
    const stmt = book_ids.map((id) =>
      db //
        .prepare(
          `INSERT INTO books_tags
          (id, book_id, tag_id, created_on)
          VALUES(?, ?, ?, ?)`
        )
        .bind(generateId(15), id, tag_id, Date.now())
    )

    try {
      await db.batch(stmt)
    } catch (err) {
      console.error(err)
    }

    return Response.json(
      { data: null, success: true, errors: null },
      { status: 202 }
    )
  },
})
