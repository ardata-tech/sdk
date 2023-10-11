import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import DeltaStorageSDK from '../index'
import axios from 'axios'
import { Directory, File } from '../types'

export async function readDirectory(
  this: DeltaStorageSDK,
  id?: string
): Promise<{
  data: {
    directories: Directory[]
    files: File[] // todo
  }
}> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_DIRECTORY,
    'READ_DIRECTORY is not allowed.'
  )
  return await axios.get(`${this.host}/directory/${id ?? ''}`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
}

export async function readDirectoryBySegment(
  this: DeltaStorageSDK,
  segments: string
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_DIRECTORY,
    'READ_DIRECTORY is not allowed.'
  )
  const query = segments.split('/').join('&segment=')

  return await axios.get(`${this.host}/directory?segment=${query}`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
}

export async function createDirectory(
  this: DeltaStorageSDK,
  name: string,
  parentDirectoryId?: string,
  storageClass?: string
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.CREATE_DIRECTORY,
    'CREATE_DIRECTORY is not allowed.'
  )
  return await axios.post(
    `${this.host}/directory/create`,
    { name, parentDirectoryId, storageClass },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
}

export async function renameDirectory(
  this: DeltaStorageSDK,
  id: string,
  name: string
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
    'UPDATE_DIRECTORY is not allowed.'
  )
  return await axios.put(
    `${this.host}/directory/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
}

export async function updateDirectory(
  this: DeltaStorageSDK,
  id: string,
  name: string,
  storageClass?: string
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
    'UPDATE_DIRECTORY is not allowed.'
  )
  return await axios.put(
    `${this.host}/directory/${id}`,
    { name, storageClass },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
}

export async function move(
  this: DeltaStorageSDK,
  parentId: string,
  childrenIds: string[],
  childrenFileIds?: string[]
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
    'UPDATE_DIRECTORY is not allowed.'
  )
  return await axios.put(
    `${this.host}/directory/${parentId}`,
    { move: childrenIds, moveFiles: childrenFileIds },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
}

export async function deleteDirectory(this: DeltaStorageSDK, id: string) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.DELETE_DIRECTORY,
    'DELETE_DIRECTORY is not allowed.'
  )
  return await axios.delete(`${this.host}/directory/${id}`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
}

export async function getTotalSize(this: DeltaStorageSDK): Promise<bigint> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_DIRECTORY,
    'READ_DIRECTORY is not allowed.'
  )
  const result = await axios.get(`${this.host}/total-size`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })

  return result.data.totalSize
}

export async function readDirectorySize(
  this: DeltaStorageSDK,
  id: string
): Promise<bigint> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_DIRECTORY,
    'READ_DIRECTORY is not allowed.'
  )
  const result = await axios.get(`${this.host}/directory/${id}/size`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })

  return result.data.totalSize
}
