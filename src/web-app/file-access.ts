import axios from 'axios'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import { Config } from '..'

export interface FileAccessOperationsInterface {
  read: (params: { fileId: string; cid: string }) => Promise<any>
  add: (params: {
    fileId: string
    cid: string
    body: { email?: string; password?: string }
  }) => Promise<any>
  delete: (params: {
    fileId: string
    cid: string
    body: { email: string; deleteAll?: boolean }
  }) => Promise<any>
  update: (params: {
    fileId: string
    cid: string
    body: { secureSharing: 'PUBLIC' | 'PASSWORD' | 'RESTRICTED' }
  }) => Promise<any>
  verifyPassword: (params: {
    fileId: string
    cid: string
    body: { password: string }
  }) => Promise<any>
}
const FileAccessOperations = (
  config: Config
): FileAccessOperationsInterface => {
  return {
    read: async ({ fileId, cid }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_FILE,
        'READ_FILE is not allowed.'
      )
      const result = await axios.get(
        `${config.webAppHost}/api/file-access/${fileId}/${cid}`,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
      return result.data
    },
    add: async ({ fileId, cid, body }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE,
        'ADD_FILE_ACCESS is not allowed.'
      )
      const result = await axios.post(
        `${config.webAppHost}/api/file-access/${fileId}/${cid}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )

      return result.data
    },
    delete: async ({ fileId, cid, body }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE,
        'DELETE_FILE_ACCESS is not allowed.'
      )
      const result = await axios.delete(
        `${config.webAppHost}/api/file-access/${fileId}/${cid}`,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          },
          data: body
        }
      )

      return result.data
    },
    update: async ({ fileId, body, cid }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE,
        'UPDATE_FILE_ACCESS is not allowed.'
      )
      const result = await axios.put(
        `${config.webAppHost}/api/file-access/${fileId}/${cid}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )

      return result.data
    },
    verifyPassword: async ({ body, cid, fileId }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE,
        'UPDATE_FILE_ACCESS is not allowed.'
      )
      const result = await axios.post(
        `${config.webAppHost}/api/file-access/password/${fileId}/${cid}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )

      return result.data
    }
  }
}

export default FileAccessOperations
