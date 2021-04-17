const core = require('@actions/core')
const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const github = require('@actions/github')

const uploadFile = ({ s3, fileName, bucket, key }) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName)

  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileContent,
  }

  try {
    s3.upload(params, function (err, data) {
      if (err) {
        throw err
      }
      core.info(`Uploaded ${fileName} to ${data.Location}`)
      core.setOutput('object_path', data.Location)
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

const makeKey = ({ key, root = '' }) => {
  return path.join(
    root,
    github.context.payload.repository.full_name,
    github.context.sha,
    key,
  )
}

try {
  const accessKeyId = core.getInput('access_key_id')
  const secretAccessKey = core.getInput('secret_access_key')

  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    apiVersion: '2006-03-01',
  })

  const fileName = core.getInput('path')
  const bucket = core.getInput('bucket')
  const key = makeKey({
    key: core.getInput('key'),
    root: core.getInput('bucket_root'),
  })

  uploadFile({ s3, fileName, bucket, key })
} catch (error) {
  core.error(err)
  core.setFailed(error.message)
}
