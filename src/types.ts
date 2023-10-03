export interface Directory {
  name: string
  id: string
  itemCount: number
  storageClass: string
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
  storageId: string
  updatedAt: Date
  storageClasses: {
    storageClassName: string
  }[]
  pieceId?: string
  network?: string
  onChainId?: string
}
