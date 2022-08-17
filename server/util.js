const csv = require('csvtojson')
const { parse } = require('json2csv')

const config = require('../server.config.json')

/**
 * Async/await wrapper for listing all objects in an S3 bucket
 */
const listObjectsInBucket = async (s3, bucket) => {
  return await s3.listObjects({ Bucket: bucket }).promise()
}

/**
 * Async/await wrapper for getting the contents of a specific object
 * within an s3 bucket
 */
const getS3ObjectContents = async (s3, bucket, key) => {
  return new Promise((resolve, reject) => {
    s3.getObject({ Bucket: bucket, Key: key }, function (err, data) {
      if (err) reject(err)
      else {
        resolve(String.fromCharCode(...data.Body))
      }
    })
  })
}

/**
 * Uses the key path to determine if an s3 object is in the survey responses folder,
 * and therefore is a survey response
 */
const objectIsSurveyResponse = (s3Object) =>
  s3Object.Key.includes('survey-responses/')

/**
 * Uses the S3 object data to determine if an S3 object was modified in the past
 * 24 hours.
 *
 * The main component of this server puts the uploaded files into directories sorted
 * by day. However, using the S3 upload dates allows us to avoid relying on this, and instead
 * allows us to use these subfolders for human readability only. Timezone issues are avoided
 * as this script runs on the same server that uploaded the files.
 */
const objectWasCreatedInLast24Hours = (s3Object) => {
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  return s3Object.LastModified >= yesterday
}

/**
 * Main method which gets all files created within the past 24 hours, concatenates them
 * into a single csv and then uploads that csv to the same bucket all the files were read from.
 */
const concatenatePreviousDay = async (aws) => {
  const { bucketName: bucket } = config
  const s3 = new aws.S3({ apiVersion: '2006-03-01' })
  const filesInBucket = await listObjectsInBucket(s3, bucket)
  const filteredFilesInBucket = filesInBucket.Contents.filter(
    (s3Object) =>
      objectIsSurveyResponse(s3Object) &&
      objectWasCreatedInLast24Hours(s3Object)
  )

  // This object converts all csv rows to JSON for future merging
  // TODO: add timestamps here?
  const allResponses = (
    await Promise.all(
      filteredFilesInBucket.map(async (file) => {
        const fileContents = await getS3ObjectContents(s3, bucket, file.Key)
        return csv().fromString(fileContents)
      })
    )
  ).flat()

  // This object must first be initialized with all keys from all responses
  // TODO: should these keys come from the client config instead? That way they wouldn't
  // just be "1", "2", etc
  const allKeys = Array.from(
    // First create a list of all keys
    allResponses.reduce((acc, cur) => {
      Object.keys(cur).forEach((key) => acc.add(key))
      return acc
    }, new Set())
  )

  // Convert to csv and upload
  const parsed = parse(allResponses, { fields: allKeys.sort() })
  try {
    // TODO: extract to own method
    const date = new Date()
    const dateString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`

    const upload = await new aws.S3.ManagedUpload({
      params: {
        Body: parsed,
        Bucket: config.bucketName,
        Key: `survey-responses/${dateString}-merged.csv`
      }
    }).promise()
    console.log(`${upload.Key} uploaded`)
  } catch (err) {
    console.warn(`Failed to upload session: ${err}`)
  }
}

module.exports = { concatenatePreviousDay }
