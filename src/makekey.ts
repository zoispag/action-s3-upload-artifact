import { context } from '@actions/github'
import { join } from 'path'

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
