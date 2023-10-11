import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import DeltaStorageSDK from '../index'
import axios from 'axios'

export async function readFileAccess(
  this: DeltaStorageSDK,
  fileId: string,
  cid: string
): Promise<any> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_FILE,
    'READ_FILE is not allowed.'
  )
  const result = await axios.get(
    `${this.webAppHost}/api/file-access/${fileId}/${cid}`,
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )

  return result.data
}

export async function addFileAccess(
  this: DeltaStorageSDK,
  fileId: string,
  cid: string,
  body: {
    email?: string
    password?: string
  }
): Promise<any> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.UPLOAD_FILE,
    'ADD_FILE_ACCESS is not allowed.'
  )
  const result = await axios.post(
    `${this.webAppHost}/api/file-access/${fileId}/${cid}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )

  return result.data
}

export async function deleteFileAccess(
  this: DeltaStorageSDK,
  fileId: string,
  cid: string,
  body: {
    email: string
    deleteAll?: boolean
  }
): Promise<any> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.UPLOAD_FILE,
    'DELETE_FILE_ACCESS is not allowed.'
  )
  const result = await axios.delete(
    `${this.webAppHost}/api/file-access/${fileId}/${cid}`,
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      },
      data: body
    }
  )

  return result.data
}

export async function updateFileAccess(
  this: DeltaStorageSDK,
  fileId: string,
  cid: string,
  body: {
    secureSharing: 'PUBLIC' | 'PASSWORD' | 'RESTRICTED'
  }
): Promise<any> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.UPLOAD_FILE,
    'UPDATE_FILE_ACCESS is not allowed.'
  )
  const result = await axios.put(
    `${this.webAppHost}/api/file-access/${fileId}/${cid}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )

  return result.data
}

export async function verifyFileAccessPassword(
  this: DeltaStorageSDK,
  fileId: string,
  cid: string,
  body: {
    password: string
  }
): Promise<any> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.UPLOAD_FILE,
    'UPDATE_FILE_ACCESS is not allowed.'
  )
  const result = await axios.post(
    `${this.webAppHost}/api/file-access/password/${fileId}/${cid}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    }
  )

  return result.data
}
