const process = require('node:process')

const aws = require('aws-sdk')
const { parse } = require('json2csv')
const { Server } = require('socket.io')

const userQuestionMatrix = {}
const userTimeouts = {}

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
  const { AWS_BUCKET_NAME: BUCKET_NAME } = process.env
  console.log(`Uploading data for ${user}`)
  if (!BUCKET_NAME) {
    console.error('No bucket name provided')
    return
  }

  const csv = parse(data)
  try {
    const upload = await new aws.S3.ManagedUpload({
      params: {
        Body: csv,
        Bucket: BUCKET_NAME,
        Key: `survey-responses/${user}.csv`
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

const io = new Server(3001, {
  cors: {
    origin: '*'
  }
})

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
      uploadUserData(user, userQuestionMatrix[user])
    }
  })
})
