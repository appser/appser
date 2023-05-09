import { HttpStatusCode as Http } from '@appser/common'
import { showNotification } from '@appser/ui'// notifications
import get from 'lodash/get'
import { Navigate, useLocation, useRouteError } from 'react-router-dom'

import { BadRequest } from './components/errors/BadRequest'
import { Forbidden } from './components/errors/Forbidden'
import { NotFound } from './components/errors/NotFound'
import i18n from './vendor/i18n'

export function ErrorBoundary() {
  const error = useRouteError()
  // const Outlet = useOutlet()
  const location = useLocation()
  const statusCode = Object(error).status

  if (statusCode === Http.Unauthorized) return <Navigate to="/login" state={{ from: location }} replace />
  if (statusCode === Http.Forbidden) return <Forbidden />
  if (statusCode === Http.BadRequest) return <BadRequest />
  if (statusCode === Http.NotFound) return <NotFound />

  console.error('ErrorBoundary:', error)

  return (
    <p>[ErrorBoundary]: There was an error:  {Object(error).message}</p>
  )
}

export const onMutationError = (error: unknown) => {
  const code = get(error, 'body.error.code') ?? 'common.unknown'
  const t = i18n.getFixedT(i18n.language)

  console.error('global Mutation error handler:', error)

  showNotification({
    title: t(code, { ns: 'error' }),
    message: ''
  })
}

export const onQueryError = (error: unknown) => {
  return console.error('global Query error handler:', error)
}
