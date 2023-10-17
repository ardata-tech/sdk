import axios from 'axios'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import { Config } from '..'
import { Directory, File } from '../types'

export interface DirectoryOperationsInterface {
  contents: (params: {
    id?: string
  }) => Promise<{ directories: Directory[]; files: File[] }>
  getBySegment: (params: { segments: string }) => Promise<{
    directories: Pick<Directory, 'name' | 'id'>
    directoryLink: string
  }>
  create: (params: {
    name: string
    parentDirectoryId?: string
    storageClass?: string
  }) => Promise<any>
  rename: (params: { id: string; name: string }) => Promise<any>
  update: (params: {
    id: string
    name: string
    storageClass?: string
  }) => Promise<any>
  move: (params: {
    id: string
    directoryIdsToMove: string[]
    fileIdsToMove?: string[]
  }) => Promise<any>
  delete: (params: { id: string }) => Promise<any>
  getTotalSize: (params: { id: string }) => Promise<bigint>
  download: (params: {
    id: string
    name: string
  }) => Promise<{ success: boolean }>
  getZip: (params: {
    id: string
    name: string
  }) => Promise<{ success: boolean }>
}

const DirectoryOperations = (config: Config): DirectoryOperationsInterface => {
  return {
    contents: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )
      const res = await axios.get(`${config.host}/directory/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
      return res.data
    },
    getBySegment: async ({ segments }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )
      const query = segments.split('/').join('&segment[]=')

      const res = await axios.get(
        `${config.host}/directory?segment[]=${query}`,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
      return res.data
    },
    create: async ({ name, parentDirectoryId, storageClass }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY,
        'CREATE_DIRECTORY is not allowed.'
      )
      const res = await axios.post(
        `${config.host}/directory/create`,
        { name, parentDirectoryId, storageClass },
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
        'UPDATE_DIRECTORY is not allowed.'
      )
      const res = await axios.put(
        `${config.host}/directory/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
      return res.data
    },
    update: async ({ id, name, storageClass }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
        'UPDATE_DIRECTORY is not allowed.'
      )
      const res = await axios.put(
        `${config.host}/directory/${id}`,
        { name, storageClass },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
      return res.data
    },
    move: async ({ id, directoryIdsToMove, fileIdsToMove }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.CREATE_DIRECTORY | OPERATION_SCOPE.DELETE_DIRECTORY,
        'UPDATE_DIRECTORY is not allowed.'
      )
      const res = await axios.put(
        `${config.host}/directory/${id}`,
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
        'DELETE_DIRECTORY is not allowed.'
      )
      const res = await axios.delete(`${config.host}/directory/${id}`, {
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
        'READ_DIRECTORY is not allowed.'
      )
      const result = await axios.get(`${config.host}/directory/${id}/size`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })

      return result.data.totalSize
    },
    download: async ({ id, name }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )
      try {
        const response = await axios.get(`${config.host}/directory/${id}/zip`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const a = document.createElement('a')
        a.href = url
        a.download = `${name}-${Date.now()}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        return { success: true }
      } catch (error) {
        return { success: false }
      }
    },
    getZip: async ({ id, name }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )
      const res = await axios.get(`${config.host}/directory/${id}/zip`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
      return res.data
    }
  }
}

export default DirectoryOperations
