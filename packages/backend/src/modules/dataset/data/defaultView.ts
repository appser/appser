import type { TView } from 'backend/models/dataset'

export const defaultView: Omit<TView, 'id'> = {
  type: 'grid',
  sorts: ['-id'],
  column: {
    id: {
      selected: false
    },
    name: {
      selected: true
    },
    creator: {
      selected: false
    },
    lastEditor: {
      selected: false
    },
    createdAt: {
      selected: false
    },
    updatedAt: {
      selected: false
    }
  },
  columns: ['id', 'name', 'creator', 'lastEditor', 'createdAt', 'updatedAt'],
  stickyColumn: 0
}
