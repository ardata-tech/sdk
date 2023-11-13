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

      const res = await axios.post(`${config.host}/export/${id}`, undefined, {
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

      return res.data
    } catch (error) {
      // if the reason behind the failure
      // is a cancellation
      if (axios.isCancel(error)) {
        console.error('Downloading canceled')
      } else {
        // handle HTTP error...
      }
    }
  }

export default ExportOperation
