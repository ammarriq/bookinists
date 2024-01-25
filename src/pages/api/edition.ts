import type { Author } from './author'
import type { Tag } from './tag'
import type { Publisher } from './publisher'

import {
  binding,
  protection,
  status,
  signature_type,
  condition,
  lend_status,
} from '@/lib/constants'
import { createActions } from '@/lib/utils'
import { decode } from 'decode-formdata'
import { generateId } from 'lucia'
import {
  flatten,
  minLength,
  nullable,
  number,
  object,
  omit,
  optional,
  picklist,
  safeParse,
  string,
  type Output,
  pick,
  merge,
  array,
  boolean,
} from 'valibot'

const EditionSchema = object({
  id: string([minLength(15, 'ID is required')]),
  date: optional(number()),
  book_id: nullable(string()),
  publisher_id: nullable(string()),
  country_id: nullable(string()),
  isbn: string([minLength(1, 'ISBN is required')]),
  isbn13: string([minLength(1, 'ISBN is required')]),
  status: picklist(status, 'Invalid status selected'),
  protection: picklist(protection, 'Invalid value selected'),
  pages: number(),
  msrp: number(),
  language_iso: string(),
  binding: picklist(binding, 'Invalid value selected'),
  total_printed: number(),
  printing: number(),
  edition: number(),
  is_limited: boolean(),
  limited_num: number(),
  limited_total: number(),
  is_signed: boolean(),
  signature_type: picklist(signature_type, 'Invalid value selected'),
  signature_page: number(),
  need_repair: boolean(),
  description: number(),
  book_condition: picklist(condition, 'Invalid value selected'),
  book_condition_notes: string(),
  jacket_condition: picklist(condition, 'Invalid value selected'),
  jacket_condition_notes: string(),
  width: number(),
  height: number(),
  depth: number(),
  purchase_price: number(),
  purchase_date: number(),
  purchase_invoice: string(),
  seller_id: nullable(string()),
  sell_price: number(),
  sell_date: number(),
  buyer_id: nullable(string()),
  lend_status: picklist(lend_status, 'Invalid value selected'),
  lender_id: nullable(string()),
  lending_time: number(),
  created_on: optional(number()),
})

const IsbnSchema = merge([
  EditionSchema,
  object({
    tags: array(string()),
    authors: array(string()),
    publisher: string(),
  }),
])

const decoder = {
  numbers: [
    'pages',
    'msrp',
    'total_printed',
    'printing',
    'edition',
    'limited_num',
    'limited_total',
    'signature_page',
    'description',
    'width',
    'height',
    'depth',
    'purchase_price',
    'purchase_date',
    'sell_price',
    'sell_date',
    'lending_time',
  ],
  booleans: ['is_limited', 'is_signed', 'need_repair'],
}

export type Edition = ToType<
  Required<Output<typeof EditionSchema>>,
  boolean,
  number
>

export const POST = createActions({
  add: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData, decoder)
    const result = safeParse(omit(EditionSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const edition: Edition = {
      id: generateId(15),
      date: Date.now(),
      book_id: result.output.book_id || null,
      publisher_id: result.output.publisher_id || null,
      country_id: result.output.country_id || null,
      isbn: result.output.isbn,
      isbn13: result.output.isbn13,
      status: result.output.status,
      protection: result.output.protection,
      pages: result.output.pages,
      msrp: result.output.msrp,
      language_iso: result.output.language_iso,
      binding: result.output.binding,
      total_printed: result.output.total_printed,
      printing: result.output.printing,
      edition: result.output.edition,
      is_limited: result.output.is_limited ? 1 : 0,
      limited_num: result.output.limited_num,
      limited_total: result.output.limited_total,
      is_signed: result.output.is_signed ? 1 : 0,
      signature_type: result.output.signature_type,
      signature_page: result.output.signature_page,
      need_repair: result.output.need_repair ? 1 : 0,
      description: result.output.description,
      book_condition: result.output.book_condition,
      book_condition_notes: result.output.book_condition_notes,
      jacket_condition: result.output.jacket_condition,
      jacket_condition_notes: result.output.jacket_condition_notes,
      width: result.output.width,
      height: result.output.height,
      depth: result.output.depth,
      purchase_price: result.output.purchase_price,
      purchase_date: result.output.purchase_date,
      purchase_invoice: result.output.purchase_invoice,
      seller_id: result.output.seller_id || null,
      sell_price: result.output.sell_price,
      sell_date: result.output.sell_date,
      buyer_id: result.output.buyer_id || null,
      lend_status: result.output.lend_status,
      lender_id: result.output.lender_id || null,
      lending_time: result.output.lending_time,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO editions
        (id, date, book_id, publisher_id, country_id, isbn, isbn13, status, protection, pages, msrp,
          language_iso, binding, total_printed, printing, edition, is_limited, limited_num, limited_total,
          is_signed, signature_type, signature_page, need_repair, description, book_condition,
          book_condition_notes, jacket_condition, jacket_condition_notes, width, height, depth,
          purchase_price, purchase_date, purchase_invoice, seller_id, sell_price, sell_date, buyer_id,
          lend_status, lender_id, lending_time, created_on,) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,)`
      )
      .bind(...Object.values(edition))
      .run()

    return Response.json(
      { data: edition, success: true, errors: null },
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

    const edition: Edition = {
      id: generateId(15),
      date: Date.now(),
      book_id: result.output.book_id || null,
      publisher_id: result.output.publisher_id || null,
      country_id: result.output.country_id || null,
      isbn: result.output.isbn,
      isbn13: result.output.isbn13,
      status: result.output.status,
      protection: result.output.protection,
      pages: result.output.pages,
      msrp: result.output.msrp,
      language_iso: result.output.language_iso,
      binding: result.output.binding,
      total_printed: result.output.total_printed,
      printing: result.output.printing,
      edition: result.output.edition,
      is_limited: result.output.is_limited ? 1 : 0,
      limited_num: result.output.limited_num,
      limited_total: result.output.limited_total,
      is_signed: result.output.is_signed ? 1 : 0,
      signature_type: result.output.signature_type,
      signature_page: result.output.signature_page,
      need_repair: result.output.need_repair ? 1 : 0,
      description: result.output.description,
      book_condition: result.output.book_condition,
      book_condition_notes: result.output.book_condition_notes,
      jacket_condition: result.output.jacket_condition,
      jacket_condition_notes: result.output.jacket_condition_notes,
      width: result.output.width,
      height: result.output.height,
      depth: result.output.depth,
      purchase_price: result.output.purchase_price,
      purchase_date: result.output.purchase_date,
      purchase_invoice: result.output.purchase_invoice,
      seller_id: result.output.seller_id || null,
      sell_price: result.output.sell_price,
      sell_date: result.output.sell_date,
      buyer_id: result.output.buyer_id || null,
      lend_status: result.output.lend_status,
      lender_id: result.output.lender_id || null,
      lending_time: result.output.lending_time,
      created_on: Date.now(),
    }

    const authors: Author[] = result.output.authors.map((a) => ({
      id: generateId(15),
      name: a,
      avatar: '',
      info: '',
      country_id: null,
      created_on: Date.now(),
    }))

    const tags: Tag[] = result.output.tags.map((a) => ({
      id: generateId(15),
      name: a,
      icon: '',
      description: '',
      text_color: '',
      bg_color: '',
      created_on: Date.now(),
    }))

    const publisher: Publisher = {
      id: generateId(15),
      name: result.output.publisher,
      logo: '',
      info: '',
      country_id: null,
      created_on: Date.now(),
    }

    const book_stmt = db.prepare(
      `INSERT INTO books
      (id, date, book_id, publisher_id, country_id, isbn, isbn13, status, protection, pages, msrp,
        language_iso, binding, total_printed, printing, edition, is_limited, limited_num, limited_total,
        is_signed, signature_type, signature_page, need_repair, description, book_condition,
        book_condition_notes, jacket_condition, jacket_condition_notes, width, height, depth,
        purchase_price, purchase_date, purchase_invoice, seller_id, sell_price, sell_date, buyer_id,
        lend_status, lender_id, lending_time, created_on,) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,)`
    )

    const author_stmt = db.prepare(
      `INSERT INTO authors
      (id, name, avatar, info, country_id, created_on) 
      VALUES (?, ?, ?, ?, ?, ?)`
    )

    const tag_stmt = db.prepare(
      `INSERT INTO tags
      (id, name, icon, description, text_color, bg_color, created_on) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`
    )

    const publisher_stmt = db.prepare(
      `INSERT INTO publishers
      (id, name, logo, info, country_id, created_on) 
      VALUES (?, ?, ?, ?, ?, ?)`
    )

    await db.batch([
      book_stmt.bind(...Object.values(edition)),
      ...authors.map((a) => author_stmt.bind(...Object.values(a))),
      ...tags.map((a) => tag_stmt.bind(...Object.values(a))),
      publisher_stmt.bind(...Object.values(publisher)),
    ])

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
      ...authors.map((a) => books_authors_stmt.bind(edition.id, a.id)),
      ...tags.map((a) => books_tags_stmt.bind(edition.id, a.id)),
    ])

    return Response.json(
      { data: edition, success: true, errors: null },
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
    const result = safeParse(EditionSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const edition: Omit<Edition, 'id' | 'created_on'> = {
      date: Date.now(),
      book_id: result.output.book_id || null,
      publisher_id: result.output.publisher_id || null,
      country_id: result.output.country_id || null,
      isbn: result.output.isbn,
      isbn13: result.output.isbn13,
      status: result.output.status,
      protection: result.output.protection,
      pages: result.output.pages,
      msrp: result.output.msrp,
      language_iso: result.output.language_iso,
      binding: result.output.binding,
      total_printed: result.output.total_printed,
      printing: result.output.printing,
      edition: result.output.edition,
      is_limited: result.output.is_limited ? 1 : 0,
      limited_num: result.output.limited_num,
      limited_total: result.output.limited_total,
      is_signed: result.output.is_signed ? 1 : 0,
      signature_type: result.output.signature_type,
      signature_page: result.output.signature_page,
      need_repair: result.output.need_repair ? 1 : 0,
      description: result.output.description,
      book_condition: result.output.book_condition,
      book_condition_notes: result.output.book_condition_notes,
      jacket_condition: result.output.jacket_condition,
      jacket_condition_notes: result.output.jacket_condition_notes,
      width: result.output.width,
      height: result.output.height,
      depth: result.output.depth,
      purchase_price: result.output.purchase_price,
      purchase_date: result.output.purchase_date,
      purchase_invoice: result.output.purchase_invoice,
      seller_id: result.output.seller_id || null,
      sell_price: result.output.sell_price,
      sell_date: result.output.sell_date,
      buyer_id: result.output.buyer_id || null,
      lend_status: result.output.lend_status,
      lender_id: result.output.lender_id || null,
      lending_time: result.output.lending_time,
    }

    await db
      .prepare(
        `UPDATE editions
        SET id=?, date=?, book_id=?, publisher_id=?, country_id=?, isbn=?, isbn13=?, status=?, protection=?,
        pages=?, msrp=?, language_iso=?, binding=?, total_printed=?, printing=?, edition=?, is_limited=?,
        limited_num=?, limited_total=?, is_signed=?, signature_type=?, signature_page=?, need_repair=?,
        description=?, book_condition=?, book_condition_notes=?, jacket_condition=?, jacket_condition_notes=?,
        width=?, height=?, depth=?, purchase_price=?, purchase_date=?, purchase_invoice=?, seller_id=?,
        sell_price=?, sell_date=?, buyer_id=?, lend_status=?, lender_id=?, lending_time=?, created_on=?
        WHERE id=?`
      )
      .bind(...Object.values(edition), result.output.id)
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
    const result = safeParse(pick(EditionSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare(`DELETE FROM editions WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
