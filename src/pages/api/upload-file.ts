import { PutObjectCommand } from '@aws-sdk/client-s3'
import { blob, flatten, object, string, safeParse } from 'valibot'
import { createActions } from '@/lib/utils'
import { S3 } from '@/lib/r2'
import { decode } from 'decode-formdata'

const FileSchema = object({
  filename: string('File name is required.'),
  file: blob('Please select an image file.'),
})

export const POST = createActions({
  default: async ({ locals, request }) => {
    if (!locals.user) {
      return new Response(null, { status: 401 })
    }

    const formData = await request.formData()
    const data = decode(formData, { files: ['file'] })
    const result = safeParse(FileSchema, data)

    if (!result.success) {
      return Response.json(
        { success: false, s: flatten(result.issues).nested },
        { status: 400 }
      )
    }

    try {
      const res = await S3.send(
        new PutObjectCommand({
          Bucket: import.meta.env.R2_BUCKET_NAME,
          Key: `${result.output.filename}`,
          Body: Buffer.from(await result.output.file.arrayBuffer()),
        })
      )

      return Response.json(res)
    } catch (err) {
      const error = err as Error
      return Response.json(
        { message: error.message, name: error.name },
        { status: 500 }
      )
    }
  },
})
