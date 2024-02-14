import { createActions } from '@/lib/utils'
import { favorite_contact } from '@/lib/constants'
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
  url,
  picklist,
  email,
  boolean,
  nullable,
} from 'valibot'

const ContactSchema = object({
  id: string([minLength(15, 'ID is required')]),
  name: string([minLength(4, 'Name is required')]),
  avatar: string('Image is required', [minLength(15, 'Image is required')]),
  currency: string([minLength(1, 'Currency is required')]),
  paypal_email: string([email('Paypal email is required')]),
  email: string([email('Email is required')]),
  phone: string([minLength(1, 'Phone is required')]),
  bank_info: string([minLength(1, 'Bank info is required')]),
  favorite_contact: picklist(favorite_contact, 'Invalid contact selected'),
  url: string('URL is required', [url('Please provide valid url')]),
  use_whatsapp: boolean('Whatsapp is required'),
  use_signal: boolean('Signal is required'),
  is_professional: boolean('Professional is required'),
  rating: number('Rating is required'),
  note: nullable(string()),
  country_id: nullable(string()),
  created_on: optional(number()),
})

const decoder = {
  numbers: ['rating'],
  booleans: ['use_whatsapp', 'use_signal', 'is_professional'],
}

export type Contact = SwapType<
  Required<Output<typeof ContactSchema>>,
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
    const result = safeParse(omit(ContactSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const contact: Contact = {
      id: generateId(15),
      avatar: result.output.avatar,
      name: result.output.name,
      currency: result.output.currency,
      paypal_email: result.output.paypal_email,
      email: result.output.email,
      phone: result.output.phone,
      bank_info: result.output.bank_info,
      favorite_contact: result.output.favorite_contact,
      url: result.output.url,
      use_whatsapp: result.output.use_whatsapp ? 1 : 0,
      use_signal: result.output.use_signal ? 1 : 0,
      is_professional: result.output.is_professional ? 1 : 0,
      rating: result.output.rating,
      note: result.output.note || null,
      country_id: result.output.country_id || null,
      created_on: Date.now(),
    }

    await db
      .prepare(
        `INSERT INTO contacts
        (id, avatar, name, currency, paypal_email, email, phone, bank_info, favorite_contact,
          url, use_whatsapp, use_signal, is_professional, rating, note, country_id, created_on) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(...Object.values(contact))
      .run()

    return Response.json(
      { data: contact, success: true, errors: null },
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
    const result = safeParse(ContactSchema, data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const contact: Omit<Contact, 'id' | 'created_on'> = {
      avatar: result.output.avatar,
      name: result.output.name,
      currency: result.output.currency,
      paypal_email: result.output.paypal_email,
      email: result.output.email,
      phone: result.output.phone,
      bank_info: result.output.bank_info,
      favorite_contact: result.output.favorite_contact,
      url: result.output.url,
      use_whatsapp: result.output.use_whatsapp ? 1 : 0,
      use_signal: result.output.use_signal ? 1 : 0,
      is_professional: result.output.is_professional ? 1 : 0,
      rating: result.output.rating,
      note: result.output.note || null,
      country_id: result.output.country_id || null,
    }

    await db
      .prepare(
        `UPDATE contacts
        SET avatar=?, name=?, currency=?, paypal_email=?, email=?, phone=?, bank_info=?, favorite_contact=?,
        url=?, use_whatsapp=?, use_signal=?, is_professional=?, rating=?, note=?, country_id=?
        WHERE id=?`
      )
      .bind(...Object.values(contact), result.output.id)
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
    const result = safeParse(pick(ContactSchema, ['id']), data)

    if (!result.success) {
      const errors = flatten(result.issues).nested
      return Response.json(
        { data: null, success: false, errors },
        { status: 400 }
      )
    }

    const avatarKey = await db
      .prepare(`SELECT avatar FROM contacts WHERE id=?`)
      .bind(result.output.id)
      .first<string>('avatar')

    if (avatarKey) bucket.delete(avatarKey)

    await db
      .prepare(`DELETE FROM contacts WHERE id=?`)
      .bind(result.output.id) //
      .run()

    return Response.json(
      { data: result.output, success: true, errors: null },
      { status: 202 }
    )
  },
})
