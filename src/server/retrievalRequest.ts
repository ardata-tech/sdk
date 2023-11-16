import axios from 'axios'
import { Config } from '..'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import { RetrievalRequest } from '../types'

export interface RetrievalRequestOperationsInterface {
  create: (params: { dsn: string; fileId: string }) => Promise<any>
  details: (params: {
    dsn: string
    fileId: string
  }) => Promise<RetrievalRequest>
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
    },
    details: async ({ dsn, fileId }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'RETRIEVAL_REQUESTS is not allowed.'
      )
      const res = await axios.get(
        `${config.host}/retrieval-requests/${dsn}/${fileId}`,
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
