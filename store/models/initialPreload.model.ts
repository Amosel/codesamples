import { createModel } from '@rematch/core'
import { PreloadState } from '../../types'
import { concat, set, update, difference} from 'lodash/fp'

const initialState: PreloadState = []

export const initialPreload = createModel({
  state: initialState,
  reducers: {
    addRefs(state: PreloadState, refs: string[]) {
      const newRefs = difference(refs, state)
      if(newRefs.length) {
        return concat(newRefs, state)
      }
      return state
    },
    removeRefs(state: PreloadState, refs: string[]) {
      const newRef = difference(refs, state)
      if(newRef.length > 0) {
        return newRef
      }
      return state
    }
  },
})
