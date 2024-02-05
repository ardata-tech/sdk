import axios from 'axios'
import { Config } from '..'
import { DataResponsePromise } from '../types'

interface SettingsResponse {
  node: string | null
  isSecureMode: boolean
  customEdgeNodes: string[]
}

export interface SettingsOperationsInterface {
  read: () => DataResponsePromise<{ settings: SettingsResponse }>
  update: (params: {
    node?: string | null
    encryptionKey?: string
    isSecureMode?: boolean
  }) => DataResponsePromise
  getEncryptionKey: () => Promise<any>
  verifyEncryptionKey: (params: { encryptionKey: string }) => Promise<any>
}

const SettingsOperations = (config: Config): SettingsOperationsInterface => {
  return {
    read: async () => {
      try {
        const result = await axios.get(
          `${config.webAppHost}/api/user/settings`,
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )

        return [result.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    update: async ({ node, encryptionKey, isSecureMode }) => {
      try {
        const result = await axios.put(
          `${config.webAppHost}/api/user/settings`,
          { node, encryptionKey, isSecureMode },
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )

        return [result.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    // TODO: Add test
    getEncryptionKey: async () => {
      try {
        const result = await axios.get(
          `${config.webAppHost}/api/user/settings/encryption-key`,
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )

        return [result.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    },
    // TODO: Add test
    verifyEncryptionKey: async ({ encryptionKey }) => {
      try {
        const result = await axios.post(
          `${config.webAppHost}/api/user/settings/encryption-key`,
          { encryptionKey },
          {
            headers: {
              Authorization: `Bearer ${config.apiKey}`
            }
          }
        )
        return [result.data, null]
      } catch (error: any) {
        return [null, error.response.data]
      }
    }
  }
}

export default SettingsOperations
