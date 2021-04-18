import { join } from 'path'
import { context } from '@actions/github'

export const makeKey = ({
  key,
  root = '',
}: {
  key: string
  root: string
}): string => {
  return join(
    root,
    context.payload.repository?.full_name || '',
    context.sha,
    key,
  )
}
