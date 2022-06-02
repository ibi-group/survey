// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import aws from 'aws-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'json2csv'

type Input = {
  question: number
  sessionUuid: string
  value: string | number
}
type Output = {
  errors?: string[]
}

type Session = Record<number | string, number | string> & { timestamp: number }
const sessions: Record<string, Session> = {}

// Send current session info
setInterval(() => {
  const { AWS_BUCKET_NAME: BUCKET_NAME } = process.env
  if (!BUCKET_NAME) return

  Object.keys(sessions).forEach(async (session) => {
    try {
      const csv = parse(sessions[session])
      const upload = await new aws.S3.ManagedUpload({
        params: {
          Body: csv,
          Bucket: BUCKET_NAME,
          Key: `survey-responses/${session}.csv`
        }
      }).promise()
      console.log(`${upload.Key} uploaded`)
    } catch (err) {
      console.warn(`Failed to upload session: ${err}`)
    }
  })
  console.log('All session uploads initiated')
}, 30_000)

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>
) {
  aws.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: 'v4'
  })

  try {
    const { body: rawBody } = req
    const body: Input = JSON.parse(rawBody)
    const { question, sessionUuid, value } = body

    sessions[sessionUuid] = {
      ...sessions[sessionUuid],
      [question]: value,
      timestamp: Math.floor(Date.now() / 1000)
    }

    res.status(200).json({ errors: [] })
  } catch (e) {
    console.warn(e)
    res.status(400).json({ errors: ['bad request'] })
  }
}
