import { io, type Socket } from 'socket.io-client'
import * as DirectoryOperations from './directory'
import * as FileOperations from './file'
import * as ListenerOperations from './listeners'

export interface DeltaStorageConfig {
  apiKey: string
}

const myClassMethods = {
  ...DirectoryOperations,
  ...FileOperations,
  ...ListenerOperations
}
class _DeltaStorageSDK {
  public readonly apiKey: string
  public readonly scope: number
  public readonly host: string
  public readonly listener: Socket

  constructor(config: DeltaStorageConfig) {
    const [_apiKeyId, scope, _userId, _hash] = config.apiKey.split('.')
    this.apiKey = config.apiKey
    this.scope = parseInt(scope)
    this.host = 'https://api.delta.storage'
    this.host = this.host.slice(-1) === '/' ? this.host.slice(0, -1) : this.host

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

export default DeltaStorageSDK
