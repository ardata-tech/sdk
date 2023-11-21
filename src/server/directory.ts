import axios, { GenericAbortSignal } from 'axios'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import { Config } from '..'
import {
  DataResponsePromise,
  Directory,
  File,
  StorageClassName
} from '../types'

export interface DirectoryOperationsInterface {
  contents: (params: {
    id?: string
  }) => DataResponsePromise<{ directories: Directory[]; files: File[] }>
  getBySegment: (params: { segments: string }) => DataResponsePromise<{
    directories: Pick<Directory, 'name' | 'id'>[]
    directoryLink: string
  }>
  create: (params: {
    name: string
    parentDirectoryId?: string
    storageClass?: string
  }) => DataResponsePromise<{
    id: string
    name: string
    storageClassName: null | StorageClassName
  }>
  rename: (params: { id: string; name: string }) => DataResponsePromise<{
    id: string
    name: string
    storageClassName: null | StorageClassName
  }>
  update: (params: {
    id: string
    name: string
    storageClass?: string
  }) => DataResponsePromise<{
    id: string
    name: string
    storageClassName: null | StorageClassName
  }>
  move: (params: {
    id: string
    directoryIdsToMove: string[]
    fileIdsToMove?: string[]
  }) => DataResponsePromise<{
    id: string
    name: string
    storageClassName: null | StorageClassName
  }>
  delete: (params: { id: string }) => DataResponsePromise<{
    deletedFolders: string[]
    deletedFiles: string[]
  }>
  getTotalSize: (params: { id: string }) => DataResponsePromise<bigint>
  download: (params: {
    id: string
    name: string
    setProgress?: (progress: number) => void
    signal?: GenericAbortSignal | undefined
  }) => DataResponsePromise
  getZip: (params: { id: string; name: string }) => DataResponsePromise
}

const DirectoryOperations = (config: Config): DirectoryOperationsInterface => {
  return {
    contents: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )

      try {
        const res = await axios.get(`${config.host}/directory/${id ?? ''}`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })
        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    getBySegment: async ({ segments }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )

      try {
        const query = segments.split('/').join('&segment[]=')

        const res = await axios.get(
          `${config.host}/directory?segment[]=${query}`,
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
    create: async ({ name, parentDirectoryId, storageClass }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY,
        'CREATE_DIRECTORY is not allowed.'
      )

      try {
        const res = await axios.post(
          `${config.host}/directory/create`,
          { name, parentDirectoryId, storageClass },
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
        'UPDATE_DIRECTORY is not allowed.'
      )

      try {
        const res = await axios.put(
          `${config.host}/directory/${id}`,
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
    update: async ({ id, name, storageClass }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
        'UPDATE_DIRECTORY is not allowed.'
      )

      try {
        const res = await axios.put(
          `${config.host}/directory/${id}`,
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
    move: async ({ id, directoryIdsToMove, fileIdsToMove }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
        'UPDATE_DIRECTORY is not allowed.'
      )

      try {
        const res = await axios.put(
          `${config.host}/directory/${id}`,
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
        'DELETE_DIRECTORY is not allowed.'
      )

      try {
        const res = await axios.delete(`${config.host}/directory/${id}`, {
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
        'READ_DIRECTORY is not allowed.'
      )

      try {
        const result = await axios.get(`${config.host}/directory/${id}/size`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })

        return [result.data.totalSize, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    download: async ({ id, name, signal, setProgress }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )
      try {
        const dir = await axios.get(`${config.host}/directory/${id}/size`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })

        const dirSize = dir.data.totalSize

        const response = await axios.get(`${config.host}/directory/${id}/zip`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          },
          signal,
          onDownloadProgress: (progressEvent) => {
            if (!setProgress) return
            setProgress(0)
            const progress = (progressEvent.loaded / dirSize) * 100
            setProgress(progress)
          }
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        // Create an anchor tag and simulate a click to trigger the download
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.target = '_self'
        anchor.download = `${name}-${Date.now()}.zip` // Specify the desired file name
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)

        // Optionally, revoke the blob URL after the download starts
        window.URL.revokeObjectURL(url)

        return [response.data, null]
      } catch (error: any) {
        // if the reason behind the failure
        // is a cancellation
        if (axios.isCancel(error)) {
          console.error('Downloading canceled')
          return [
            null,
            { success: false, message: 'Downloading canceled', code: 499 }
          ]
        } else {
          return [null, error.response.data]
          // handle HTTP error...
        }
      }
    },
    getZip: async ({ id, name }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )

      try {
        const res = await axios.get(`${config.host}/directory/${id}/zip`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })
        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    }
  }
}

export default DirectoryOperations
