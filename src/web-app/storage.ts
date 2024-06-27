import axios from 'axios'
import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import { Config } from '..'

export interface StorageOperationsInterface {
  read: () => Promise<any>
}

const StorageOperations = (config: Config): StorageOperationsInterface => {
  return {
    read: async () => {
      verifyAuthorizedCommand(
        config.scope,
        OPERATION_SCOPE.READ_DIRECTORY,
        'READ_DIRECTORY is not allowed.'
      )

      try {
        const result = await axios.get(`${config.webAppHost}/api/storage`, {
          headers: {
            Authorization: `Bearer ${config.apiKey}`
          }
        })

        return [result.data, null]
      } catch (error: any) {
        console.error(error)
        return [null, error.response.data]
      }
    }
  }
}

export default StorageOperations
