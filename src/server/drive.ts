import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import axios from 'axios'
import { DataResponsePromise, Directory, File } from '../types'
import { Config } from '..'

export interface DriveOperationsInterface {
  getAll: () => DataResponsePromise<{ drives: Directory[] }>
  contents: (params: {
    id: string
  }) => DataResponsePromise<{ directories: Directory[]; files: File[] }>
  create: (params: {
    name: string
    storageClass?: string
  }) => DataResponsePromise<Pick<Directory, 'id' | 'name' | 'storageClassName'>>
  rename: (params: {
    id: string
    name: string
  }) => DataResponsePromise<Pick<Directory, 'id' | 'name' | 'storageClassName'>>
  move: (params: {
    driveId: string
    directoryIdsToMove: string[]
    fileIdsToMove?: string[]
  }) => DataResponsePromise<Pick<Directory, 'id' | 'name' | 'storageClassName'>>
  delete: (params: { id: string }) => DataResponsePromise<{
    deletedFolders: string[]
    deletedFiles: string[]
  }>
  getTotalSize: (params: {
    id: string
  }) => DataResponsePromise<{ totalSize: bigint }>
}

const DriveOperations = (config: Config): DriveOperationsInterface => {
  return {
    getAll: async () => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'LIST_ALL_DRIVES is not allowed.'
      )

      try {
        const res = await axios.get(`${config.host}/drives`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })
        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    contents: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'VIEW_DRIVE_CONTENTS is not allowed.'
      )

      try {
        const res = await axios.get(`${config.host}/drives/${id}/contents`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })
        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    create: async ({ name, storageClass }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY,
        'CREATE_DRIVE is not allowed.'
      )

      try {
        const res = await axios.post(
          `${config.host}/drives/create`,
          { name, storageClass },
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
    rename: async ({ id, name }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
        'UPDATE_DRIVE is not allowed.'
      )

      try {
        const res = await axios.put(
          `${config.host}/drives/${id}`,
          { name },
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
    move: async ({ driveId, directoryIdsToMove, fileIdsToMove }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
        'UPDATE_DRIVE is not allowed.'
      )

      const res = await axios.put(
        `${config.host}/drives/${driveId}`,
        { move: directoryIdsToMove, moveFiles: fileIdsToMove },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
      return res.data
    },
    delete: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.DELETE_DIRECTORY,
        'DELETE_DRIVE is not allowed.'
      )

      try {
        const res = await axios.delete(`${config.host}/drives/${id}`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })

        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    getTotalSize: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DRIVE is not allowed.'
      )

      try {
        const result = await axios.get(`${config.host}/drives/${id}/size`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })
        return [result.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    }
  }
}

export default DriveOperations
