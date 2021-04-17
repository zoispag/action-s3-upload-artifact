# S3 Upload Artifact Action

This action uploads a build artifact to an S3 bucket.

## Inputs

| **Name**          | **Description**                |
| ----------------- | ------------------------------ |
| access_key_id     | Your AWS Access Key ID         |
| secret_access_key | Your AWS Secret Access Key     |
| bucket            | Your AWS bucket name           |
| key               | Artifact destination in bucket |
| path              | The file to upload             |

## Outputs

| **Name**    | **Description**      |
| ----------- | -------------------- |
| object_path | Uploaded object path |

## Example usage

```yml
name: Upload artifact to S3

on: [push]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Upload artifact
        uses: zoispag/action-s3-upload-artifact
        id: s3
        with:
          access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          bucket: ${{ secrets.AWS_BUCKET }}
          key: my-artifact
          path: path/to/artifact/

      - name: Output path
        run: echo ${{ steps.s3.outputs.object_path }}
```
