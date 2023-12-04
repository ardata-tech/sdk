import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import axios from 'axios'
import { Directory, File } from '../types'
import { Config } from '..'

export interface DriveOperationsInterface {
  getAll: () => Promise<Directory[]>
  contents: (params: {
    id: string
  }) => Promise<{ directories: Directory[]; files: File[] }>
  create: (params: {
    name: string
    storageClass?: string
  }) => Promise<Pick<Directory, 'id' | 'name' | 'storageClassName'>>
  rename: (params: { id: string; name: string }) => Promise<any>
  move: (params: {
    driveId: string
    directoryIdsToMove: string[]
    fileIdsToMove?: string[]
  }) => Promise<any>
  delete: (params: { id: string }) => Promise<any>
  getTotalSize: (params: { id: string }) => Promise<bigint>
}

const DriveOperations = (config: Config): DriveOperationsInterface => {
  return {
    getAll: async () => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'LIST_ALL_DRIVES is not allowed.'
      )
      const res = await axios.get(`${config.host}/drives`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
      return res.data
    },
    contents: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'VIEW_DRIVE_CONTENTS is not allowed.'
      )
      const res = await axios.get(`${config.host}/drives/${id}/contents`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
      return res.data
    },
    create: async ({ name, storageClass }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY,
        'CREATE_DRIVE is not allowed.'
      )
      const res = await axios.post<
        Pick<Directory, 'id' | 'name' | 'storageClassName'>
      >(
        `${config.host}/drives/create`,
        { name, storageClass },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
      return res.data
    },
    rename: async ({ id, name }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
        'UPDATE_DRIVE is not allowed.'
      )
      const res = await axios.put(
        `${config.host}/drives/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
      return res.data
    },
    move: async ({ driveId, directoryIdsToMove, fileIdsToMove }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
        'UPDATE_DRIVE is not allowed.'
      )

      try {
        const res = await axios.put(
          `${config.host}/drives/${driveId}`,
          { move: directoryIdsToMove, moveFiles: fileIdsToMove },
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )
        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    delete: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.DELETE_DIRECTORY,
        'DELETE_DRIVE is not allowed.'
      )
      const res = await axios.delete(`${config.host}/drives/${id}`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })

      return res.data
    },
    getTotalSize: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DRIVE is not allowed.'
      )
      const result = await axios.get(`${config.host}/drives/${id}/size`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
      return result.data.totalSize
    }
  }
}

export default DriveOperations
