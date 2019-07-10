import { Image, LocalFile, UTI } from '../types'

export function toFile(image: Image): LocalFile {
  return {
    uri: image.path,
    fileSize: image.size,
    fileName: image.path.substring(image.path.lastIndexOf('/') + 1),
    type: image.mime as UTI,
  }
}