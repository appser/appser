import { useMutation } from '@tanstack/react-query'
import db from 'web/vendor/db'

type ChangeAccountPasswordParams = Parameters<typeof db.account.changeAccountPassword>[0]

export const useChangeAccountPassword = () => {
  return useMutation({
    mutationFn: (p: ChangeAccountPasswordParams) => {
      return db.account.changeAccountPassword(p)
    }
  })
}
