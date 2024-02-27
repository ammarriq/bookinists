import type { Publisher } from './publisher'

import {
  binding,
  protection,
  status,
  signature_type,
  condition,
  lend_status,
  thumbnail_type,
} from '@/lib/constants'
import { createActions, values } from '@/lib/utils'
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
  boolean,
  url,
  array,
} from 'valibot'

const EditionSchema = object({
  id: string([minLength(15, 'ID is required')]),
  date: optional(number()),
  book_id: nullable(string()),
  publisher_id: nullable(string()),
  country_id: nullable(string()),
  isbn: string([minLength(10, 'Must have 10 digits')]),
  isbn13: string([minLength(10, 'Must have 13 digits')]),
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
  description: string(),
  book_condition: picklist(
    condition.map((o) => o.value),
    'Invalid value selected'
  ),
  book_condition_notes: string(),
  jacket_condition: picklist(
    condition.map((o) => o.value),
    'Invalid value selected'
  ),
  jacket_condition_notes: string(),
  width: number(),
  height: number(),
  depth: number(),
  purchase_price: number(),
  purchase_date: number(),
  purchase_invoice: string('Invoice is required'),
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
  pick(EditionSchema, ['date', 'book_id', 'language_iso', 'pages']),
  object({
    isbn10: string(),
    isbn13: string(),
    publisher: string(),
    thumbnail: string([url()]),
  }),
])

const ThumbnailSchema = object({
  id: optional(string()),
  image: string('Image is required', [minLength(15, 'Image is required')]),
  type: picklist(thumbnail_type, 'Invalid value selected'),
  is_new: boolean(),
  order: optional(number()),
  edition_id: optional(string()),
  created_on: optional(number()),
})

const decoder = {
  numbers: [
    'date',
    'pages',
    'msrp',
    'total_printed',
    'printing',
    'edition',
    'limited_num',
    'limited_total',
    'signature_page',
    'width',
    'height',
    'depth',
    'purchase_price',
    'purchase_date',
    'sell_price',
    'sell_date',
    'lending_time',
    'thumbnails.$.order',
  ],
  booleans: ['is_limited', 'is_signed', 'need_repair', 'thumbnails.$.is_new'],
}

export type Edition = SwapType<
  Require<Output<typeof EditionSchema>, 'created_on'>,
  boolean,
  number
>

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

    const Schema = merge([
      omit(EditionSchema, ['id']),
      object({ thumbnails: array(omit(ThumbnailSchema, ['id'])) }),
    ])

    const formData = await request.formData()
    const data = decode(formData, decoder)
    const result = safeParse(Schema, data)

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
      isbn: result.output.isbn ?? '',
      isbn13: result.output.isbn13 ?? '',
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
          lend_status, lender_id, lending_time, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(edition))
      .run()

    const thumbnails: Omit<Thumbnail, 'is_new'>[] =
      result.output.thumbnails.map((o) => ({
        id: generateId(15),
        image: o.image,
        type: o.type,
        edition_id: edition.id,
        order: o.order ?? null,
        created_on: Date.now(),
      }))

    const stmt = `INSERT INTO editions_images
      (id, image, type, edition_id, "order", created_on)
      VALUES(?, ?, ?, ?, ?, ?)`

    await db.batch([
      ...thumbnails.map((o) => db.prepare(stmt).bind(...values(o))),
    ])

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
    const result = safeParse(IsbnSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const publisher: Publisher = {
      id: generateId(15),
      name: result.output.publisher,
      logo: '',
      info: '',
      country_id: null,
      created_on: Date.now(),
    }

    const edition = {
      id: generateId(15),
      date: Date.now(),
      book_id: result.output.book_id || null,
      publisher_id: publisher.id,
      isbn: result.output.isbn10 ?? '',
      isbn13: result.output.isbn13 ?? '',
      pages: result.output.pages,
      language_iso: result.output.language_iso,
      created_on: Date.now(),
    }

    const edition_image = {
      id: generateId(15),
      edition_id: edition.id,
      image: result.output.thumbnail,
      type: 'cover',
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO publishers
        (id, name, logo, info, country_id, created_on) 
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(publisher))
      .run()

    await db
      .prepare(
        `INSERT INTO editions
        (id, date, book_id, publisher_id, isbn, isbn13, pages, language_iso, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...values(edition))
      .run()

    await db
      .prepare(
        `INSERT INTO editions_images
        (id, edition_id, image, type, created_on) 
        VALUES (?, ?, ?, ?, ?)`
      )
      .bind(...values(edition_image))
      .run()

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

    const Schema = merge([
      EditionSchema,
      object({ thumbnails: array(ThumbnailSchema) }),
    ])

    const formData = await request.formData()
    const data = decode(formData, decoder)
    const result = safeParse(Schema, data)

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
      isbn: result.output.isbn ?? '',
      isbn13: result.output.isbn13 ?? '',
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
        SET date=?, book_id=?, publisher_id=?, country_id=?, isbn=?, isbn13=?, status=?, protection=?,
        pages=?, msrp=?, language_iso=?, binding=?, total_printed=?, printing=?, edition=?, is_limited=?,
        limited_num=?, limited_total=?, is_signed=?, signature_type=?, signature_page=?, need_repair=?,
        description=?, book_condition=?, book_condition_notes=?, jacket_condition=?, jacket_condition_notes=?,
        width=?, height=?, depth=?, purchase_price=?, purchase_date=?, purchase_invoice=?, seller_id=?,
        sell_price=?, sell_date=?, buyer_id=?, lend_status=?, lender_id=?, lending_time=?
        WHERE id=?`
      )
      .bind(...values(edition), result.output.id)
      .run()

    const thumbnails: Partial<Thumbnail>[] = result.output.thumbnails.map(
      (o) => ({
        id: o.is_new ? generateId(15) : o.id,
        image: o.image,
        type: o.type,
        edition_id: result.output.id,
        is_new: o.is_new,
        order: o.order ?? null,
        created_on: Date.now(),
      })
    )

    const insert_stmt = `INSERT INTO editions_images
      (id, image, type, edition_id, "order", created_on)
      VALUES(?, ?, ?, ?, ?, ?)`

    const update_stmt = `UPDATE editions_images
      SET image=?, type=?, edition_id=?, "order"=?
      WHERE id = ?`

    if (thumbnails.length) {
      await db.batch([
        ...thumbnails.map((o) => {
          const { id, is_new, created_on, ...thumbnail } = o

          if (o.is_new) {
            return db
              .prepare(insert_stmt)
              .bind(id, ...values(thumbnail), created_on)
          }

          return db.prepare(update_stmt).bind(...values(thumbnail), id)
        }),
      ])
    }

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 201 }
    )
  },
  delete_thumbnail: async ({ locals, request }) => {
    const db = locals.runtime.env.SITE_DB
    const bucket = locals.runtime.env.SITE_BUCKET

    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData)
    const result = safeParse(pick(ThumbnailSchema, ['id', 'image']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    await db
      .prepare(`DELETE FROM editions_images WHERE id=?`)
      .bind(result.output.id) //
      .run()
    await bucket.delete(result.output.image)

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
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
