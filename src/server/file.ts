import axios, { GenericAbortSignal } from 'axios'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE, edgeNodes } from '../constants'
import {
  File,
  IPFSMetadata,
  IPFSResponseData,
  SiaMetadata,
  SiaResponseData
} from '../index'
import { Config } from '..'

export interface FileOperationsInterface {
  list: () => Promise<File[]>
  details: (params: { id: string }) => Promise<File>
  upload: (params: {
    file: any
    directoryId: string
    storageClasses?: string[]
    setProgress?: (progress: number) => void
    signal?: GenericAbortSignal | undefined
  }) => Promise<any>
  bulkUpload: (params: {
    files: { file: any; directoryId: string; storageClasses?: string[] }[]
  }) => Promise<any>
  delete: (params: { id: string }) => Promise<any>
  rename: (params: { id: string; name: string }) => Promise<any>
  update: (params: {
    id: string
    name?: string
    addStorageClasses?: string[]
    removeStorageClasses?: string[]
  }) => Promise<any>
  getReplications: (params: { cid: string }) => Promise<
    | {
        IPFS: any
        Sia: any
        Filecoin: any
        Filefilego: any
      }
    | undefined
  >
  getIPFSFileMetadata: (params: { cid: string }) => Promise<IPFSMetadata | null>
  getSiaFileMetadata: (params: { cid: string }) => Promise<SiaMetadata | null>
  getDataURI: (params: {
    id: string
    password?: string
  }) => Promise<File | null>
  getURL: (params: { id: string; password?: string }) => Promise<string | null>
  getTotalSize: () => Promise<bigint>
}

const FileOperations = (config: Config): FileOperationsInterface => {
  return {
    list: async () => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_FILE,
        'READ_FILE is not allowed.'
      )
      return await axios.get(`${config.host}/files/`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
    },
    details: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_FILE,
        'READ_FILE is not allowed.'
      )
      return await axios.get(`${config.host}/files/${id}`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
    },
    upload: async ({
      file,
      directoryId,
      storageClasses,
      setProgress,
      signal
    }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE,
        'UPLOAD_FILE is not allowed.'
      )

      const formData = new FormData()
      formData.append('file', file)
      formData.append('directoryId', directoryId)
      if (storageClasses && storageClasses.length > 0)
        formData.append('storageClasses', JSON.stringify(storageClasses))

      const res = await axios
        .post(`${config.host}/files/upload`, formData, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          },
          signal,
          onUploadProgress: (progressEvent) => {
            if (!setProgress) return
            setProgress(0)
            const progress = (progressEvent.loaded * 100) / progressEvent.total!
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

      if (res) return res.data
    },
    bulkUpload: async ({ files }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE,
        'UPLOAD_FILES is not allowed.'
      )

      await Promise.all(
        files.map(async (data) => {
          const formData = new FormData()
          formData.append('file', data.file)
          formData.append('directoryId', data.directoryId)
          if (data.storageClasses && data.storageClasses.length > 0)
            formData.append(
              'storageClasses',
              JSON.stringify(data.storageClasses)
            )

          return await axios.post(`${config.host}/files/upload`, formData, {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          })
        })
      )
    },
    delete: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.DELETE_FILE,
        'DELETE_FILE is not allowed.'
      )
      return await axios.delete(`${config.host}/files/${id}`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })
    },
    rename: async ({ id, name }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE | OPERATION_SCOPE.DELETE_FILE,
        'RENAME_FILE is not allowed.'
      )
      return await axios.put(
        `${config.host}/files/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
    },
    update: async ({ id, name, addStorageClasses, removeStorageClasses }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE | OPERATION_SCOPE.DELETE_FILE,
        'UPDATE_FILE is not allowed.'
      )
      return await axios.put(
        `${config.host}/files/${id}`,
        { name, addStorageClasses, removeStorageClasses },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
    },
    getReplications: async ({ cid }) => {
      verifyAuthorizedCommand(
        config.scope,
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
          links: [
            `https://sia-integration.delta.storage/open/object/meta/${config.userId}/`
          ],
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
      replicationData.IPFS.metadata = await FileOperations(
        config
      ).getIPFSFileMetadata({ cid })
      replicationData.Sia.metadata = await FileOperations(
        config
      ).getSiaFileMetadata({ cid })
      replicationData.Sia.status =
        replicationData.Sia.metadata === null ||
        !replicationData.Sia.metadata?.object.eTag.length
          ? 'In Progress'
          : 'Replicated'

      return replicationData
    },
    getIPFSFileMetadata: async ({ cid }) => {
      try {
        const ipfsResponse = await axios.get(
          `${config.host}/files/metadata/${cid}`,
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )
        const ipfsMetadata = ipfsResponse?.data
        if (ipfsMetadata) {
          return ipfsMetadata
        }
      } catch (error) {
        console.log(error)
      }
      return null
    },
    getSiaFileMetadata: async ({ cid }) => {
      try {
        const siaResponse = await axios.get(
          `${config.siaHost}/open/object/meta/${config.userId}/${cid}`,
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
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
    },
    getDataURI: async ({ id, password }) => {
      try {
        const dataURI = await axios.post<File>(
          `${config.host}/files/data-uri/${id}`,
          { password },
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )

        const dataURIdata = dataURI.data
        if (dataURIdata) return dataURIdata
      } catch (error) {
        console.log(error)
      }

      return null
    },
    getURL: async ({ id, password }) => {
      try {
        const response = await axios.post(
          `${config.host}/files/decrypt/${id}`,
          { password },
          {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )
        const contentType = response.headers['content-type']
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: contentType })
        )

        if (url) return url
      } catch (error) {
        console.log(error)
      }

      return null
    },
    getTotalSize: async () => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )
      const result = await axios.get(`${config.host}/files/total-size`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })

      return result.data.totalSize
    }
  }
}

export default FileOperations
