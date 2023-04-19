import type { TView } from 'backend/models/dataset'

export const defaultView: Pick<TView, 'type' | 'sorts' | 'column' | 'stickyColumn'> = {
  type: 'grid',
  sorts: ['-id'],
  column: {
    id: {
      pos: 100,
      selected: false
    },
    name: {
      pos: 200,
      selected: true
    },
    creator: {
      pos: 300,
      selected: false
    },
    lastEditor: {
      pos: 400,
      selected: false
    },
    createdAt: {
      pos: 500,
      selected: false
    },
    updatedAt: {
      pos: 600,
      selected: false
    }
  },
  stickyColumn: 1
}
