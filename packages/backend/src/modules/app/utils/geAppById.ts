import { App } from 'backend/models/App'

import { appError } from '../app.error'

export async function getAppById(id: string) {
  const app = await App.query.where({ id }).first()

  if (!app) throw appError('notFound')

  return app
}
