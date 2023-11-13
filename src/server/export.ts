import axios, { GenericAbortSignal } from 'axios'
import { Config } from '..'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'

export interface ExportOperationInterface {
  id: string
  setProgress?: (progress: number) => void
  signal?: GenericAbortSignal | undefined
}

const ExportOperation =
  (config: Config) => async (params: ExportOperationInterface) => {
    try {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.ADMIN,
        'EXPORT is not allowed.'
      )

      const { id, signal, setProgress } = params
      const totalSize = await axios.get(`${config.host}/files/total-size`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`
        }
      })

      const size = totalSize.data.totalSize

      const response = await axios.get(`${config.host}/export/${id}`, {
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
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `Delta-${id}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      return { success: true }
    } catch (error) {
      // if the reason behind the failure
      // is a cancellation
      if (axios.isCancel(error)) {
        console.error('Downloading canceled')
      } else {
        console.log(error)
        // handle HTTP error...
      }
    }
  }

export default ExportOperation
