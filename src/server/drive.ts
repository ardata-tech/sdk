import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import DeltaStorageSDK from '../index'
import axios from 'axios'
import { Directory, File } from '../types'

export async function listAllDrives(
  this: DeltaStorageSDK
): Promise<Directory[]> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_DIRECTORY,
    'LIST_ALL_DRIVES is not allowed.'
  )
  const res = await axios.get(`${this.host}/drives`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
  return res.data
}

export async function viewDriveContents(
  this: DeltaStorageSDK,
  id: string
): Promise<{
  data: {
    directories: Directory[]
    files: File[]
  }
}> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_DIRECTORY,
    'VIEW_DRIVE_CONTENTS is not allowed.'
  )
  const res = await axios.get(`${this.host}/drives/${id}/contents`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })
  return res.data
}

export async function createDrive(
  this: DeltaStorageSDK,
  name: string,
  storageClass?: string
): Promise<Pick<Directory, 'id' | 'name' | 'storageClassName'>> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.CREATE_DIRECTORY,
    'CREATE_DRIVE is not allowed.'
  )
  const res = await axios.post<
    Pick<Directory, 'id' | 'name' | 'storageClassName'>
  >(
    `${this.host}/drives/create`,
    { name, storageClass },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
  return { ...res.data }
}

export async function renameDrive(
  this: DeltaStorageSDK,
  id: string,
  name: string
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
    'UPDATE_DRIVE is not allowed.'
  )
  const res = await axios.put(
    `${this.host}/drives/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
  return res.data
}

export async function moveToDrive(
  this: DeltaStorageSDK,
  driveId: string,
  directoryIds: string[],
  fileIds?: string[]
) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
    'UPDATE_DRIVE is not allowed.'
  )

  const res = await axios.put(
    `${this.host}/drives/${driveId}`,
    { move: directoryIds, moveFiles: fileIds },
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )
  return res.data
}

export async function deleteDrive(this: DeltaStorageSDK, id: string) {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.DELETE_DIRECTORY,
    'DELETE_DRIVE is not allowed.'
  )
  const res = await axios.delete(`${this.host}/drives/${id}`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })

  return res.data
}

export async function readDriveSize(
  this: DeltaStorageSDK,
  id: string
): Promise<bigint> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_DIRECTORY,
    'READ_DRIVE is not allowed.'
  )
  const result = await axios.get(`${this.host}/drives/${id}/size`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })

  return result.data.totalSize
}
