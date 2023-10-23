import axios, { GenericAbortSignal } from 'axios'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE, edgeNodes } from '../constants'
import DeltaStorageSDK from '../index'
import {
  File,
  IPFSMetadata,
  IPFSResponseData,
  SiaMetadata,
  SiaResponseData
} from '../types'

export async function readFile(this: DeltaStorageSDK, id?: string) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_FILE,
    'READ_FILE is not allowed.'
  )
  return await axios.get<File>(`${this.host}/files/${id ?? ''}`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
}

export async function uploadFile(
  this: DeltaStorageSDK,
  file: any,
  directoryId: string,
  storageClasses?: string[],
  setProgress?: (progress: number) => void,
  signal?: GenericAbortSignal | undefined
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

  const res = await axios
    .post(`${this.host}/files/upload`, formData, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      },
      signal,
      onUploadProgress: (progressEvent) => {
        if (!setProgress) return
        setProgress(0)
        const progress = (progressEvent.loaded / progressEvent.total!) * 50
        setProgress(progress)
      },
      onDownloadProgress: (progressEvent) => {
        if (!setProgress) return
        const progress = 50 + (progressEvent.loaded / progressEvent.total!) * 50
        setProgress(progress)
      }
    })
    .catch(function (e) {
      // if the reason behind the failure
      // is a cancellation
      if (axios.isCancel(e)) {
        console.error('Uploading canceled')
      } else {
        // handle HTTP error...
      }
    })

  return res
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
      IPFS: IPFSResponseData
      Sia: SiaResponseData
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
  let replicationData: {
    IPFS: IPFSResponseData
    Sia: SiaResponseData
    Filecoin: any
    Filefilego: any
  } = {
    IPFS: {
      links: edgeNodes.map((node) => node + '/gw/'),
      status: 'Replicated',
      metadata: null
    },
    Sia: {
      links: ['https://sia-integration.delta.storage/open/object/meta/'],
      status: '',
      metadata: null
    },
    Filecoin: {
      links: [],
      status: '',
      metadata: null
    },
    Filefilego: {
      links: [],
      status: '',
      metadata: null
    }
  }
  replicationData.IPFS.metadata = await this.getIPFSFileMetadata(cid)
  replicationData.Sia.metadata = await this.getSiaFileMetadata(cid)
  replicationData.Sia.status =
    replicationData.Sia.metadata === null ||
    !replicationData.Sia.metadata?.object.eTag.length
      ? 'In Progress'
      : 'Replicated'

  return replicationData
}

export async function getIPFSFileMetadata(
  this: DeltaStorageSDK,
  cid: string
): Promise<IPFSMetadata | null> {
  try {
    const ipfsResponse = await axios.get(`${this.host}/files/metadata/${cid}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    })
    const ipfsMetadata = ipfsResponse?.data
    if (ipfsMetadata) {
      return ipfsMetadata
    }
  } catch (error) {
    console.log(error)
  }
  return null
}

export async function getSiaFileMetadata(
  this: DeltaStorageSDK,
  cid: string
): Promise<SiaMetadata | null> {
  try {
    const siaResponse = await axios.get(
      `${this.siaHost}/open/object/meta/${this.userId}/${cid}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`
        }
      }
    )
    const siaMetadata = siaResponse?.data
    if (siaMetadata) {
      return siaMetadata
    }
  } catch (error) {
    console.log(error)
  }
  return null
}
