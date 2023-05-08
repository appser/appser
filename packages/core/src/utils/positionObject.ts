import { defaults } from 'lodash'

interface IPositionObject {
  [key: string]: {
    [key: string]: any
    pos?: number
  }
}

const POSITION_STEP = 100

export class PositionObject<T extends IPositionObject> {
  private obj: Record<string, any>

  constructor(obj: T) {
    this.obj = obj
  }

  get lastPos() {
    return Object.values(this.obj).reduce((acc, v) => Math.max(acc, v?.pos ?? 0), 0)
  }

  rebuild() {
    const sortedKeys = Object.keys(this.obj).sort((a, b) => {
      return (this.obj[a].pos ?? 0) - (this.obj[b].pos ?? 0)
    })

    let increment = 100

    sortedKeys.forEach((key: string) => {
      this.obj[key] = {
        ...this.obj[key],
        pos: increment
      }
      increment += POSITION_STEP
    })

    return this.obj
  }

  add(key: string, value: any) {
    this.obj[key] = defaults(value, { pos: this.lastPos + POSITION_STEP })

    return this.obj
  }

  toObject() {
    return this.obj
  }
}
