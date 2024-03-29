const schedule = require('node-schedule')
const aws = require('aws-sdk')
const { parse } = require('json2csv')
const { Server } = require('socket.io')

const config = require('../server.config.json')

const { concatenatePreviousDay, generateDateString } = require('./util')

const userQuestionMatrix = {}
const userTimeouts = {}

aws.config.update({
  accessKeyId: config.awsAccessKeyId,
  region: config.awsRegion,
  secretAccessKey: config.awsSecretKey,
  signatureVersion: 'v4'
})

const updateUserQuestion = (user, question, text) => {
  if (userQuestionMatrix[user]) {
    userQuestionMatrix[user][question] = text
  } else {
    userQuestionMatrix[user] = {
      [question]: text
    }
  }
}

const uploadUserData = async (user, data) => {
  console.log(`Uploading data for ${user}`)
  if (!config.bucketName) {
    console.error('No bucket name provided')
    return
  }

  const csv = parse(data)
  try {
    const dateString = generateDateString()

    const upload = await new aws.S3.ManagedUpload({
      params: {
        Body: csv,
        Bucket: config.bucketName,
        Key: `survey-responses/${dateString}/${user}.csv`
      }
    }).promise()
    console.log(`${upload.Key} uploaded`)
  } catch (err) {
    console.warn(`Failed to upload session: ${err}`)
  }

  // Delete reference to user after a day so gc can clean up memory
  clearTimeout(userTimeouts[user])
  userTimeouts[user] = setTimeout(() => {
    delete userQuestionMatrix[user]
    delete userTimeouts[user]
  }, 1000 * 60 * 60 * 24)
}

const io = new Server(config.port, {
  cors: {
    origin: '*'
  }
})

console.log(`Server running on port ${config.port}`)

io.on('connection', (socket) => {
  console.log('New user connected.')

  socket.on('textUpdated', ({ question, sessionUuid, value }) => {
    console.log(`${sessionUuid} updated ${question} to ${value}`)
    socket.data.sessionUuid = sessionUuid
    updateUserQuestion(sessionUuid, question, value)
  })

  socket.on('disconnect', () => {
    const user = socket.data.sessionUuid
    if (userQuestionMatrix[user]) {
      userQuestionMatrix[user].timestamp = new Date().toLocaleString()
      uploadUserData(user, userQuestionMatrix[user])
    }
  })
})

// Set up "cron" job for automatic concatenation every day at midnight
schedule.scheduleJob('0 0 * * *', function () {
  concatenatePreviousDay(aws)
})

// Run the script on startup to more gracefully handle crash situations
concatenatePreviousDay(aws)
