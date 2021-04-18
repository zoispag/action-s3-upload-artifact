import { info, setOutput, setFailed, getInput } from '@actions/core'
import { readFileSync } from 'fs'
import { makeKey } from './makekey'
import { S3 } from 'aws-sdk'

const uploadFile = ({
  s3,
  fileName,
  bucket,
  key,
}: {
  s3: S3
  fileName: string
  bucket: string
  key: string
}): void => {
  // Read content from the file
  const fileContent = readFileSync(fileName)

  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileContent,
  }

  try {
    s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
      if (err) {
        throw err
      }
      info(`Uploaded ${fileName} to ${data.Location}`)
      setOutput('object_path', data.Location)
    })
  } catch ({ message }) {
    setFailed(message)
  }
}

try {
  const accessKeyId = getInput('access_key_id')
  const secretAccessKey = getInput('secret_access_key')

  const s3 = new S3({
    accessKeyId,
    secretAccessKey,
    apiVersion: '2006-03-01',
  })

  const fileName = getInput('path')
  const bucket = getInput('bucket')
  const key = makeKey({
    key: getInput('key'),
    root: getInput('bucket_root'),
  })

  uploadFile({ s3, fileName, bucket, key })
} catch ({ message }) {
  setFailed(message)
}
