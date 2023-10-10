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
  parentDirectory: string | null
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
}
