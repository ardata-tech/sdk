import { verifyAuthorizedCommand } from './authorization'
import { OPERATION_SCOPE } from './constants'
import DeltaStorageSDK from './index'
import axios from 'axios'

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
  name: string,
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
  formData.append('name', name)
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
    name: string
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
      formData.append('name', data.name)
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
