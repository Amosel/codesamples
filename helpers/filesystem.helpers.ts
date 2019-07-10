import RNFetchBlob from 'rn-fetch-blob'
import md5 from 'md5'
const cacheDir = RNFetchBlob.fs.dirs.CacheDir

export const pathExists = (path:string) => RNFetchBlob.fs.exists(path)
export const pathForStoragageRef = (storageRef: string) => `${cacheDir}/byRef/${md5(storageRef)}`
export const moveFile = RNFetchBlob.fs.mv
export const unlinkStorageRef = async (storageRef: string) => {
  const path = pathForStoragageRef(storageRef)
  const exists = await RNFetchBlob.fs.exists(path)
  if(exists) await RNFetchBlob.fs.unlink(path)
}
