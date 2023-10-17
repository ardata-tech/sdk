import { Socket, io } from 'socket.io-client'
import DirectoryOperations, {
  DirectoryOperationsInterface
} from './server/directory'
import DriveOperations, { DriveOperationsInterface } from './server/drive'
import FileOperations, { FileOperationsInterface } from './server/file'
import ListenerOperations, {
  ListenerOperationsInterface
} from './server/listeners'
import FileAccessOperations, {
  FileAccessOperationsInterface
} from './web-app/file-access'
import SettingsOperations, {
  SettingsOperationsInterface
} from './web-app/settings'
import StorageOperations, {
  StorageOperationsInterface
} from './web-app/storage'
export interface InitConfig {
  apiKey: string
}

export interface Config {
  apiKey: string
  scope: number
  host: string
  webAppHost: string
  siaHost: string
  userId: string
  listener: Socket
}

export interface DeltaStorageInit {
  directory: DirectoryOperationsInterface
  file: FileOperationsInterface
  drive: DriveOperationsInterface
  fileAccess: FileAccessOperationsInterface
  settings: SettingsOperationsInterface
  storage: StorageOperationsInterface
  listener: ListenerOperationsInterface
}

const DeltaStorage = {
  init({ apiKey }: InitConfig): DeltaStorageInit {
    const [_, scope, _userId, __] = apiKey.split('.')
    const host =
      process.env.DELTA_STORAGE_SERVER_HOST ??
      process.env.NEXT_PUBLIC_DELTA_STORAGE_SERVER_HOST ??
      'https://api.delta.storage'
    const webAppHost =
      process.env.DELTA_STORAGE_WEB_APP_HOST ??
      process.env.NEXT_PUBLIC_DELTA_STORAGE_WEB_APP_HOST ??
      'https://app.delta.storage'
    const siaHost =
      process.env.DELTA_STORAGE_SIA_HOST ??
      process.env.NEXT_PUBLIC_DELTA_STORAGE_SIA_HOST ??
      'https://sia-integration.delta.storage'

    const listener = io(host, {
      auth: {
        token: apiKey
      },
      transports: ['websocket'],
      autoConnect: false
    })

    const config: Config = {
      apiKey,
      scope: parseInt(scope),
      host,
      webAppHost,
      siaHost,
      userId: _userId,
      listener
    }

    return {
      directory: DirectoryOperations(config),
      file: FileOperations(config),
      drive: DriveOperations(config),
      fileAccess: FileAccessOperations(config),
      settings: SettingsOperations(config),
      storage: StorageOperations(config),
      listener: ListenerOperations(config)
    }
  }
}

export {
  DSNProviders,
  Directory,
  File,
  FilecoinResponseData,
  FilefilegoResponseData,
  IPFSMetadata,
  IPFSResponseData,
  SiaMetadata,
  SiaResponseData
} from './types'

export { edgeNodes } from './constants'
export default DeltaStorage
