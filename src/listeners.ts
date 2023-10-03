import DeltaStorageSDK from './index'
import { Directory, File } from './types'

export function connect(this: DeltaStorageSDK) {
  this.listener.connect()
}

export function disconnect(this: DeltaStorageSDK) {
  this.listener.disconnect()
}

export function disconnectReadDirectoryEvent(this: DeltaStorageSDK) {
  this.listener.off('directory:change')
}
export async function onDirectoryChange(
  this: DeltaStorageSDK,
  callback: (data: any) => void
) {
  return this.listener.on('directory:change', callback)
}

export async function onTotalSizeChange(
  this: DeltaStorageSDK,
  callback: (data: any) => void
) {
  this.listener.emit('total-size:initialize')
  this.listener.on('total-size:change', async () => {
    const totalSize = await this.getTotalSize()
    callback(totalSize)
  })
}

export async function onReadDirectoryEvent(
  this: DeltaStorageSDK,
  id: string,
  onChange: (directory: { directories: Directory[]; files: File[] }) => void
) {
  this.listener.emit('directory:initialize')
  this.onDirectoryChange(async () => {
    const latestDirectory = (await this.readDirectory(id)).data
    onChange(latestDirectory)
  })
}

export async function onReadDirectorySegmentChange(
  this: DeltaStorageSDK,
  segments: string,
  onChange: (data: any) => void
) {
  this.onDirectoryChange(async () => {
    const res = await this.readDirectoryBySegment(segments)
    onChange(res.data)
  })
}
