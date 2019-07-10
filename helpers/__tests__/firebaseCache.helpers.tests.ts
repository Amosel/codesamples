import { pipe } from 'lodash/fp'
import {
  isLoading,
  setLoaded,
  isLoaded,
  removeLoaded,
  setLoading,
  removeLoading,
} from '../firebaseCache.helpers'

const ref =
  'peaches/FtXHl5FtMtAZOqqaEWUd/thumb.0.0266a444-344d-453d-965e-16d6648bfdd0.jpg'

const initialState = { loading: [], loaded: [] }

describe('setLoaded', () => {
  const state = {
    loading: [
      'peaches/FtXHl5FtMtAZOqqaEWUd/thumb.0.0266a444-344d-453d-965e-16d6648bfdd0.jpg',
    ],
    loaded: [],
  }
  const nextState = setLoaded(ref, state)
  it('addes path to loaded dictionary', () => {
    expect(nextState.loaded).toEqual([ref])
  })
  it('removes the storageRef from the loading array', () => {
    expect(nextState.loading).toEqual([])
  })
})

describe('isLoaded', () => {
  it('returns false when it is loading', () => {
    const state = {
      loading: [ref],
      loaded: [],
    }
    expect(isLoaded(ref, state)).toEqual(false)
  })

  it('returns true when is is loaded', () => {
    const state = {
      loading: [],
      loaded: [ref],
    }
    expect(isLoaded(ref, state)).toEqual(true)
  })
})

describe('removeLoaded', () => {
  it('removes the ref if it exists in loaded', () => {
    const state = {
      loading: [],
      loaded: [ref],
    }
    expect(removeLoaded(ref, state).loaded).toEqual([])
  })
  it('does not thing if the string does not exist in loaded', () => {
    const state = {
      loading: [ref],
      loaded: [],
    }
    expect(removeLoaded(ref, state)).toEqual(state)
  })
})

describe('isLoading', () => {
  it('returns true if it is loading', () => {
    const state = {
      loading: [ref],
      loaded: [],
    }
    expect(isLoading(ref, state)).toEqual(true)
  })
  it('returns false if it is not loading', () => {
    const state = {
      loading: [],
      loaded: [ref],
    }
    expect(isLoading(ref, state)).toEqual(false)
  })
})

describe('setLoading', () => {
  it('becomes loading', () => {
    const nextState = setLoading(ref, initialState)
    expect(isLoading(ref, nextState)).toEqual(true)
  })
})

describe('removeLoading', () => {
  it('removes loading', () => {
    let nextState = setLoading(ref, initialState)
    nextState = removeLoading(ref, nextState)
    expect(isLoading(ref, nextState)).toEqual(false)
    expect(nextState).toEqual(initialState)
  })
})
