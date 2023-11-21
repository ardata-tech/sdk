import { Socket, io } from 'socket.io-client'
import DirectoryOperations, {
  DirectoryOperationsInterface
} from './server/directory'
import DriveOperations, { DriveOperationsInterface } from './server/drive'
import FileOperations, { FileOperationsInterface } from './server/file'
import ListenerOperations, {
  ListenerOperationsInterface
} from './server/listeners'
import EdgeNodeOperations, {
  EdgeNodeOperationsInterface
} from './web-app/edge-nodes'
import FileAccessOperations, {
  FileAccessOperationsInterface
} from './web-app/file-access'
import SettingsOperations, {
  SettingsOperationsInterface
} from './web-app/settings'
import StorageOperations, {
  StorageOperationsInterface
} from './web-app/storage'
import RetrievalRequestOperations, {
  RetrievalRequestOperationsInterface
} from './server/retrievalRequest'
import ExportOperation, { ExportOperationInterface } from './server/export'
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
  edgeNodes: EdgeNodeOperationsInterface
  retrievalRequest: RetrievalRequestOperationsInterface
  export: (params: ExportOperationInterface) => void
}

const DeltaStorage = {
  init({ apiKey }: InitConfig): DeltaStorageInit {
    const [, scope, _userId] = apiKey.split('.')
    const host =
      process.env.NODE_ENV === 'test'
        ? 'http://localhost:1337'
        : process.env.DELTA_STORAGE_SERVER_HOST ??
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
      listener: ListenerOperations(config),
      edgeNodes: EdgeNodeOperations(config),
      retrievalRequest: RetrievalRequestOperations(config),
      export: ({ id, signal, setProgress }) =>
        ExportOperation(config)({ id, signal, setProgress })
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
  SiaResponseData,
  RetrievalRequest,
  RetrievalRequestStatus
} from './types'

export default DeltaStorage
