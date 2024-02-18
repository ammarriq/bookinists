import type { APIRoute } from 'astro'

import { decode } from 'decode-formdata'
import { generateId } from 'lucia'
import { flatten, minLength, object, safeParse, string } from 'valibot'

// const getExtension = (path: string) => {
//   const lastPart = path.split('.').pop()
//   return lastPart ? `.${lastPart}` : ''
// }

const KeySchema = object({
  key: string('Key is required', [minLength(15, 'Invalid key')]),
})

export const GET = (async ({ locals, url }) => {
  const bucket = locals.runtime.env.SITE_BUCKET

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const key = url.searchParams.get('key')

  if (!key) {
    return Response.json(
      { message: 'Key is required' }, //
      { status: 400 }
    )
  }

  const object = await bucket.get(key)

  if (!object) {
    return Response.json(
      { message: 'No file available' }, //
      { status: 404 }
    )
  }

  return new Response(await object.arrayBuffer(), { status: 200 })
}) satisfies APIRoute

export const PUT = (async ({ locals, request }) => {
  const bucket = locals.runtime.env.SITE_BUCKET

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const formData = await request.formData()
  const { file } = decode<{ file: File }>(formData, { files: ['file'] })

  if (!file) {
    const errors = { file: ['File is required'] }
    return Response.json(
      { data: null, success: false, errors },
      { status: 404 }
    )
  }

  const key = `${generateId(15)}:::${file.name}`

  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { filename: file.name },
  })

  return Response.json(
    { data: { key }, success: true, errors: null },
    { status: 201 }
  )
}) satisfies APIRoute

export const DELETE = (async ({ locals, request }) => {
  const bucket = locals.runtime.env.SITE_BUCKET

  if (!locals.user) {
    return new Response(null, { status: 401 })
  }

  const formData = await request.formData()
  const data = decode(formData)
  const result = safeParse(KeySchema, data)

  if (!result.success) {
    const message = flatten(result.issues).nested?.key
    return Response.json(
      { data: null, success: false, errors: { message } },
      { status: 400 }
    )
  }

  const key = result.output.key
  await bucket.delete(key)

  return Response.json(
    { data: { key }, success: true, errors: null },
    { status: 201 }
  )
}) satisfies APIRoute
