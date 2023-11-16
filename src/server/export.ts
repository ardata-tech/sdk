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
      // Create an anchor tag and simulate a click to trigger the download
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.target = '_self'
      anchor.download = `Delta-${id}.zip` // Specify the desired file name
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)

      // Optionally, revoke the blob URL after the download starts
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
