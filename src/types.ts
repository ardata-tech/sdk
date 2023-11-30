export type StorageClassName = 'hot' | 'warm' | 'glacier'

export interface Directory {
  name: string
  id: string
  itemCount: number
  parentDirectoryId: string | null
  ownerId: string
  softDeleted: boolean
  createdAt: Date
  updatedAt: Date
  storageClassName: StorageClassName
  driveId: string | null
}

export interface File {
  contentType: string
  createdAt: Date
  directoryId: string
  id: string
  imageLink: string
  name: string
  ownerId: string
  size: number
  softDeleted: boolean
  status: string
  cid: string
  updatedAt: Date
  storageClasses: {
    storageClassName: string
  }[]
  pieceId?: string
  network?: string
  onChainId?: string
  edgeURL: string
  dataURI: string
  isEncrypted: boolean
}

export enum DSNProviders {
  IPFS,
  SIA,
  FILECOIN,
  FILEFILEGO
}

export interface SiaMetadata {
  hasMore: boolean
  object: {
    eTag: string
    health: number
    mimeType: string
    modTime: Date
    name: string
    size: number
    key: string
    slabs: Array<{
      slab: {
        health: number
        key: string
        minShards: number
        shards: Array<{
          host: string
          root: string
        }>
      }
      offset: number
      length: number
    }> | null
    partialSlab: any | null
  }
}

export interface IPFSMetadata {
  name: string
  cid: string
  ownerId: string
  size: number
  pieceId: string | null
  onChainId: string | null
  status: string
  network: any
  edgeURL: string
  contentType: string
  createdAt: Date
  updatedAt: Date
}

export interface SiaResponseData {
  links: string[]
  status: string
  metadata: SiaMetadata | null
}

export interface IPFSResponseData {
  links: string[]
  status: string
  metadata: IPFSMetadata | null
}

export interface FilecoinResponseData {
  links: string[]
  status: string
  metadata: any
}

export interface FilefilegoResponseData {
  links: string[]
  status: string
  metadata: any
}

export enum RetrievalRequestStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}
export interface RetrievalRequest {
  id: string
  email: string
  token: string
  dsn: string
  userId: string
  status: RetrievalRequestStatus
  links: string[]
  createdAt: Date
  updatedAt: Date
  fileId: string
  file: {
    cid: string
  }
}

export interface DataResponse {
  success: boolean
  code: number
  message?: string
}

export type DataResponsePromise<T = {}> = Promise<
  [(DataResponse & T) | null, error: DataResponse | null]
>
