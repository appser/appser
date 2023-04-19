import { t } from '../../..'

export const fullSchema = {
  state: ['state1'],
  header: t.Object({
    abc: t.String()
  }),
  params: t.Object({
    abc: t.String()
  }),
  body: t.Object({
    abc: t.String()
  }),
  query: t.Object({
    abc: t.String()
  }),
  response: t.Object({
    abc: t.String()
  }),
  other: t.Object({
    id: t.String()
  })
} as const

declare module '../../../src' {
  interface State {
    state1: string
  }
}
