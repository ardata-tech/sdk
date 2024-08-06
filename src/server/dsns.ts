import axios from 'axios'
import { Config } from '..'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import { DataResponsePromise } from '../types'

export interface DSNSOperationsInterface {
  upload: (params: {
    file: any
    filePath: string
    replicateTo: Record<'SIA', boolean>
  }) => DataResponsePromise
}

const DSNSOpetions = (config: Config): DSNSOperationsInterface => {
  return {
    upload: async ({ file, filePath, replicateTo }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.UPLOAD_FILE,
        'READ_FILE is not allowed'
      )

      const formData = new FormData()
      formData.append('file', file)
      if (filePath) formData.append('filePath', filePath)
      if (replicateTo)
        formData.append('replicateTo', JSON.stringify(replicateTo))

      try {
        const res = await axios.post(`${config.host}/dsns/upload`, formData, {
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

export default DSNSOpetions
