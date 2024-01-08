import type { APIRoute } from 'astro'
import { decode } from 'decode-formdata'
import { generateId } from 'lucia'

const getExtension = (path: string) => {
  const lastPart = path.split('.').pop()
  return lastPart ? `.${lastPart}` : ''
}

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

export const POST = (async ({ locals, request }) => {
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
      { status: 400 }
    )
  }

  const key = `${generateId(15)}${getExtension(file.name)}`

  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
    customMetadata: { filename: file.name },
  })

  return Response.json(
    { data: { key }, success: true, errors: null },
    { status: 201 }
  )
}) satisfies APIRoute
