import axios from 'axios'
import { Config } from '..'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import { DataResponsePromise, RetrievalRequest } from '../types'

export interface RetrievalRequestOperationsInterface {
  create: (params: { dsn: string; fileId: string }) => DataResponsePromise
  details: (params: {
    dsn: string
    fileId: string
  }) => DataResponsePromise<RetrievalRequest>
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

      try {
        const res = await axios.post(
          `${config.host}/retrieval-requests/create`,
          { dsn, fileId },
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
    },
    details: async ({ dsn, fileId }) => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'RETRIEVAL_REQUESTS is not allowed.'
      )

      try {
        const res = await axios.get(
          `${config.host}/retrieval-requests/${dsn}/${fileId}`,
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
  }
}
export default RetrievalRequestOperations
