import axios from 'axios'
import { Config } from '..'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'

export interface RetrievalRequestOperationsInterface {
  create: (params: { dsn: string; fileId: string }) => Promise<any>
}

const RetrievalRequestOperations = (
  config: Config
): RetrievalRequestOperationsInterface => {
  return {
    create: async ({ dsn, fileId }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'RETRIEVAL_REQUESTS is not allowed.'
      )
      const res = await axios.post(
        `${config.host}/retrieval-requests/create`,
        { dsn, fileId },
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        }
      )
      return res.data
    }
  }
}
export default RetrievalRequestOperations
