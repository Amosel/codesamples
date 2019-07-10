import { get } from 'lodash/fp'
import { Peach, Like, PeachInfo } from '../types'
import { getStorageRef } from './storage.helpers'

export const getPeachInfo = (like: Like): PeachInfo => get('peachInfo', like)

export const toPeachInfo = ({
  id,
  title,
  subtitle,
  files
}: Peach): PeachInfo => ({
  id,
  title,
  subtitle,
  deckFiles: files.map(file => file)
})

export const getPeachDeckThumbImageStorageRef = ({ peachId, fileName }: {
  peachId: string,
  fileName: string
})  => getStorageRef({ collection: 'peaches', doc: peachId, fileName: `thumb.${fileName}`})


export const getPeachDeckImageStorageRef = ({ peachId, fileName }: {
  peachId: string,
  fileName: string
})  => getStorageRef({ collection: 'peaches', doc: peachId, fileName })

export const peachDeckFilenameAtIndex = (index: number) =>  `deck.${index}.jpg`
