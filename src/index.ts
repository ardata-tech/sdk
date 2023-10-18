import { io, type Socket } from 'socket.io-client'
import * as DirectoryOperations from './server/directory'
import * as FileOperations from './server/file'
import * as ListenerOperations from './server/listeners'
import * as StorageOperations from './web-app/storage'
import * as FileAccessOperations from './web-app/file-access'
import * as SettingsOperations from './web-app/settings'
import * as DriveOperations from './server/drive'

export interface DeltaStorageConfig {
  apiKey: string
}

const myClassMethods = {
  ...DirectoryOperations,
  ...FileOperations,
  ...StorageOperations,
  ...ListenerOperations,
  ...FileAccessOperations,
  ...SettingsOperations,
  ...DriveOperations
}
class _DeltaStorageSDK {
  public readonly apiKey: string
  public readonly scope: number
  public readonly host: string
  public readonly webAppHost: string
  public readonly listener: Socket
  public readonly userId: string
  public readonly siaHost: string

  constructor(config: DeltaStorageConfig) {
    const [_apiKeyId, scope, _userId, _hash] = config.apiKey.split('.')
    this.apiKey = config.apiKey
    this.userId = _userId
    this.scope = parseInt(scope)
    this.host = 'https://api.delta.storage'
    this.webAppHost = 'https://app.delta.storage'
    this.siaHost = 'https://sia-integration.delta.storage'
    this.host = this.host.slice(-1) === '/' ? this.host.slice(0, -1) : this.host
    this.webAppHost =
      this.webAppHost.slice(-1) === '/'
        ? this.webAppHost.slice(0, -1)
        : this.webAppHost

    this.listener = io(this.host, {
      auth: {
        token: config.apiKey
      },
      autoConnect: false
    })

    Object.assign(this, myClassMethods)
  }
}

export type DeltaStorageSDK = InstanceType<typeof _DeltaStorageSDK> &
  typeof myClassMethods

export const DeltaStorageSDK = _DeltaStorageSDK as unknown as {
  new (...args: ConstructorParameters<typeof _DeltaStorageSDK>): DeltaStorageSDK
}
export {
  Directory,
  File,
  DSNProviders,
  IPFSMetadata,
  SiaMetadata
} from './types'

export default DeltaStorageSDK
