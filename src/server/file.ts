import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import DeltaStorageSDK from '../index'
import axios from 'axios'
import { IPFSMetadata, SiaMetadata } from '../types'

export async function readFile(this: DeltaStorageSDK, id?: string) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_FILE,
    'READ_FILE is not allowed.'
  )
  return await axios.get(`${this.host}/files/${id ?? ''}`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
}

export async function uploadFile(
  this: DeltaStorageSDK,
  file: any,
  directoryId: string,
  storageClasses?: string[]
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.UPLOAD_FILE,
    'UPLOAD_FILE is not allowed.'
  )

  const formData = new FormData()
  formData.append('file', file)
  formData.append('directoryId', directoryId)
  if (storageClasses && storageClasses.length > 0)
    formData.append('storageClasses', JSON.stringify(storageClasses))

  return await axios.post(`${this.host}/files/upload`, formData, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
}

export async function uploadFiles(
  this: DeltaStorageSDK,
  files: {
    file: any
    directoryId: string
    storageClasses?: string[]
  }[]
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.UPLOAD_FILE,
    'UPLOAD_FILES is not allowed.'
  )

  await Promise.all(
    files.map(async (data) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('directoryId', data.directoryId)
      if (data.storageClasses && data.storageClasses.length > 0)
        formData.append('storageClasses', JSON.stringify(data.storageClasses))

      return await axios.post(`${this.host}/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      })
    })
  )
}

export async function deleteFile(this: DeltaStorageSDK, id: string) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.DELETE_FILE,
    'DELETE_FILE is not allowed.'
  )
  return await axios.delete(`${this.host}/files/${id}`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
}

export async function renameFile(
  this: DeltaStorageSDK,
  id: string,
  name: string
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.UPLOAD_FILE | OPERATION_SCOPE.DELETE_FILE,
    'RENAME_FILE is not allowed.'
  )
  return await axios.put(
    `${this.host}/files/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
}

export async function updateFile(
  this: DeltaStorageSDK,
  id: string,
  name?: string,
  addStorageClasses?: string[],
  removeStorageClasses?: string[]
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.UPLOAD_FILE | OPERATION_SCOPE.DELETE_FILE,
    'UPDATE_FILE is not allowed.'
  )
  return await axios.put(
    `${this.host}/files/${id}`,
    { name, addStorageClasses, removeStorageClasses },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
}

export async function getFileReplications(
  this: DeltaStorageSDK,
  cid: string
): Promise<
  | {
      IPFS: IPFSMetadata | null
      Sia: SiaMetadata | null
      Filecoin: any
      Filefilego: any
    }
  | undefined
> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_FILE,
    'READ_FILE is not allowed.'
  )
  let replicationData = {
    IPFS: null,
    Sia: null,
    Filecoin: null,
    Filefilego: null
  }
  try {
    const ipfsResponse = await axios.get(`${this.host}/files/metadata/${cid}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    })

    const siaResponse = await axios.get(
      `${this.siaHost}/open/object/meta/${this.userId}/${cid}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }
    )

    const siaMetadata = siaResponse?.data
    const ipfsMetadata = ipfsResponse?.data

    if (siaMetadata) {
      replicationData.Sia = siaMetadata
    }
    if (ipfsMetadata) {
      replicationData.IPFS = ipfsMetadata
    }
  } catch (error) {
    console.log(error)
  }

  return replicationData
}
