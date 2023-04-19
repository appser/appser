import { App } from 'backend/models/app'

import { appError } from '../app.error'

export async function getAppById(id: string) {
  const app = await App.query.where({ id }).first()

  if (!app) throw appError('notFound')

  return app
}
