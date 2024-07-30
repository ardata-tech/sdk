import axios from 'axios'
import { Config } from '..'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import { DataResponsePromise } from '../types'

export interface DSNSOperationsInterface {
  upload: (params: {
    file: any
    filePath: string
    replicateTo: Record<'SIA', string>
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

      try {
        const res = await axios.get(`${config.host}/dsns/upload`, {
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
