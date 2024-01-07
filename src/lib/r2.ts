import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.R2_SECRET_KEY,
  },
})

export const getFile = async (key: string) => {
  const object = new GetObjectCommand({
    Bucket: import.meta.env.R2_BUCKET_NAME,
    Key: key,
  })

  return await getSignedUrl(S3, object, { expiresIn: 3600 })
}
