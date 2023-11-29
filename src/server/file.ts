import axios, { GenericAbortSignal } from 'axios'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import {
  File,
  IPFSMetadata,
  IPFSResponseData,
  SiaMetadata,
  SiaResponseData
} from '../index'
import { Config } from '..'
import { DataResponse, DataResponsePromise } from '../types'

export interface FileOperationsInterface {
  list: () => DataResponsePromise<{ files: File[] }>
  details: (params: { id: string }) => DataResponsePromise<File>
  upload: (params: {
    file: any
    directoryId: string
    storageClasses?: string[]
    setProgress?: (progress: number) => void
    signal?: GenericAbortSignal | undefined
  }) => DataResponsePromise<File>
  directEdgeUpload: (params: {
    file: any
    setProgress?: (progress: number) => void
    signal?: GenericAbortSignal | undefined
  }) => Promise<any>
  bulkUpload: (params: {
    files: { file: any; directoryId: string; storageClasses?: string[] }[]
  }) => Promise<[Array<DataResponse & File> | null, error: DataResponse | null]>
  delete: (params: { id: string }) => DataResponsePromise<File>
  rename: (params: { id: string; name: string }) => DataResponsePromise
  update: (params: {
    id: string
    name?: string
    file?: any
    addStorageClasses?: string[]
    removeStorageClasses?: string[]
    setProgress?: (progress: number) => void
    signal?: GenericAbortSignal | undefined
  }) => DataResponsePromise<File>
  getReplications: (params: { cid: string }) => Promise<
    [
      {
        IPFS: IPFSResponseData
        Sia: SiaResponseData
        Filecoin: any
        Filefilego: any
      } | null,
      null | any
    ]
  >
  getIPFSFileMetadata: (params: {
    cid: string
  }) => DataResponsePromise<IPFSMetadata>
  getSiaFileMetadata: (params: {
    cid: string
  }) => DataResponsePromise<SiaMetadata>
  getURL: (params: {
    id: string
    password?: string
    setProgress?: (progress: number) => void
    signal?: GenericAbortSignal | undefined
  }) => Promise<[string | null, null | DataResponse]>
  download: (params: {
    url: string
    name: string
  }) => Promise<{ success: boolean }>
  getTotalSize: () => DataResponsePromise<{ totalSize: bigint }>
}

const FileOperations = (config: Config): FileOperationsInterface => {
  return {
    list: async () => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_FILE,
        'READ_FILE is not allowed.'
      )

      try {
        const res = await axios.get(`${config.host}/files/`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })
        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    details: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_FILE,
        'READ_FILE is not allowed.'
      )

      try {
        const res = await axios.get(`${config.host}/files/${id}`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })
        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
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

      try {
        const res = await axios.post(`${config.host}/files/upload`, formData, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          },
          signal,
          onUploadProgress: (progressEvent) => {
            if (!setProgress) return
            setProgress(0)
            const progress = progressEvent.progress! * 100
            setProgress(progress)
          }
        })

        return [res.data, null]
      } catch (error: any) {
        // if the reason behind the failure
        // is a cancellation
        if (axios.isCancel(error)) {
          console.error('Uploading canceled')
          return [
            null,
            {
              success: false,
              code: 499,
              message: 'Uploading canceled'
            }
          ]
        } else {
          return [null, error.response.data]
          // handle HTTP error...
        }
      }
    },
    directEdgeUpload: async ({ file, setProgress, signal }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE,
        'UPLOAD_FILE is not allowed.'
      )
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios
        .post(`${config.host}/files/direct-edge-upload`, formData, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          },
          signal,
          onUploadProgress: (progressEvent) => {
            if (!setProgress) return
            setProgress(0)
            const progress = progressEvent.progress! * 100
            setProgress(progress)
          }
        })
        .catch(function (e) {
          // if the reason behind the failure
          // is a cancellation
          if (axios.isCancel(e)) {
            console.error('Uploading canceled')
          } else {
            return e.response
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

      try {
        const filesData: Array<DataResponse & File> = []
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

            const res = await axios.post(
              `${config.host}/files/upload`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${config.apiKey}`
                }
              }
            )

            filesData.push(res.data)
          })
        )

        return [filesData, null]
      } catch (error: any) {
        return [null, error]
      }
    },
    delete: async ({ id }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.DELETE_FILE,
        'DELETE_FILE is not allowed.'
      )

      try {
        const res = await axios.delete(`${config.host}/files/${id}`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })
        return [res.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    rename: async ({ id, name }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE | OPERATION_SCOPE.DELETE_FILE,
        'RENAME_FILE is not allowed.'
      )

      try {
        const res = await axios.put(
          `${config.host}/files/${id}`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )
        return [res.data as DataResponse, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    update: async ({
      id,
      name,
      addStorageClasses,
      removeStorageClasses,
      file,
      setProgress,
      signal
    }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE | OPERATION_SCOPE.DELETE_FILE,
        'UPDATE_FILE is not allowed.'
      )
      if (file !== undefined) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          const res = await axios.put(
            `${config.host}/files/${id}/update-file-content`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${config.apiKey}`
              },
              signal,
              onUploadProgress: (progressEvent) => {
                if (!setProgress) return
                setProgress(0)
                const progress = progressEvent.progress! * 100
                setProgress(progress)
              }
            }
          )
          return [res.data, null]
        } catch (error: any) {
          // if the reason behind the failure
          // is a cancellation
          if (axios.isCancel(error)) {
            console.error('Uploading canceled')
            return [
              null,
              {
                success: false,
                code: 499,
                message: 'Uploading canceled'
              } as DataResponse
            ]
          } else {
            return [null, error.response.data]
            // handle HTTP error...
          }
        }
      } else {
        try {
          const res = await axios.put(
            `${config.host}/files/${id}`,
            { name, addStorageClasses, removeStorageClasses },
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
      }
    },
    getReplications: async ({ cid }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_FILE,
        'READ_FILE is not allowed.'
      )

      try {
        const defaults = await axios.get(`${config.host}/edge-nodes`, {
          headers: { Authorization: `Bearer ${config.apiKey}` }
        })

        let replicationData: {
          IPFS: IPFSResponseData
          Sia: SiaResponseData
          Filecoin: any
          Filefilego: any
        } = {
          IPFS: {
            links: defaults.data.edgeNodes.map((node: string) => node + '/gw/'),
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

        const [ipfsMetadata, ipfsMetadataError] = await FileOperations(
          config
        ).getIPFSFileMetadata({
          cid
        })
        replicationData.IPFS.metadata = ipfsMetadata

        const [siaFileMetadata, siaFileMetadataError] = await FileOperations(
          config
        ).getSiaFileMetadata({ cid })
        replicationData.Sia.metadata = siaFileMetadata

        replicationData.Sia.status =
          replicationData.Sia.metadata === null ||
          !replicationData.Sia.metadata?.object.eTag.length
            ? 'In Progress'
            : 'Replicated'

        return [replicationData, { ipfsMetadataError, siaFileMetadataError }]
      } catch (error: any) {
        return [null, error.response.data]
      }
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

        return [ipfsMetadata, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
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
        return [siaMetadata, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    getURL: async ({ id, password, signal, setProgress }) => {
      try {
        const file = await axios.get(`${config.host}/files/${id}`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })

        const size = file.data.size

        const response = await axios.post(
          `${config.host}/files/decrypt/${id}`,
          { password },
          {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            },
            signal,
            onDownloadProgress: (progressEvent) => {
              if (!setProgress) return
              setProgress(0)
              const progress = (progressEvent.loaded / size) * 100
              setProgress(progress)
            }
          }
        )
        const contentType = response.headers['content-type']
        let url: string = ''
        if (typeof window === 'undefined') {
          url = URL.createObjectURL(
            new Blob([response.data], { type: contentType })
          )
        } else {
          url = window.URL.createObjectURL(
            new Blob([response.data], { type: contentType })
          )
        }
        return [url, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    download: async ({ url, name }) => {
      try {
        // Create an anchor tag and simulate a click to trigger the download
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.target = '_self'
        anchor.download = name // Specify the desired file name
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)

        // Optionally, revoke the blob URL after the download starts
        window.URL.revokeObjectURL(url)

        return { success: true }
      } catch (error) {
        console.log(error)
      }

      return { success: false }
    },
    getTotalSize: async () => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )

      try {
        const result = await axios.get(`${config.host}/files/total-size`, {
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

export default FileOperations
