import { verifyAuthorizedCommand } from '../authorization'
import { OPERATION_SCOPE } from '../constants'
import DeltaStorageSDK from '../index'
import axios from 'axios'

export async function readStorage(this: DeltaStorageSDK): Promise<any> {
  verifyAuthorizedCommand(
    this.scope,
    OPERATION_SCOPE.READ_DIRECTORY,
    'READ_DIRECTORY is not allowed.'
  )
  const result = await axios.get(`${this.webAppHost}/api/storage`, {
    headers: {
      Authorization: `Bearer ${this.apiKey}`
    }
  })

  return result.data
}
