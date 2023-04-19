import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import db from 'web/vendor/db'

export const useSignOut = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => db.auth.authRevoke(),
    onSuccess: () => {
      return navigate('/login', { replace: true })
    }
  })
}
