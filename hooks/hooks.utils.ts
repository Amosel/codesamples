import { useReducer } from 'react'
import { indexOf, reject } from 'lodash/fp'

export const stateReducer = <T>(prev: T, current: T) => ({
  ...prev,
  ...current,
})

type ItemState<T> = {
  items: T[]
  selectedItemIndex?: number
}
type Pred<T> = (item: T) => boolean
type Equality<T> = (first: T, second: T) => boolean

export type UseItemListType<T> = {
  items: T[]
  selectedItemIndex?: number
  removeItemWhere: (pred: Pred<T>) => void
  removeItem: (item: T) => void
  addItem: (item: T) => void
  selectItemWhere: (pred: Pred<T>) => void
  selectItem: (item: T) => void
  selectLast: () => void
  deselectItem: (item: T) => void
  deselectItemWhere: (pred: Pred<T>) => void
  deselectCurrentItem: () => void
  setFirstWhere:(pred: Pred<T>) => void
  setFirst: (item: T) => void
}

const defaultEquality = <T>(first: T, second: T) => first === second

export const useItemList = <T>(
  initialState: ItemState<T> = { items: [] },
  equality: Equality<T> = defaultEquality,
): UseItemListType<T> => {
  const [state, setState] = useReducer(stateReducer, initialState)

  const setFirstWhere = (pred: Pred<T>) => {
    const index = state.items.findIndex(pred)
    if(index !== -1 && index !== 0) {
      setState({
        items: [
          state.items[index],
          ...reject(pred, state.items)
        ]
      })
    }
  }

  const setFirst = (item: T) => setFirstWhere((i: T) => equality(i, item))
  
  const addItem = (item: T) => {
    const index = state.items.findIndex((i: T) => equality(i, item))
    if (index === -1) {
      setState({
        items: [...state.items, item],
      })
    }
  }

  const removeItemWhere = (pred: (item: T) => boolean) => {
    const index = state.items.findIndex(pred)
    if (index !== -1) {
      setState({
        selectedItem:
          state.selectedItem === index ? undefined : state.selectedItem,
        items: reject(pred, state.items),
      })
    }
  }

  const removeItem = (item: T) => removeItemWhere((i: T) => equality(i, item))

  const selectItemWhere = (pred: (item: T) => boolean) => {
    const index = state.item.findIndex(pred)
    if (index !== -1) {
      setState({
        selectedItemIndex: index,
      })
    }
  }
  const selectItem = (item: T) => selectItemWhere((i: T) => i === item)

  const selectLast = () =>
    setState({
      selectedItem: state.items[state.items.length - 1],
    })

  const deselectItemWhere = (pred: (item: T) => boolean) => {
    const index = state.items.findIndex(pred)
    if (index !== -1) {
      setState({
        selectedItemIndex: undefined,
      })
    }
  }
  const deselectItem = (item: T) =>
    deselectItemWhere((i: T) => equality(i, item))

  const deselectCurrentItem = () => setState({ selectedItem: undefined })

  return {
    ...state,
    addItem,
    removeItem,
    removeItemWhere,
    selectItem,
    selectItemWhere,
    selectLast,
    deselectItem,
    deselectCurrentItem,
    setFirst,
  }
}
